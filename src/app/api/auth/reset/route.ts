export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  if (!body.email?.includes("@")) {
    return Response.json({ error: "Enter the email address linked to your account." }, { status: 400 });
  }
  // Email delivery can be attached later; this response intentionally does not reveal account existence.
  return Response.json({ ok: true, message: "If an account exists, recovery instructions are on their way." });
}
