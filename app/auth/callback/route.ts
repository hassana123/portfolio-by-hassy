import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code)
    return NextResponse.redirect(new URL("/admin/login?oauth=failed", url));
  const client = await db();
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error)
    return NextResponse.redirect(new URL("/admin/login?oauth=failed", url));
  return NextResponse.redirect(new URL("/admin", url));
}
