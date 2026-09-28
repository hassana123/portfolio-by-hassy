import { portfolio } from "@/lib/data";
import { ContentDetail } from "@/components/details";
import { notFound, redirect } from "next/navigation";
export const dynamic = "force-dynamic";
async function article(slug: string) {
  const d = await portfolio();
  const r = d.records.find(
    (x) => x.kind === "article" && x.content.slug === slug,
  );
  if (!r) notFound();
  return r;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const r = await article((await params).slug);
  return {
    title: r.content.seoTitle || r.content.title,
    description: r.content.seoDescription || r.content.summary,
    alternates: { canonical: `/articles/${r.content.slug}` },
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const r = await article((await params).slug);
  const { settings } = await portfolio();
  if (r.content.externalUrl) redirect(r.content.externalUrl);
  return (
    <ContentDetail
      c={r.content}
      sample={r.is_seed}
      kind="Article"
      brand={settings.brand}
    />
  );
}
