import { getCurrentProfile, toSafeUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return Response.json({ error: "Not signed in." }, { status: 401 });
    return Response.json({ user: toSafeUser(profile) });
  } catch {
    return Response.json({ error: "Unable to load your account." }, { status: 500 });
  }
}
