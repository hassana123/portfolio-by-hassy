"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/model";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useReduced } from "./interactive";
export function PinnedGallery({
  items,
  id,
  previewMode,
}: {
  items: { id: string; content: Content; is_seed: boolean }[];
  id: string;
  previewMode?: string;
}) {
  const track = useRef<HTMLDivElement>(null),
    root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReduced();
  const pin = useRef<{ section: HTMLElement; distance: number } | null>(null);
  useEffect(() => {
    const t = track.current,
      section = root.current?.closest("section"),
      wrap = section?.querySelector<HTMLElement>(".wrap");
    if (!t || !section || !wrap) return;
    const mq = matchMedia("(min-width: 1024px)");
    const update = () => {
      const max = t.scrollWidth - t.clientWidth;
      if (pin.current) {
        const y = -section.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, y / Math.max(max, 1)));
        t.scrollLeft = p * max;
        setProgress(p);
        t.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
          const r = card.getBoundingClientRect(),
            off = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
          card.style.transform = `scale(${1 - Math.min(0.06, Math.abs(off) * 0.08)}) rotate(${off * 2}deg)`;
        });
      } else setProgress(max > 0 ? t.scrollLeft / max : 1);
    };
    const measure = () => {
      const distance = t.scrollWidth - t.clientWidth;
      const enabled =
        mq.matches &&
        !reduced &&
        items.length >= 3 &&
        distance > innerWidth * 0.3;
      pin.current = enabled ? { section, distance } : null;
      section.classList.toggle("is-pinned", enabled);
      section.style.height = enabled
        ? `${wrap.offsetHeight + distance + 160}px`
        : "";
      if (!enabled)
        t.querySelectorAll<HTMLElement>(".project-card").forEach(
          (x) => (x.style.transform = ""),
        );
      update();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    t.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      pin.current = null;
      section.classList.remove("is-pinned");
      section.style.height = "";
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      t.removeEventListener("scroll", update);
    };
  }, [items, reduced]);
  function advance(n: number) {
    const t = track.current;
    if (!t) return;
    if (pin.current) {
      const { section, distance } = pin.current;
      const top = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({
        top:
          top +
          Math.min(
            distance,
            Math.max(0, t.scrollLeft + n * t.clientWidth * 0.7),
          ),
        behavior: "smooth",
      });
    } else
      t.scrollBy({
        left: n * t.clientWidth * 0.7,
        behavior: reduced ? "instant" : "smooth",
      });
  }
  return (
    <div className="gallery" ref={root}>
      <div
        className="gallery-track"
        ref={track}
        id={`${id}-track`}
        tabIndex={0}
        aria-label="Project gallery. Use left and right arrow keys or the controls."
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            advance(e.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {items.map(({ id, content: c, is_seed }) => (
          <article className="project-card" key={id}>
            <a
              href={
                previewMode
                  ? `/admin/preview/project/${id}?mode=${previewMode}`
                  : `/projects/${c.slug}`
              }
              onFocus={(e) => {
                if (pin.current && track.current) {
                  const target = e.currentTarget.parentElement!;
                  const x = target.offsetLeft - track.current.offsetLeft;
                  const { section, distance } = pin.current;
                  window.scrollTo({
                    top:
                      scrollY +
                      section.getBoundingClientRect().top +
                      Math.min(x, distance),
                    behavior: "instant",
                  });
                }
              }}
            >
              <div className="project-cover">
                {c.cover ? (
                  <img
                    src={c.cover}
                    alt={c.alt}
                    width="1000"
                    height="680"
                    loading="lazy"
                  />
                ) : (
                  <span>Project image coming soon</span>
                )}
              </div>
              <div className="project-caption">
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.category || c.summary}</p>
                  {is_seed && (
                    <small className="sample-label">Sample project</small>
                  )}
                </div>
                <ArrowUpRight size={22} />
              </div>
            </a>
          </article>
        ))}
      </div>
      <div className="gallery-footer">
        <div className="progress">
          <i style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <div className="gallery-controls">
          {[-1, 1].map((n) => (
            <button
              key={n}
              aria-label={`${n < 0 ? "Previous" : "Next"} projects`}
              aria-controls={`${id}-track`}
              onClick={() => advance(n)}
            >
              {n < 0 ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
