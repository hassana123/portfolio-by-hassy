import ReactMarkdown from "react-markdown";
import { safeUrl, type Content } from "@/lib/model";
export function DetailNav({ brand = "hassana" }: { brand?: string }) {
  return (
    <nav className="detail-nav">
      <a className="wordmark" href="/">
        {brand}
        <span>✦</span>
      </a>
      <a href="/">← Back to portfolio</a>
    </nav>
  );
}
export function ContentDetail({
  c,
  sample,
  kind,
  brand,
}: {
  c: Content;
  sample: boolean;
  kind: string;
  brand?: string;
}) {
  return (
    <main id="main" className="detail-page">
      <DetailNav brand={brand} />
      <span className="eyebrow">
        {c.category || kind}
        {sample ? " · SAMPLE CONTENT" : ""}
      </span>
      <h1>{c.title}</h1>
      <p className="lead">{c.summary}</p>
      {c.tools.length > 0 && <p>{c.tools.join(" / ")}</p>}
      {c.cover && (
        <img
          className="detail-cover"
          src={c.cover}
          alt={c.alt}
          width="1200"
          height="800"
        />
      )}
      <div className="prose">
        <ReactMarkdown skipHtml components={{ img: () => null }}>
          {c.body}
        </ReactMarkdown>
        {c.blocks
          .filter((b) => b.body.trim() || b.image)
          .map((b, i) => (
            <section key={i}>
              {b.heading && <h2>{b.heading}</h2>}
              <ReactMarkdown skipHtml components={{ img: () => null }}>
                {b.body}
              </ReactMarkdown>
              {b.image && (
                <img
                  src={b.image}
                  alt={b.alt}
                  width="1000"
                  height="700"
                  loading="lazy"
                />
              )}
            </section>
          ))}
      </div>
      {c.video && (
        <section className="prose">
          <h2>{c.videoTitle || "Project demonstration"}</h2>
          <video
            controls
            preload="metadata"
            aria-label={c.videoTitle || "Project demonstration"}
            style={{ width: "100%" }}
            src={c.video}
            poster={c.cover || undefined}
          />
          <p>Video: {c.videoTitle}</p>
        </section>
      )}
      {c.embedUrl &&
        safeUrl.safeParse(c.embedUrl).success &&
        ["app.powerbi.com", "public.tableau.com"].includes(
          new URL(c.embedUrl).hostname,
        ) && (
          <section>
            <h2>{c.embedTitle || "Interactive dashboard"}</h2>
            <p>
              The dashboard may require cookies or an account.{" "}
              <a className="text-link" href={c.embedUrl}>
                Open dashboard in a new page ↗
              </a>
            </p>
            <iframe
              className="embed"
              src={c.embedUrl}
              title={c.embedTitle || "Interactive dashboard"}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </section>
        )}
      <div className="detail-links">
        {c.links
          .filter((l) => safeUrl.safeParse(l.url).success)
          .map((l) => (
            <a
              key={l.url}
              className="button"
              href={l.url}
              rel="noopener noreferrer"
            >
              {l.label} ↗
            </a>
          ))}
      </div>
    </main>
  );
}
