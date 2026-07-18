import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessonProgress } from "@/db/schema";
import { authError, requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await requireProfile();
    const progress = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, profile.id))
      .orderBy(lessonProgress.lessonNumber);
    return Response.json({ progress });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") return authError();
    return Response.json({ error: "Unable to load your course progress." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const profile = await requireProfile();
    const body = (await request.json()) as { lessonNumber?: number; completed?: boolean };
    const lessonNumber = Number(body.lessonNumber);
    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 9 || typeof body.completed !== "boolean") {
      return Response.json({ error: "Choose a valid lesson and completion state." }, { status: 400 });
    }

    const now = new Date();
    await db
      .insert(lessonProgress)
      .values({ userId: profile.id, lessonNumber, completed: body.completed, completedAt: body.completed ? now : null, updatedAt: now })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonNumber],
        set: { completed: body.completed, completedAt: body.completed ? now : null, updatedAt: now },
      });
    const item = await db.query.lessonProgress.findFirst({
      where: and(eq(lessonProgress.userId, profile.id), eq(lessonProgress.lessonNumber, lessonNumber)),
    });
    return Response.json({ progress: item });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") return authError();
    return Response.json({ error: "Unable to update this lesson." }, { status: 500 });
  }
}
