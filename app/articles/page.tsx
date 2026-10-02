import { portfolio } from "@/lib/data";
import { DetailNav } from "@/components/details";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Articles",
  alternates: { canonical: "/articles" },
};
export default async function Articles() {
  const d = await portfolio();
  const articles = d.records
    .filter((r) => r.kind === "article")
    .sort((a, b) => b.content.date.localeCompare(a.content.date));
  return (
    <main className="detail-page" id="main">
      <DetailNav brand={d.settings.brand} />
      <span className="eyebrow">THE NOTEBOOK</span>
      <h1>Ideas, lessons & little discoveries.</h1>
      <div className="detail-links article-directory-actions" aria-label="Writing platforms">
        <a
          className="button"
          href="https://techsulatana.hashnode.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read all on Hashnode ↗
        </a>
        <span
          className="button button-disabled"
          aria-disabled="true"
          title="A Medium profile has not been created yet"
        >
          Medium coming soon
        </span>
      </div>
      {articles.length ? (
        <div className="listing">
          {articles.map((r) => (
            <a
              className="article-card"
              key={r.id}
              href={r.content.externalUrl || `/articles/${r.content.slug}`}
            >
              <span className="eyebrow">
                {r.content.category}
                {r.is_seed ? " · SAMPLE" : ""}
              </span>
              {r.content.cover && (
                <img
                  src={r.content.cover}
                  alt={r.content.alt}
                  width="600"
                  height="400"
                />
              )}
              <h3>{r.content.title}</h3>
              <p>{r.content.summary}</p>
              <span>
                {r.content.externalUrl
                  ? `Read on ${r.content.platform || "external site"} ↗`
                  : "Read article ↗"}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className="empty-state">Fresh notes are on their way.</p>
      )}
    </main>
  );
}
