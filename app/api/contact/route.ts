import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { configured, serviceDb } from "@/lib/supabase";
const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  subject: z.string().trim().max(160).default(""),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional(),
});
export async function POST(req: NextRequest) {
  const reply = (message: string, status: number) =>
    NextResponse.json({ message }, { status });
  if (
    !configured() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.CONTACT_RATE_LIMIT_SECRET
  )
    return reply(
      "Message delivery is not configured yet. Please use the email link if available.",
      503,
    );
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return reply("Please submit the form from this website.", 403);
  if (Number(req.headers.get("content-length") || 0) > 15000)
    return reply("Your message is too large.", 413);
  try {
    const raw = await req.text();
    if (raw.length > 15000) return reply("Your message is too large.", 413);
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success)
      return reply(
        "Please enter your name, a valid email, and a message of 10–5,000 characters.",
        400,
      );
    const { website, ...value } = parsed.data;
    if (website) return reply("Unable to accept this submission.", 400);
    const db = serviceDb();
    const ip =
      req.headers.get("x-vercel-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "shared-local";
    const key = createHmac("sha256", process.env.CONTACT_RATE_LIMIT_SECRET!)
      .update(ip)
      .digest("hex");
    const { data: allowed, error: limitError } = await db.rpc("contact_limit", {
      client_key: key,
    });
    if (limitError)
      return reply(
        "Message service is temporarily unavailable. Please try again.",
        503,
      );
    if (!allowed)
      return reply("Too many messages. Please try again in an hour.", 429);
    const { data, error } = await db
      .from("enquiries")
      .insert(value)
      .select("id")
      .single();
    if (error)
      return reply("Your message could not be saved. Please try again.", 503);
    let notification = "unconfigured";
    if (
      process.env.RESEND_API_KEY &&
      process.env.CONTACT_NOTIFICATION_FROM &&
      process.env.CONTACT_NOTIFICATION_TO
    ) {
      try {
        const result = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.CONTACT_NOTIFICATION_FROM,
            to: process.env.CONTACT_NOTIFICATION_TO,
            subject: `Portfolio enquiry: ${value.subject || "New message"}`,
            reply_to: value.email,
            text: `From: ${value.name} <${value.email}>\n\n${value.message}`,
          }),
          signal: AbortSignal.timeout(8000),
        });
        notification = result.ok ? "sent" : "failed";
      } catch {
        notification = "failed";
      }
      try {
        await db.from("enquiries").update({ notification }).eq("id", data.id);
      } catch {
        // The enquiry is already saved; bookkeeping cannot undo that success.
      }
    }
    return reply("Thank you — your message has been saved in my inbox.", 201);
  } catch {
    return reply("Please check your message and try again.", 400);
  }
}
