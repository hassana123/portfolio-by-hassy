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
    try {
      const client = preview ? await owner() : publicDb();
      const { data, error } = await client.rpc(
        preview ? "owner_snapshot" : "public_snapshot",
      );
      if (error || !data?.settings)
        throw new Error("No published site settings.");
      const raw = data.settings;
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
    } catch (error) {
      if (preview) throw error;
      settings = structuredClone(demoSettings);
      records = structuredClone(demoRecords);
    }
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
