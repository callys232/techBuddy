import { NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  const slug = body?.slug as string | undefined;

  if (!email || !slug) {
    return NextResponse.json({ error: "email and slug are required" }, { status: 400 });
  }

  try {
    const url = await getDownloadUrl(email, slug);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not generate download link";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
