import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  Code2,
  ChartNoAxesCombined,
  BookOpen,
} from "lucide-react";
import { portfolio } from "@/lib/data";
import { sectionVisible, type Section, type Kind } from "@/lib/model";
import { Hero, Navigation, ToolStrip, ContactForm } from "./interactive";
import { PinnedGallery as Gallery } from "./pinned-gallery";
import Reveals from "./reveals";
export type Portfolio = Awaited<ReturnType<typeof portfolio>>;
export function Home({ data }: { data: Portfolio }) {
  const { settings: s, mode, records, demo, preview } = data,
    p = s.profiles[mode];
  const by = (kind: Kind) =>
    records
      .filter((x) => x.kind === kind)
      .sort((a, b) => a.content.order - b.content.order);
  const sectionItems = (section: Section) => {
    const map: Partial<Record<Section["template"], Kind>> = {
      services: "service",
      skills: "skill",
      experience: "experience",
      community: "community",
      certifications: "certification",
      testimonials: "testimonial",
      articles: "article",
    };
    if (
      section.template === "engineering-projects" ||
      section.template === "data-projects"
    )
      return by("project")
        .filter(
          (r) =>
            r.content.scope ===
              (section.template === "engineering-projects"
                ? "engineering"
                : "data") ||
            r.content.scope === "both" ||
            r.content.scope === "general",
        )
        .filter((r) => r.content.featured);
    if (section.template === "articles")
      return by("article").sort(
        (a, b) =>
          Number(b.content.featured) - Number(a.content.featured) ||
          b.content.date.localeCompare(a.content.date) ||
          a.content.order - b.content.order,
      );
    return map[section.template] ? by(map[section.template]!) : [];
  };
  const sections = s.sections
    .filter((x) => sectionVisible(x, mode))
    .filter(
      (x) =>
        !["text-image", "gallery", "cards"].includes(x.template) ||
        x.image ||
        x.intro ||
        x.items.some((b) => b.body.trim() || b.image),
    )
    .filter(
      (x) =>
        ![
          "services",
          "skills",
          "experience",
          "community",
          "certifications",
          "testimonials",
          "articles",
          "engineering-projects",
          "data-projects",
        ].includes(x.template) || sectionItems(x).length > 0,
    );
  return (
    <div
      style={
        {
          "--ink": s.theme.ink,
          "--paper": s.theme.paper,
          "--accent": s.theme.accent,
          background: s.theme.paper,
          color: s.theme.ink,
        } as CSSProperties
      }
    >
      {demo && (
        <div className="demo-ribbon">
          Design preview · Sample content{" "}
          <a href="/admin/login">Owner setup ↗</a>
        </div>
      )}
      <Navigation
        brand={s.brand}
        contact={s.labels.contact}
        links={sections
          .filter((x) => x.template !== "skills")
          .slice(0, 5)
          .map((x) => ({
            id: x.id,
            label:
              x.label === "Front End Engineering"
                ? "Engineering"
                : x.label === "A little about me"
                  ? "About"
                  : x.label,
          }))}
      />
      <main id="main">
        <Reveals />
        <Hero
          settings={s}
          mode={mode}
          nextId={
            sections.find((x) => x.template !== "skills")?.id || "contact"
          }
        />
        {sections.map((section, index) => {
          const items = sectionItems(section);
          if (section.template === "skills")
            return (
              <ToolStrip
                key={section.id}
                names={items.map((x) => x.content.title)}
              />
            );
          return (
            <section
              key={section.id}
              id={section.id}
              className={`section section-${section.template}`}
            >
              <div className="wrap">
                {section.template === "about" ? (
                  <div className="about-grid">
                    <div className="collage">
                      <div className="photo-main">
                        {s.aboutImage ? (
                          <img
                            src={s.aboutImage}
                            alt={s.aboutAlt}
                            width="540"
                            height="640"
                            loading="lazy"
                          />
                        ) : (
                          <div className="photo-placeholder">
                            Your photo here
                          </div>
                        )}
                      </div>
                      <div className="photo-small">
                        {s.collageImage && (
                          <img
                            src={s.collageImage}
                            alt={s.collageAlt}
                            width="420"
                            height="300"
                            loading="lazy"
                          />
                        )}
                        <span className="desk-caption">
                          {s.labels.collageNote}
                        </span>
                      </div>
                      <span className="handwritten">{s.labels.greeting}</span>
                      <span className="collage-star" aria-hidden="true">
                        ✳
                      </span>
                    </div>
                    <div className="about-copy">
                      <span className="eyebrow">{s.labels.aboutEyebrow}</span>
                      <h2>{p.heading}</h2>
                      <p>{p.intro}</p>
                      {s.personal && (
                        <details>
                          <summary>
                            {s.labels.personalLabel} <span>+</span>
                          </summary>
                          <p>{s.personal}</p>
                        </details>
                      )}
                      {by("cv").length > 0 && (
                        <div className="cv-links">
                          {by("cv")
                            .filter((x) => x.content.file)
                            .map((x) => (
                              <a
                                className="text-link"
                                key={x.id}
                                href={x.content.file}
                              >
                                {x.content.title || s.labels.cv} ↓
                              </a>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="section-heading">
                      <div>
                        <span className="eyebrow">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {section.template.includes("projects")
                            ? "SELECTED WORK"
                            : "THE PORTFOLIO"}
                        </span>
                        <h2>{section.heading}</h2>
                      </div>
                      {section.intro && <p>{section.intro}</p>}
                      {section.template.includes("projects") && (
                        <a
                          className="text-link"
                          href={`/projects/${section.template === "engineering-projects" ? "frontend" : "data-analysis"}`}
                        >
                          {s.labels.viewMore}
                          <ArrowUpRight size={17} />
                        </a>
                      )}
                      {section.template === "articles" && (
                        <a className="text-link" href="/articles">
                          {s.labels.viewMore}
                          <ArrowUpRight size={17} />
                        </a>
                      )}
                    </div>
                    {section.template.includes("projects") ? (
                      <Gallery
                        items={items}
                        id={section.id}
                        previewMode={preview ? mode : undefined}
                      />
                    ) : section.template === "services" ? (
                      <div className="services">
                        {items.map((r, i) => (
                          <article key={r.id} className="service">
                            <span className="service-icon">
                              {r.content.scope === "engineering" ? (
                                <Code2 />
                              ) : r.content.scope === "data" ? (
                                <ChartNoAxesCombined />
                              ) : (
                                <BookOpen />
                              )}
                            </span>
                            <h3>{r.content.title}</h3>
                            <p>{r.content.summary}</p>
                            <span className="service-number">0{i + 1}</span>
                          </article>
                        ))}
                      </div>
                    ) : section.template === "articles" ? (
                      <div className="article-grid">
                        {items.slice(0, 3).map((r) => (
                          <a
                            key={r.id}
                            className="article-card"
                            href={
                              r.content.externalUrl ||
                              (preview
                                ? `/admin/preview/article/${r.id}?mode=${mode}`
                                : `/articles/${r.content.slug}`)
                            }
                            rel={
                              r.content.externalUrl
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            <span className="eyebrow">
                              {r.content.category}
                              {r.is_seed ? " · SAMPLE" : ""}
                            </span>
                            <h3>{r.content.title}</h3>
                            <p>{r.content.summary}</p>
                            <span>
                              {r.content.externalUrl
                                ? `Read on ${r.content.platform || "external site"} ↗`
                                : "Read the note ↗"}
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : ["text-image", "gallery", "cards"].includes(
                        section.template,
                      ) ? (
                      <div className="custom-grid">
                        {section.image && (
                          <img
                            src={section.image}
                            alt={section.alt}
                            width="800"
                            height="600"
                            loading="lazy"
                          />
                        )}
                        {section.items
                          .filter((b) => b.body.trim() || b.image)
                          .map((b, i) => (
                            <article key={i}>
                              {b.image && (
                                <img
                                  src={b.image}
                                  alt={b.alt}
                                  width="800"
                                  height="600"
                                  loading="lazy"
                                />
                              )}
                              {b.heading && <h3>{b.heading}</h3>}
                              <p>{b.body}</p>
                            </article>
                          ))}
                      </div>
                    ) : (
                      <div className="timeline">
                        {items.map((r) => (
                          <article key={r.id}>
                            <span className="eyebrow">
                              {r.content.date}
                              {r.is_seed ? " · SAMPLE" : ""}
                            </span>
                            <h3>{r.content.title}</h3>
                            <p>{r.content.summary}</p>
                            {r.content.body && <p>{r.content.body}</p>}
                            {r.content.links.map((l) => (
                              <a key={l.url} href={l.url}>
                                {l.label} ↗
                              </a>
                            ))}
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          );
        })}
        <section className="contact section" id="contact">
          <div className="wrap">
            <div className="contact-grid">
              <div>
                <span className="eyebrow">{s.labels.contactEyebrow}</span>
                <h2>{p.contact}</h2>
                {s.email && (
                  <a className="email-link" href={`mailto:${s.email}`}>
                    {s.email} ↗
                  </a>
                )}
                <div className="socials">
                  {s.socials.map((x) => (
                    <a key={x.url} href={x.url} rel="noopener noreferrer">
                      {x.label} ↗
                    </a>
                  ))}
                </div>
                <span className="handwritten">{s.labels.connectNote}</span>
              </div>
              <ContactForm demo={demo} sendLabel={s.labels.sendMessage} />
            </div>
            <footer>
              <span>
                © {new Date().getFullYear()} {s.name}
              </span>
              <a href="#top">{s.labels.back} ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
