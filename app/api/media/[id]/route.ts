import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { configured, db, publicDb, serviceDb } from "@/lib/supabase";
import { byteRange } from "@/lib/uploads";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!configured() || !z.uuid().safeParse(id).success)
    return new NextResponse("Not found", { status: 404 });
  const c = await db();
  const {
    data: { user },
  } = await c.auth.getUser();
  let record;
  let ownerAccess = false;
  if (user) {
    const { data: allowed } = await c.rpc("is_owner");
    if (allowed) {
      ownerAccess = true;
      const { data } = await c
        .from("media")
        .select("path,mime,name")
        .eq("id", id)
        .single();
      record = data;
    }
  }
  if (!record) {
    const { data } = await publicDb().rpc("public_media", { media_id: id });
    record = data?.[0];
  }
  if (!record) return new NextResponse("Not found", { status: 404 });
  if (!ownerAccess && !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return new NextResponse("Media unavailable", { status: 503 });
  const storage = ownerAccess ? c : serviceDb();
  const { data, error } = await storage.storage
    .from("portfolio")
    .download(record.path);
  if (error || !data) return new NextResponse("Not found", { status: 404 });
  const range = byteRange(request.headers.get("range"), data.size);
  if (range === null)
    return new NextResponse(null, {
      status: 416,
      headers: {
        "Content-Range": `bytes */${data.size}`,
        "Cache-Control": "private, no-store",
      },
    });
  const body = range ? data.slice(range.start, range.end + 1) : data;
  return new NextResponse(body.stream(), {
    status: range ? 206 : 200,
    headers: {
      "Content-Type": record.mime,
      "Accept-Ranges": "bytes",
      ...(range
        ? { "Content-Range": `bytes ${range.start}-${range.end}/${data.size}` }
        : {}),
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `${record.mime === "application/pdf" ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(record.name)}`,
    },
  });
}
