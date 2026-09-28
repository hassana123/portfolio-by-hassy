import type { MetadataRoute } from "next";
import { portfolio, siteUrl } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { mode, records } = await portfolio();
  return [
    "/",
    ...(mode !== "data" ? ["/projects/frontend"] : []),
    ...(mode !== "engineering" ? ["/projects/data-analysis"] : []),
    "/articles",
    ...records
      .filter(
        (r) =>
          r.kind === "project" ||
          (r.kind === "article" && !r.content.externalUrl),
      )
      .map(
        (r) =>
          `/${r.kind === "project" ? "projects" : "articles"}/${r.content.slug}`,
      ),
  ].map((path) => ({ url: siteUrl() + path }));
}
