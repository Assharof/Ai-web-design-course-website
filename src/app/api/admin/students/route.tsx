import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await requireProfile();

    if (!admin.isAdmin) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

   const students = await db.query.profiles.findMany({
  columns: {
    id: true,
    name: true,
    email: true,
    isPaid: true,
    isAdmin: true,
    avatarColor: true,
    createdAt: true,
    updatedAt: true,
    passwordHash: false,
  },
  orderBy: (profiles, { desc }) => [desc(profiles.createdAt)],
});

    return Response.json({
      students,
    });
  } catch {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}