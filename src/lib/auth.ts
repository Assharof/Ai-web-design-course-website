import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { lessonProgress, profiles, sessions, type Profile } from "@/db/schema";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "assharof_session";
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export type SafeUser = Pick<Profile, "id" | "name" | "email" | "avatarColor" | "createdAt">;

export function toSafeUser(profile: Profile): SafeUser {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatarColor: profile.avatarColor,
    createdAt: profile.createdAt,
  };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [salt, stored] = encoded.split(":");
  if (!salt || !stored) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(stored, "hex");
  return storedBuffer.length === derived.length && timingSafeEqual(storedBuffer, derived);
}

function avatarFor(email: string) {
  const colors = ["#0f766e", "#0e7490", "#7c3aed", "#be185d", "#b45309"];
  const numeric = createHash("sha256").update(email).digest()[0] ?? 0;
  return colors[numeric % colors.length];
}

export async function ensureDemoUser() {
  const email = "demo@assharof.academy";
  const existing = await db.query.profiles.findFirst({ where: eq(profiles.email, email) });
  if (existing) return existing;

  const id = `student_${randomBytes(12).toString("hex")}`;
  const passwordHash = await hashPassword("demo1234");
  await db.insert(profiles).values({
    id,
    name: "Sherif Ahmed",
    email,
    passwordHash,
    avatarColor: "#0f766e",
  });
  await db.insert(lessonProgress).values(
    [1, 2, 3].map((lessonNumber) => ({
      userId: id,
      lessonNumber,
      completed: true,
      completedAt: new Date(Date.now() - (4 - lessonNumber) * 86_400_000),
      notes:
        lessonNumber === 3
          ? "The strongest prompts include a clear role, the audience, and the desired format."
          : "",
    })),
  );
  const created = await db.query.profiles.findFirst({ where: eq(profiles.id, id) });
  if (!created) throw new Error("Could not create demo account");
  return created;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + THIRTY_DAYS);
  await db.insert(sessions).values({ token, userId, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.token, token));
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
}

export async function getCurrentProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.query.sessions.findFirst({
    where: and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())),
  });
  if (!session) return null;
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.id, session.userId) });
  return profile ?? null;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("UNAUTHORIZED");
  return profile;
}

export function authError(message = "Please sign in to continue.") {
  return Response.json({ error: message }, { status: 401 });
}

export { avatarFor };
