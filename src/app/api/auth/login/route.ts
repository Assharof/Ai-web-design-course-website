import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createSession, toSafeUser, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return Response.json(
        { error: "Enter your email and password." },
        { status: 400 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.email, email),
    });

    if (!profile || !(await verifyPassword(password, profile.passwordHash))) {
      return Response.json(
        { error: "That email or password doesn't match our records." },
        { status: 401 }
      );
    }
    

    // Allow admins even if they haven't purchased
    if (!profile.isAdmin && !profile.isPaid) {
      return Response.json(
        {
          error:
            "You haven't purchased this course yet. Please complete your purchase before signing in.",
        },
        { status: 403 }
      );
    }

    await createSession(profile.id);

    return Response.json({
      user: toSafeUser(profile),
    });
  } catch {
    return Response.json(
      { error: "We couldn't sign you in. Please try again." },
      { status: 500 }
    );
  }
}