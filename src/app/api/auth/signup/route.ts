import { randomBytes } from "crypto";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profiles, purchases } from "@/db/schema";
import {
  avatarFor,
  createSession,
  hashPassword,
  toSafeUser,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!name || !email || password.length < 8) {
      return Response.json(
        {
          error:
            "Add your name, a valid email, and a password with at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // Check if the email has already purchased the course
    const purchase = await db.query.purchases.findFirst({
      where: eq(purchases.email, email),
    });

    const profile = {
      id: `student_${randomBytes(12).toString("hex")}`,
      name,
      email,
      passwordHash: await hashPassword(password),
      avatarColor: avatarFor(email),
      isPaid: !!purchase,
    };

    await db.insert(profiles).values(profile);

    // Mark purchase as claimed if it exists
    if (purchase) {
      await db
        .update(purchases)
        .set({ claimed: true })
        .where(eq(purchases.email, email));
    }

    // Create a session so the user is logged in immediately
    await createSession(profile.id);

    // Fetch the newly created profile
    const created = await db.query.profiles.findFirst({
      where: eq(profiles.id, profile.id),
    });

    return Response.json(
      {
        user: created ? toSafeUser(created) : null,
        message: purchase
          ? "Account created successfully."
          : "Account created successfully. Purchase the course to unlock access.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    const code = (error as { code?: string }).code;

    if (code === "23505") {
      return Response.json(
        {
          error: "An account with that email already exists. Try signing in.",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We couldn't create your account.",
      },
      { status: 500 }
    );
  }
}