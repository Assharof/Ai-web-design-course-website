import { randomBytes } from "crypto";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { avatarFor, createSession, hashPassword, toSafeUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    if (!name || !email || password.length < 8) {
      return Response.json({ error: "Add your name, a valid email, and a password with at least 8 characters." }, { status: 400 });
    }
    const profile = {
      id: `student_${randomBytes(12).toString("hex")}`,
      name,
      email,
      passwordHash: await hashPassword(password),
      avatarColor: avatarFor(email),
    };
    await db.insert(profiles).values(profile);
    await createSession(profile.id);
    const created = await db.query.profiles.findFirst({ where: (table, { eq }) => eq(table.id, profile.id) });
    return Response.json({ user: created ? toSafeUser(created) : { ...profile, createdAt: new Date() } }, { status: 201 });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") return Response.json({ error: "An account with that email already exists. Try signing in." }, { status: 409 });
    return Response.json({ error: "We couldn’t create your account. Please try again." }, { status: 500 });
  }
}
