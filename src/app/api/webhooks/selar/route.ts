import { db } from "@/db";
import { purchases, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (
    !process.env.SELAR_WEBHOOK_SECRET ||
    secret !== process.env.SELAR_WEBHOOK_SECRET
  ) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: {
    email?: string;
    order_id?: string | number;
    id?: string | number;
  };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid payload" }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email) {
    return Response.json({ error: "missing email" }, { status: 400 });
  }

  const orderId = String(payload.order_id ?? payload.id ?? "");

  // Check if purchase already exists
  const existingPurchase = await db.query.purchases.findFirst({
    where: eq(purchases.email, email),
  });

  if (!existingPurchase) {
    await db.insert(purchases).values({
      email,
      selarOrderId: orderId,
    });
  } else if (
    orderId &&
    existingPurchase.selarOrderId !== orderId
  ) {
    await db
      .update(purchases)
      .set({
        selarOrderId: orderId,
      })
      .where(eq(purchases.email, email));
  }

  // Check if the user has already registered
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.email, email),
  });

  // If yes, unlock the course immediately
  if (profile) {
    await db
      .update(profiles)
      .set({
        isPaid: true,
      })
      .where(eq(profiles.id, profile.id));

    await db
      .update(purchases)
      .set({
        claimed: true,
      })
      .where(eq(purchases.email, email));
  }

  return Response.json({ ok: true });
}