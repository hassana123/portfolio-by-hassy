"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { owner, db, configured } from "@/lib/supabase";
import { contentSchema, settingsSchema, kinds, contrast } from "@/lib/model";
import { demoRecords } from "@/lib/demo";
import {
  uploadExtensions,
  maxUploadBytes,
  validSignature,
} from "@/lib/uploads";
type Result = { ok: boolean; message: string; id?: string };
export async function beginUpload(
  mime: string,
  size: number,
): Promise<Result & { path?: string; token?: string }> {
  const c = await owner();
  try {
    if (
      !uploadExtensions[mime] ||
      !Number.isInteger(size) ||
      size <= 0 ||
      size > maxUploadBytes
    )
      throw Error("Choose a supported file up to 25 MB.");
    const id = crypto.randomUUID(),
      path = `${id}.${uploadExtensions[mime]}`;
    const { data, error } = await c.storage
      .from("portfolio")
      .createSignedUploadUrl(path);
    if (error) throw Error(error.message);
    return {
      ok: true,
      message: "Ready to upload.",
      id,
      path,
      token: data.token,
    };
  } catch (e) {
    return failure(e);
  }
}
export async function finishUpload(
  id: string,
  path: string,
  name: string,
  mime: string,
  alt: string,
): Promise<Result> {
  const c = await owner();
  try {
    z.uuid().parse(id);
    if (!uploadExtensions[mime] || path !== `${id}.${uploadExtensions[mime]}`)
      throw Error("Invalid upload path.");
    const safeName = z.string().min(1).max(180).parse(name),
      safeAlt = z.string().max(300).parse(alt);
    const { data: file, error } = await c.storage
      .from("portfolio")
      .download(path);
    if (error || !file)
      throw Error("The uploaded file could not be read. Try again.");
    if (
      !file.size ||
      file.size > maxUploadBytes ||
      !validSignature(new Uint8Array(await file.arrayBuffer()), mime)
    ) {
      await c.storage.from("portfolio").remove([path]);
      throw Error(
        "The uploaded content does not match the allowed file type or size.",
      );
    }
    const { error: saveError } = await c.from("media").insert({
      id,
      path,
      name: safeName,
      mime,
      bytes: file.size,
      alt: safeAlt,
    });
    if (saveError) throw Error(saveError.message);
    revalidatePath("/admin");
    return {
      ok: true,
      id,
      message: "File uploaded and verified. Select it in your content editor.",
    };
  } catch (e) {
    return failure(e);
  }
}
const failure = (e: unknown): Result => ({
  ok: false,
  message:
    e instanceof z.ZodError
      ? e.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")
      : e instanceof Error
        ? e.message
        : "The change could not be saved.",
});
export async function login(_: Result, form: FormData): Promise<Result> {
  if (!configured())
    return {
      ok: false,
      message: "Configure Supabase using the setup guide first.",
    };
  const c = await db();
  const { error } = await c.auth.signInWithPassword({
    email: String(form.get("email")),
    password: String(form.get("password")),
  });
  if (error)
    return {
      ok: false,
      message: "Sign-in failed. Check your email and password.",
    };
  const { data } = await c.rpc("is_owner");
  if (!data) {
    await c.auth.signOut();
    return {
      ok: false,
      message: "This account is not authorized as the portfolio owner.",
    };
  }
  redirect("/admin");
}
export async function logout() {
  const c = await db();
  await c.auth.signOut();
  redirect("/admin/login");
}
export async function saveSettings(
  input: unknown,
  publish: boolean,
): Promise<Result> {
  const c = await owner();
  try {
    const value = settingsSchema.parse(input);
    if (
      publish &&
      value.aboutVideo &&
      (!value.aboutPoster || !value.aboutVideoDescription.trim())
    )
      throw Error(
        "Choose an About video poster and add a description before publishing.",
      );
    if (
      publish &&
      ((value.portrait && !value.portraitAlt) ||
        (value.aboutImage && !value.aboutAlt) ||
        (value.collageImage && !value.collageAlt) ||
        value.sections.some(
          (s) => (s.image && !s.alt) || s.items.some((b) => b.image && !b.alt),
        ))
    )
      throw Error(
        "Add meaningful alt text to every selected image before publishing.",
      );
    if (
      contrast(value.theme.ink, value.theme.paper) < 4.5 ||
      contrast(value.theme.ink, value.theme.accent) < 4.5 ||
      contrast(value.theme.ink, "#F7F5FF") < 4.5
    )
      throw Error("Theme text/background contrast must be at least 4.5:1.");
    const { error } = await c.rpc("save_site", { payload: value, publish });
    if (error) throw Error(error.message);
    revalidatePath("/", "layout");
    return {
      ok: true,
      message: publish
        ? "Site published. All public routes now use this revision."
        : "Draft saved. Live content is unchanged.",
    };
  } catch (e) {
    return failure(e);
  }
}
export async function saveContent(
  id: string | null,
  kind: string,
  input: unknown,
  action: string,
): Promise<Result> {
  const c = await owner();
  try {
    const k = z.enum(kinds).parse(kind);
    const a = z
      .enum(["draft", "publish", "unpublish", "archive", "restore", "delete"])
      .parse(action);
    const value = contentSchema.parse(input);
    if (id) z.uuid().parse(id);
    if (a === "publish") {
      if (value.cover && !value.alt)
        throw Error("Add cover image alt text before publishing.");
      if (value.blocks.some((b) => b.image && !b.alt))
        throw Error("Add alt text to every block image.");
      if (value.video && !value.videoTitle)
        throw Error("Add an accessible video title.");
      if (value.embedUrl && !value.embedTitle)
        throw Error("Add a descriptive dashboard embed title.");
      if (k === "cv" && !value.file)
        throw Error("Select a CV file before publishing.");
      if (k === "project" && ["frontend", "data-analysis"].includes(value.slug))
        throw Error("This project slug is reserved.");
    }
    const { data, error } = await c.rpc("save_content", {
      entry: id,
      entry_kind: k,
      payload: value,
      action: a,
    });
    if (error) throw Error(error.message);
    revalidatePath("/", "layout");
    return {
      ok: true,
      id: data,
      message:
        a === "draft"
          ? "Draft saved. Live content is unchanged."
          : `Content ${a === "publish" ? "published" : a === "unpublish" ? "unpublished" : a === "delete" ? "deleted" : a === "restore" ? "restored" : "archived"}.`,
    };
  } catch (e) {
    return failure(e);
  }
}
export async function clearStarter(
  count: number,
  confirmation: string,
): Promise<Result> {
  const c = await owner();
  try {
    if (confirmation !== "CLEAR STARTER CONTENT")
      throw Error("Enter CLEAR STARTER CONTENT to confirm.");
    const { data, error } = await c.rpc("clear_starter", {
      expected_count: count,
    });
    if (error) throw Error(error.message);
    revalidatePath("/", "layout");
    return {
      ok: true,
      message: `Removed ${data} starter records. Your own records and settings were preserved.`,
    };
  } catch (e) {
    return failure(e);
  }
}
export async function seedSamples(): Promise<Result> {
  const c = await owner();
  try {
    const { count, error } = await c
      .from("content_entries")
      .select("id", { count: "exact", head: true });
    if (error) throw Error(error.message);
    if (count)
      throw Error("Samples can only be added to an empty content library.");
    for (const r of demoRecords) {
      const { error } = await c.rpc("save_content", {
        entry: null,
        entry_kind: r.kind,
        payload: r.draft,
        action: "draft",
        seed: true,
        source_text: r.source,
      });
      if (error) throw Error(error.message);
    }
    revalidatePath("/admin");
    return {
      ok: true,
      message: "Labelled samples added as drafts. Nothing was published.",
    };
  } catch (e) {
    return failure(e);
  }
}
export async function updateMessage(
  id: string,
  action: string,
): Promise<Result> {
  const c = await owner();
  try {
    z.uuid().parse(id);
    const a = z
      .enum(["read", "unread", "archive", "restore", "delete"])
      .parse(action);
    const q =
      a === "delete"
        ? c.from("enquiries").delete().eq("id", id)
        : c
            .from("enquiries")
            .update(
              a === "read" || a === "unread"
                ? { is_read: a === "read" }
                : { archived: a === "archive" },
            )
            .eq("id", id);
    const { error } = await q;
    if (error) throw Error(error.message);
    revalidatePath("/admin");
    return { ok: true, message: "Inbox updated." };
  } catch (e) {
    return failure(e);
  }
}
export async function editMedia(id: string, alt: string): Promise<Result> {
  const c = await owner();
  try {
    z.uuid().parse(id);
    const { error } = await c
      .from("media")
      .update({ alt: z.string().max(300).parse(alt) })
      .eq("id", id);
    if (error) throw Error(error.message);
    revalidatePath("/admin");
    return { ok: true, message: "Media alt text saved." };
  } catch (e) {
    return failure(e);
  }
}
export async function deleteMedia(id: string): Promise<Result> {
  const c = await owner();
  try {
    z.uuid().parse(id);
    const [
      { data: entries, error: e1 },
      { data: state, error: e2 },
      { data: item, error: e3 },
    ] = await Promise.all([
      c.from("content_entries").select("draft_id,published_id"),
      c.from("site_state").select("draft_id,published_id").single(),
      c.from("media").select("path").eq("id", id).single(),
    ]);
    if (e1 || e2 || e3 || !item)
      throw Error("Could not check this file. Try again.");
    const revisions = (entries || [])
      .flatMap((x) => [x.draft_id, x.published_id])
      .filter(Boolean);
    const sites = [state?.draft_id, state?.published_id].filter(Boolean);
    const [{ data: content, error: e4 }, { data: settings, error: e5 }] =
      await Promise.all([
        revisions.length
          ? c.from("content_revisions").select("payload").in("id", revisions)
          : Promise.resolve({ data: [], error: null }),
        sites.length
          ? c.from("site_revisions").select("payload").in("id", sites)
          : Promise.resolve({ data: [], error: null }),
      ]);
    if (e4 || e5) throw Error("Could not check file references. Try again.");
    if (JSON.stringify([content, settings]).includes(`/api/media/${id}`))
      throw Error(
        "This file is used by a current draft or publication. Replace/remove those references first.",
      );
    const { error: storageError } = await c.storage
      .from("portfolio")
      .remove([item.path]);
    if (storageError) throw Error(storageError.message);
    const { error } = await c.from("media").delete().eq("id", id);
    if (error) throw Error(error.message);
    revalidatePath("/admin");
    return { ok: true, message: "Unused file deleted." };
  } catch (e) {
    return failure(e);
  }
}
