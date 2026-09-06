import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data, error } = await createServerClient().from("profiles").select("display_name, primary_goal, marketing_opt_in, onboarding_completed_at").eq("user_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load profile" }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function PUT(req: Request) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim().slice(0, 80) : null;
  const primaryGoal = typeof body?.primaryGoal === "string" ? body.primaryGoal.trim().slice(0, 80) : null;
  const complete = body?.complete === true;
  const { data, error } = await createServerClient().from("profiles").upsert({
    user_id: user.id, email: user.email, display_name: displayName, primary_goal: primaryGoal,
    marketing_opt_in: body?.marketingOptIn === true,
    onboarding_completed_at: complete ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" }).select("display_name, primary_goal, marketing_opt_in, onboarding_completed_at").single();
  if (error) return NextResponse.json({ error: "Could not save profile" }, { status: 500 });
  return NextResponse.json({ profile: data });
}
