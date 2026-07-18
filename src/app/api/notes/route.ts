import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessonProgress } from "@/db/schema";
import { authError, requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

function validLesson(lessonNumber: number) {
  return Number.isInteger(lessonNumber) && lessonNumber >= 1 && lessonNumber <= 9;
}

export async function PUT(request: Request) {
  try {
    const profile = await requireProfile();
    const body = (await request.json()) as { lessonNumber?: number; notes?: string };
    const lessonNumber = Number(body.lessonNumber);
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 12000) : null;
    if (!validLesson(lessonNumber) || notes === null) return Response.json({ error: "Choose a valid lesson and note." }, { status: 400 });
    const now = new Date();
    await db
      .insert(lessonProgress)
      .values({ userId: profile.id, lessonNumber, notes, updatedAt: now })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonNumber],
        set: { notes, updatedAt: now },
      });
    const item = await db.query.lessonProgress.findFirst({
      where: and(eq(lessonProgress.userId, profile.id), eq(lessonProgress.lessonNumber, lessonNumber)),
    });
    return Response.json({ progress: item });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") return authError();
    return Response.json({ error: "Unable to save your note." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const profile = await requireProfile();
    const body = (await request.json()) as { lessonNumber?: number };
    const lessonNumber = Number(body.lessonNumber);
    if (!validLesson(lessonNumber)) return Response.json({ error: "Choose a valid lesson." }, { status: 400 });
    await db
      .update(lessonProgress)
      .set({ notes: "", updatedAt: new Date() })
      .where(and(eq(lessonProgress.userId, profile.id), eq(lessonProgress.lessonNumber, lessonNumber)));
    return Response.json({ ok: true });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") return authError();
    return Response.json({ error: "Unable to clear your note." }, { status: 500 });
  }
}
