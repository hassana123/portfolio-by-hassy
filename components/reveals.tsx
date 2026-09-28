"use client";
import { useEffect } from "react";
export default function Reveals() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll(
      ".section-heading, .about-copy, .about-media, .service, .article-card, .timeline article",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.animate(
              [
                {
                  opacity: 0.25,
                  transform: `translate(${entry.target.classList.contains("service") ? "20px" : "0"}, 22px)`,
                },
                { opacity: 1, transform: "translate(0,0)" },
              ],
              {
                duration: 700,
                easing: "cubic-bezier(.2,.8,.2,1)",
                fill: "none",
              },
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
