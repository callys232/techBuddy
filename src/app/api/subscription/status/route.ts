import { NextResponse, type NextRequest } from "next/server";
import { isEmailSubscribed } from "@/lib/subscription";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const active = await isEmailSubscribed(email);
  return NextResponse.json({ active });
}
