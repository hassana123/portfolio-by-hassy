import { z } from "zod";
export const modes = ["combined", "engineering", "data"] as const;
export type Mode = (typeof modes)[number];
export const scopes = ["general", "engineering", "data", "both"] as const;
export type Scope = (typeof scopes)[number];
export const kinds = [
  "project",
  "article",
  "service",
  "skill",
  "experience",
  "community",
  "certification",
  "testimonial",
  "cv",
] as const;
export type Kind = (typeof kinds)[number];
export const projectOutlines = {
  engineering: [
    "Overview & problem solved",
    "My role & contributions",
    "Technologies & key features",
    "Screenshots",
    "Challenges & approach",
    "Outcomes",
  ],
  data: [
    "Business question",
    "Dataset & source",
    "Data cleaning & preparation",
    "Analysis methods",
    "Dashboard & visualisations",
    "Key findings",
    "Recommendations",
  ],
} as const;
export function trustedEmbed(value: string) {
  if (!value) return true;
  try {
    return (
      ["app.powerbi.com", "public.tableau.com"].includes(
        new URL(value).hostname,
      ) && new URL(value).protocol === "https:"
    );
  } catch {
    return false;
  }
}
export const safeUrl = z
  .string()
  .max(2000)
  .refine(
    (v) =>
      !v ||
      (/^https:\/\//.test(v) &&
        (() => {
          try {
            const u = new URL(v);
            return !u.username && !u.password;
          } catch {
            return false;
          }
        })()),
    "Use a full https:// URL",
  );
export const asset = z
  .string()
  .max(250)
  .refine(
    (v) =>
      !v ||
      (v.startsWith("/api/media/") &&
        z.uuid().safeParse(v.slice("/api/media/".length)).success) ||
      /^\/demo\/[a-z0-9.-]+$/.test(v),
    "Select an uploaded media item",
  );
