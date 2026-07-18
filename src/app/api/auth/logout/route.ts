import { clearSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await clearSession();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to sign out right now." }, { status: 500 });
  }
}
