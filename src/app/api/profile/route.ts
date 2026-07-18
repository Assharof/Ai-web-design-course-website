import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { authError, requireProfile, toSafeUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const profile = await requireProfile();
    const body = (await request.json()) as { name?: string; avatarColor?: string };
    const name = body.name?.trim();
    const avatarColor = body.avatarColor;
    if (!name || name.length > 80) return Response.json({ error: "Please use a name between 1 and 80 characters." }, { status: 400 });
    const allowedColors = ["#0f766e", "#0e7490", "#7c3aed", "#be185d", "#b45309"];
    const update = { name, avatarColor: allowedColors.includes(avatarColor ?? "") ? avatarColor! : profile.avatarColor, updatedAt: new Date() };
    await db.update(profiles).set(update).where(eq(profiles.id, profile.id));
    const updated = await db.query.profiles.findFirst({ where: eq(profiles.id, profile.id) });
    return Response.json({ user: updated ? toSafeUser(updated) : toSafeUser(profile) });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") return authError();
    return Response.json({ error: "Unable to update your profile." }, { status: 500 });
  }
}