const downloadSchema = z.object({
  label: z.string().min(1).max(100),
  file: asset,
});
export const blockSchema = z.object({
  heading: z.string().max(160),
  body: z.string().max(30000),
  image: asset.default(""),
  alt: z.string().max(300).default(""),
});
export const contentSchema = z.object({
  title: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().max(1200),
  scope: z.enum(scopes),
  featured: z.boolean(),
  order: z.number().int().min(0).max(10000),
  cover: asset,
  alt: z.string().max(300),
  category: z.string().max(100),
  body: z.string().max(60000),
  blocks: z.array(blockSchema).max(30),
  tools: z.array(z.string().max(60)).max(30),
  links: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        url: safeUrl.refine(Boolean),
      }),
    )
    .max(10),
  externalUrl: safeUrl,
  platform: z.string().max(80),
  embedUrl: safeUrl.refine(
    trustedEmbed,
    "Only Power BI or public Tableau embeds are supported",
  ),
  embedTitle: z.string().max(180),
  date: z.string().max(40),
  seoTitle: z.string().max(160),
  seoDescription: z.string().max(320),
  eligibleModes: z.array(z.enum(modes)),
  file: asset,
  video: asset.default(""),
  videoTitle: z.string().max(180).default(""),
  downloads: z.array(downloadSchema).max(12).default([]),
});
export type Content = z.infer<typeof contentSchema>;
export type RecordItem = {
  id: string;
  kind: Kind;
  draft: Content;
  published: Content | null;
  is_seed: boolean;
  source: string;
  archived: boolean;
  updated_at?: string;
};
export const profileSchema = z.object({
  title: z.string().min(1).max(160),
  words: z.array(z.string().min(1).max(18)).length(4),
  phrases: z.array(z.string().min(1).max(160)).min(1).max(8),
  heading: z.string().min(1).max(200),
  intro: z.string().max(1800),
  back: z.array(z.string().max(120)).max(5),
  contact: z.string().min(1).max(180),
  seoDescription: z.string().max(320),
});
export const templates = [
  "about",
  "services",
  "skills",
  "engineering-projects",
  "data-projects",
  "experience",
  "community",
  "certifications",
  "testimonials",
  "articles",
  "text-image",
  "gallery",
  "cards",
] as const;
export const sectionSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  template: z.enum(templates),
  label: z.string().max(100),
  heading: z.string().max(160),
  intro: z.string().max(1800),
  enabled: z.boolean(),
  scope: z.enum(scopes),
  image: asset,
  alt: z.string().max(300),
  items: z.array(blockSchema).max(30),
});
export const settingsSchema = z
  .object({
    engineering: z.boolean(),
    data: z.boolean(),
    name: z.string().min(1).max(100),
    brand: z.string().min(1).max(40),
    signature: z.string().max(100),
    portrait: asset,
    portraitAlt: z.string().max(300),
    aboutImage: asset,
    aboutAlt: z.string().max(300),
    aboutVideo: asset.default(""),
    aboutPoster: asset.default(""),
    aboutVideoDescription: z
      .string()
      .max(300)
      .default("A woman typing on a laptop, then smiling and waving hello."),
    collageImage: asset.default(""),
    collageAlt: z.string().max(300).default(""),
    availability: z.string().max(100),
    personal: z.string().max(1000),
    handle: z.string().max(80),
    email: z.union([z.literal(""), z.email()]),
    socials: z
      .array(
        z.object({
          label: z.string().min(1).max(60),
          url: safeUrl.refine(Boolean),
        }),
      )
      .max(12),
    profiles: z.object({
      combined: profileSchema,
      engineering: profileSchema,
      data: profileSchema,
    }),
    sections: z.array(sectionSchema).max(30),
    labels: z.object({
      contact: z.string().min(1).max(60),
      viewMore: z.string().min(1).max(60),
      back: z.string().min(1).max(60),
      scroll: z.string().min(1).max(60),
      cv: z.string().min(1).max(60),
      heroNote: z.string().max(100),
      badgeTagline: z.string().max(100),
      idLabel: z.string().max(50),
      flipHint: z.string().max(50),
      backEyebrow: z.string().max(70),
      backHeading: z.string().max(70),
      aboutEyebrow: z.string().max(80),
      personalLabel: z.string().max(80),
      greeting: z.string().max(80),
      collageNote: z.string().max(100),
      contactEyebrow: z.string().max(100),
      connectNote: z.string().max(80),
      sendMessage: z.string().min(1).max(60),
    }),
    theme: z.object({
      ink: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      paper: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),
  })
  .refine(
    (s) => s.engineering || s.data,
    "At least one professional role must be enabled",
  )
  .refine(
    (s) => new Set(s.sections.map((x) => x.id)).size === s.sections.length,
    "Section IDs must be unique",
  );
export type Settings = z.infer<typeof settingsSchema>;
export type Section = z.infer<typeof sectionSchema>;
export function sectionVisible(section: Section, mode: Mode) {
  return (
    section.enabled &&
    visible(section.scope, mode) &&
    !(section.template === "engineering-projects" && mode === "data") &&
    !(section.template === "data-projects" && mode === "engineering")
  );
}
export function modeOf(s: Pick<Settings, "engineering" | "data">): Mode {
  if (!s.engineering && !s.data)
    throw Error("At least one role must be enabled");
  return s.engineering && s.data
    ? "combined"
    : s.engineering
      ? "engineering"
      : "data";
}
export function visible(scope: Scope, mode: Mode) {
  return (
    scope === "general" ||
    scope === "both" ||
    mode === "combined" ||
    scope === mode
  );
}
export function eligible(c: Content, mode: Mode, kind: Kind) {
  return (
    visible(c.scope, mode) && (kind !== "cv" || c.eligibleModes.includes(mode))
  );
}
export function blankContent(): Content {
  return {
    title: "Untitled",
    slug: "untitled",
    summary: "",
    scope: "general",
    featured: false,
    order: 0,
    cover: "",
    alt: "",
    category: "",
    body: "",
    blocks: [],
    tools: [],
    links: [],
    externalUrl: "",
    platform: "",
    embedUrl: "",
    embedTitle: "",
    date: "",
    seoTitle: "",
    seoDescription: "",
    eligibleModes: [],
    file: "",
    video: "",
    videoTitle: "",
    downloads: [],
  };
}
export function contrast(a: string, b: string) {
  const l = (h: string) => {
    const c = h
      .slice(1)
      .match(/../g)!
      .map((x) => parseInt(x, 16) / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const x = l(a),
    y = l(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
