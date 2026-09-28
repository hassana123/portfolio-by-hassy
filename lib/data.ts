import "server-only";
import { cache } from "react";
import { demoRecords, demoSettings } from "./demo";
import { configured, publicDb, owner } from "./supabase";
import {
  settingsSchema,
  contentSchema,
  eligible,
  modeOf,
  type Settings,
  type RecordItem,
  type Mode,
} from "./model";
export const portfolio = cache(async function portfolio(
  preview = false,
  override?: Mode,
) {
  let settings: Settings;
  let records: RecordItem[];
  if (!configured()) {
    settings = structuredClone(demoSettings);
    records = structuredClone(demoRecords);
  } else {
    const client = preview ? await owner() : publicDb();
    const { data, error } = await client.rpc(
      preview ? "owner_snapshot" : "public_snapshot",
    );
    if (error)
      throw new Error(
        "Content could not be loaded. Check the database migration and configuration.",
      );
    const raw = data.settings;
    if (!raw)
      throw new Error("Initialize site settings in the owner dashboard.");
    if (!preview) {
      const active = raw.profiles[modeOf(raw)];
      raw.profiles = { combined: active, engineering: active, data: active };
    }
    settings = settingsSchema.parse(raw);
    records = (data.records || []).map((r: RecordItem) => ({
      ...r,
      draft: contentSchema.parse(preview ? r.draft : r.published),
      published: r.published ? contentSchema.parse(r.published) : null,
    }));
  }
  if (preview && override) {
    settings = {
      ...settings,
      engineering: override !== "data",
      data: override !== "engineering",
    };
  }
  const mode = modeOf(settings);
  return {
    preview,
    settings,
    mode,
    demo: !configured(),
    records: records
      .filter(
        (r) =>
          !r.archived &&
          (preview || r.published) &&
          eligible(preview ? r.draft : r.published!, mode, r.kind),
      )
      .map((r) => ({ ...r, content: preview ? r.draft : r.published! })),
  };
});
export const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
