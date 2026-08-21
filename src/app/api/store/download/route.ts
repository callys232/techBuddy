import { NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/store";
import { getVerifiedEmail } from "@/lib/auth";

export async function POST(req: Request) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slug = body?.slug as string | undefined;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const url = await getDownloadUrl(email, slug);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not generate download link";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
