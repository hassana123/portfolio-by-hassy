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
  type Content,
  type Mode,
} from "./model";

const localProjectCovers: Record<string, { cover: string; alt: string }> = {
  "mentoraft": {
    cover: "/demo/mentoraft-cover-light.png",
    alt: "Layered light browser panels showing the MentoRaft learning platform",
  },
  "women-techmakers-website-sprint": {
    cover: "/demo/women-techmakers-sprint-cover.png",
    alt: "Layered light browser panels representing the Women Techmakers website sprint",
  },
  "g3women-digital-academy": {
    cover: "/demo/g3women-academy-cover.png",
    alt: "Layered light browser panels showing the G3Women Digital Academy learning experience",
  },
  "saqo-frontend": {
    cover: "/demo/saqo-frontend-cover.png",
    alt: "Layered light browser panels representing Saqo frontend development work",
  },
  "urban-population-dynamics-sdg-11": {
    cover: "/demo/synergy-team-dashboard-cover.png",
    alt: "Layered browser panels showing the Synergy Team urban population dashboard and SDG 11 analysis",
  },
  "nigerian-fmcg-sales-analysis": {
    cover: "/demo/nigerian-fmcg-sales-analysis-cover.png",
    alt: "Layered dashboard panels showing the Nigerian FMCG sales and distribution analysis for 2025",
  },
  "fmcg-sales-performance-dashboard-fy-2024": {
    cover: "/demo/fmcg-sales-performance-2024-cover.png",
    alt: "Layered Power BI dashboard panels showing FMCG sales performance, revenue and stockout risk for FY 2024",
  },
};
const localProjectDownloads: Record<string, Content["downloads"]> = {
  "fmcg-sales-performance-dashboard-fy-2024": [
    {
      label: "Download dataset (CSV)",
      file: "/demo/fmcg-sales-2024-dataset.csv",
    },
    {
      label: "Download cleaned workbook (XLSX)",
      file: "/demo/fmcg-sales-2024-clean.xlsx",
    },
    {
      label: "Download Power BI report (PBIX)",
      file: "/demo/fmcg-sales-2024-report.pbix",
    },
    {
      label: "Download Power BI template (PBIT)",
      file: "/demo/fmcg-sales-2024-template.pbit",
    },
  ],
};

function withLocalProjectCover(content: Content): Content {
  const downloads =
    content.downloads.length > 0
      ? content.downloads
      : localProjectDownloads[content.slug] || [];
  const fallback = localProjectCovers[content.slug];
  return {
    ...content,
    ...(fallback && !content.cover
      ? { cover: fallback.cover, alt: content.alt || fallback.alt }
      : {}),
    ...(downloads.length > 0 ? { downloads } : {}),
  };
}
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
      // Keep the page visually complete while the owner replaces demo media in
      // Supabase. A configured asset always wins; local demo assets only fill
      // empty media fields, so uploaded media takes over automatically.
      const raw = {
        ...data.settings,
        portrait: data.settings.portrait || demoSettings.portrait,
        portraitAlt: data.settings.portraitAlt || demoSettings.portraitAlt,
        aboutImage: data.settings.aboutImage || demoSettings.aboutImage,
        aboutAlt: data.settings.aboutAlt || demoSettings.aboutAlt,
        aboutVideo: data.settings.aboutVideo || demoSettings.aboutVideo,
        aboutPoster: data.settings.aboutPoster || demoSettings.aboutPoster,
        aboutVideoDescription:
          data.settings.aboutVideoDescription ||
          demoSettings.aboutVideoDescription,
        collageImage: data.settings.collageImage || demoSettings.collageImage,
        collageAlt: data.settings.collageAlt || demoSettings.collageAlt,
      };
      if (!preview) {
        const active = raw.profiles[modeOf(raw)];
        raw.profiles = { combined: active, engineering: active, data: active };
      }
      settings = settingsSchema.parse(raw);
      records = (data.records || []).map((r: RecordItem) => {
        const published = r.published
          ? withLocalProjectCover(contentSchema.parse(r.published))
          : null;
        const draft = r.draft
          ? withLocalProjectCover(contentSchema.parse(r.draft))
          : published;
        if (!draft) throw new Error("Published record is missing content.");
        return { ...r, draft, published };
      });
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
          // The notebook is a complete archive. Role switches control the
          // project and profile sections, but should never hide an article
          // from the dedicated Articles page.
          (r.kind === "article" ||
            eligible(preview ? r.draft : r.published!, mode, r.kind)),
      )
      .map((r) => ({ ...r, content: preview ? r.draft : r.published! })),
  };
});
export const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
