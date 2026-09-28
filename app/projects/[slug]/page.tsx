import { portfolio } from "@/lib/data";
import { notFound } from "next/navigation";
import { ContentDetail, DetailNav } from "@/components/details";
export const dynamic = "force-dynamic";
async function resolve(slug: string) {
  const data = await portfolio();
  if (slug === "frontend" || slug === "data-analysis") {
    const role = slug === "frontend" ? "engineering" : "data";
    if (data.mode !== "combined" && data.mode !== role) notFound();
    return { ...data, list: true, role, record: undefined };
  }
  const record = data.records.find(
    (x) => x.kind === "project" && x.content.slug === slug,
  );
  if (!record) notFound();
  return { ...data, list: false, role: "", record };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = await resolve(slug);
  return {
    title: d.list
      ? d.role === "engineering"
        ? "Front End Engineering"
        : "Data Analysis"
      : d.record!.content.seoTitle || d.record!.content.title,
    description: d.list
      ? d.settings.profiles[d.mode].seoDescription
      : d.record!.content.seoDescription || d.record!.content.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = await resolve(slug);
  if (!d.list)
    return (
      <ContentDetail
        c={d.record!.content}
        sample={d.record!.is_seed}
        kind="Project"
        brand={d.settings.brand}
      />
    );
  const records = d.records.filter(
    (x) =>
      x.kind === "project" &&
      (x.content.scope === d.role ||
        x.content.scope === "both" ||
        x.content.scope === "general"),
  );
  return (
    <main className="detail-page" id="main">
      <DetailNav brand={d.settings.brand} />
      <span className="eyebrow">
        THE WORK / {d.demo ? "DEMO PORTFOLIO" : "SELECTED PROJECTS"}
      </span>
      <h1>
        {d.role === "engineering" ? "Front End Engineering" : "Data Analysis"}
      </h1>
      {records.length ? (
        <div className="listing">
          {records.map(({ id, content: c, is_seed }) => (
            <article className="project-card" key={id}>
              <a href={`/projects/${c.slug}`}>
                <div className="project-cover">
                  {c.cover ? (
                    <img src={c.cover} alt={c.alt} width="1000" height="680" />
                  ) : (
                    <span>Project image coming soon</span>
                  )}
                </div>
                <div className="project-caption">
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    {is_seed && (
                      <small className="sample-label">Sample project</small>
                    )}
                  </div>
                  <span>↗</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          New projects will appear here when they are published.
        </p>
      )}
    </main>
  );
}
