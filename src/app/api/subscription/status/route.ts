import { NextResponse, type NextRequest } from "next/server";
import { isEmailSubscribed } from "@/lib/subscription";
import { getVerifiedEmail } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const active = await isEmailSubscribed(email);
  return NextResponse.json({ active });
}
