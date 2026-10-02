"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/model";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useReduced } from "./interactive";
import ProjectCover from "./project-cover";
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
  const [canSlide, setCanSlide] = useState(false);
  const reduced = useReduced();
  const paused = useRef(false);
  const autoTimer = useRef<number | null>(null);
  const advanceRef = useRef<(n: number, wrap?: boolean) => void>(() => {});
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const update = () => {
      const max = t.scrollWidth - t.clientWidth;
      setProgress(max > 0 ? t.scrollLeft / max : 1);
    };
    const measure = () => {
      const distance = t.scrollWidth - t.clientWidth;
      setCanSlide(distance > 0);
      update();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    t.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      t.removeEventListener("scroll", update);
    };
  }, [items]);
  useEffect(() => {
    if (reduced || !canSlide || items.length < 2) return;
    const schedule = () => {
      autoTimer.current = window.setTimeout(() => {
        const bounds = root.current?.getBoundingClientRect();
        const onScreen =
          bounds && bounds.bottom > 0 && bounds.top < window.innerHeight;
        if (
          !paused.current &&
          onScreen &&
          document.visibilityState === "visible"
        ) {
          advanceRef.current(1, true);
        }
        schedule();
      }, 5000);
    };
    schedule();
    return () => {
      if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
      autoTimer.current = null;
    };
  }, [canSlide, items.length, reduced]);
  function advance(n: number, wrap = false) {
    const t = track.current;
    if (!t) return;
    const max = Math.max(0, t.scrollWidth - t.clientWidth);
    let target = t.scrollLeft + n * t.clientWidth * 0.7;
    if (wrap && n > 0 && target >= max) target = 0;
    if (wrap && n < 0 && target <= 0) target = max;
    target = Math.min(max, Math.max(0, target));
    t.scrollTo({
      left: target,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  advanceRef.current = advance;
  return (
    <div
      className="gallery"
      ref={root}
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
      onFocusCapture={() => {
        paused.current = true;
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          paused.current = false;
        }
      }}
    >
      <div
        className="gallery-track"
        ref={track}
        id={`${id}-track`}
        tabIndex={0}
        aria-label="Project gallery. Use the left and right arrow keys or the controls. Scrolling does not change projects."
        onWheel={(e) => {
          // Keep wheel and trackpad gestures from becoming a second slider
          // control. Vertical page scrolling remains available over the gallery.
          if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            advance(e.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {items.map(({ id, content: c, is_seed }) => (
          <article
            className="project-card"
            key={id}
          >
            <ProjectCover
              content={c}
              href={
                previewMode
                  ? `/admin/preview/project/${id}?mode=${previewMode}`
                  : `/projects/${c.slug}`
              }
            />
            <a
              href={
                previewMode
                  ? `/admin/preview/project/${id}?mode=${previewMode}`
                  : `/projects/${c.slug}`
              }
            >
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
