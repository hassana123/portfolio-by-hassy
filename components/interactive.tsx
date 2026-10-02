"use client";
import { useEffect, useState } from "react";
import type { Settings, Mode } from "@/lib/model";
import { ArrowDown, ArrowUpRight, Pause, Play, Menu, X } from "lucide-react";
import { BadgeSocials, BadgeConnect } from "./badge-connect";
export function useReduced() {
  const [reduced, set] = useState(true);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => set(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return reduced;
}
function BadgePortrait({ src, alt }: { src: string; alt: string }) {
  const localFallback = src.startsWith("/demo/") ? src : "/demo/about.jpg";
  const [visibleSrc, setVisibleSrc] = useState(localFallback);

  useEffect(() => {
    const fallback = src.startsWith("/demo/") ? src : "/demo/about.jpg";
    setVisibleSrc(fallback);
    if (!src || src === fallback) return;
    const preload = new Image();
    preload.onload = () => setVisibleSrc(src);
    preload.onerror = () => setVisibleSrc(fallback);
    preload.src = src;
    return () => {
      preload.onload = null;
      preload.onerror = null;
    };
  }, [src]);

  return (
    <img
      className="badge-portrait"
      src={visibleSrc}
      alt={alt}
      width="380"
      height="380"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}
export function Hero({
  settings: s,
  mode,
  nextId = "contact",
  cvUrl,
  cvQrUrl,
}: {
  settings: Settings;
  mode: Mode;
  nextId?: string;
  cvUrl?: string;
  cvQrUrl?: string;
}) {
  const p = s.profiles[mode];
  const [flipped, flip] = useState(false);
  const [paused, pause] = useState(false);
  const [userFlipped, setUserFlipped] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [phrase, setPhrase] = useState(0);
  const [autoReturned, setAutoReturned] = useState(false);
  const reduced = useReduced();
  const nameParts = s.name.trim().split(/\s+/);
  const toggleCard = () => {
    setUserFlipped(true);
    pause(true);
    flip((x) => !x);
  };
  useEffect(() => {
    if (reduced || paused || focus || hovered || userFlipped || autoReturned)
      return;
    const timer = setTimeout(
      () => {
        if (document.hidden) return;
        if (flipped) {
          flip(false);
          setAutoReturned(true);
          pause(true);
        } else {
          flip(true);
        }
      },
      flipped ? 3600 : 3100,
    );
    return () => clearTimeout(timer);
  }, [reduced, paused, focus, hovered, userFlipped, autoReturned, flipped]);
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      if (!document.hidden) setPhrase((x) => (x + 1) % p.phrases.length);
    }, 4400);
    return () => clearInterval(id);
  }, [reduced, paused, p.phrases.length]);
  return (
    <section className="hero" id="top" aria-label={`${s.name}, ${p.title}`}>
      <div className="hero-top">
        <a href="#contact" className="wordmark">
          {s.brand}
          <span>✦</span>
        </a>
        <span>{s.labels.heroNote}</span>
      </div>
      <h1 className="sr-only">
        {s.name} — {p.title}
      </h1>
      <div className="hero-words" aria-hidden="true">
        {p.words.map((w, i) => (
          <div key={i}>
            <span style={{ animationDelay: `${i * 110}ms` }}>{w}</span>
          </div>
        ))}
      </div>
      <div
        className="badge-rig original-badge"
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="lanyard" aria-hidden="true">
          <span>
            {s.brand} ✦ {s.brand} ✦
          </span>
        </div>
        <div className="clip" aria-hidden="true" />
        <div
          className={`badge ${flipped ? "flipped" : ""}`}
          onClick={(e) => {
            if ((e.target as Element).closest("a, button, dialog")) return;
            toggleCard();
          }}
        >
          <div
            className="badge-face badge-front"
            aria-hidden={flipped}
            inert={flipped}
          >
            <span className="badge-slot" />
            <span className="badge-meta">{s.labels.badgeTagline}</span>
            {s.portrait ? (
              <BadgePortrait src={s.portrait} alt={s.portraitAlt} />
            ) : (
              <span className="portrait-empty">Your portrait here</span>
            )}
            <strong className="badge-name">
              <span>{nameParts[0]}</span>
              <span>{nameParts.slice(1).join(" ")}</span>
            </strong>
            <span className="badge-title">{p.title}</span>
            {s.availability && (
              <span className="availability">
                <i />
                {s.availability}
              </span>
            )}
            <div className="badge-front-footer">
              <BadgeSocials socials={s.socials} />
              <span className="signature" aria-hidden="true">
                {s.signature}
              </span>
            </div>
          </div>
          <div
            className="badge-face badge-back"
            aria-hidden={!flipped}
            inert={!flipped}
          >
            <span className="badge-slot" />
            <span className="eyebrow">{s.labels.backEyebrow}</span>
            <strong>{s.labels.backHeading}</strong>
            {p.back.map((x, i) => (
              <span className="back-row" key={i}>
                <span>0{i + 1}</span>
                {x}
              </span>
            ))}
            <div className="badge-back-footer">
              <BadgeConnect
                url={cvUrl}
                qrUrl={cvQrUrl}
                hold={() => pause(true)}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="badge-flip-hint"
          onClick={toggleCard}
          aria-label={`Show ${flipped ? "front" : "back"} of identity card`}
        >
          Flip ↻
        </button>
      </div>
      <div className="hero-bottom">
        <span>
          <i className="gold-dot" />
          {p.phrases[phrase % p.phrases.length]}
        </span>
        <button
          className="motion-control"
          onClick={() => pause((x) => !x)}
          aria-pressed={paused}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>{paused ? "Resume" : "Pause"} motion</span>
        </button>
        <a href={`#${nextId}`}>
          {s.labels.scroll}
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
export function Navigation({
  brand,
  links,
  contact,
}: {
  brand: string;
  links: { id: string; label: string }[];
  contact: string;
}) {
  const [shown, show] = useState(false),
    [open, toggle] = useState(false);
  useEffect(() => {
    const update = () =>
      show(
        scrollY > (document.querySelector(".hero")?.clientHeight || 0) * 0.7,
      );
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <nav
      className={`floating-nav ${shown ? "shown" : ""}`}
      aria-label="Main navigation"
      inert={!shown}
    >
      <a className="wordmark" href="#top">
        {brand}
        <span>✦</span>
      </a>
      <div className={`nav-links ${open ? "open" : ""}`}>
        {links.map((x) => (
          <a key={x.id} href={`#${x.id}`} onClick={() => toggle(false)}>
            {x.label}
          </a>
        ))}
      </div>
      <a className="button" href="#contact">
        {contact}
        <ArrowUpRight size={16} />
      </a>
      <button
        className="menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => toggle((x) => !x)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </nav>
  );
}
export function ToolStrip({ names }: { names: string[] }) {
  const [paused, set] = useState(false);
  return (
    <div className={`tool-strip ${paused ? "paused" : ""}`}>
      <div className="tool-window">
        <div className="tool-track">
          <div>
            {names.map((x, i) => (
              <span key={i}>
                {x}
                <i aria-hidden="true">✦</i>
              </span>
            ))}
          </div>
          <div aria-hidden="true">
            {names.map((x, i) => (
              <span key={i}>
                {x}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => set((x) => !x)}
        aria-pressed={paused}
        aria-label={paused ? "Resume tool strip" : "Pause tool strip"}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
}
export function ContactForm({
  demo,
  sendLabel,
}: {
  demo: boolean;
  sendLabel: string;
}) {
  const [state, set] = useState(""),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false);
  return (
    <div className={`contact-flip ${sent ? "is-sent" : ""}`}>
      <div className="contact-flip-inner">
        <form
      className="contact-form contact-form-front"
      aria-hidden={sent}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        set("");
        const f = e.currentTarget;
        try {
          const r = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(new FormData(f))),
          });
          const d = await r.json();
          set(d.message);
          if (r.ok) {
            f.reset();
            setSent(true);
          }
        } catch {
          set("Unable to send. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="form-two">
        <label>
          Your name
          <input name="name" required maxLength={100} autoComplete="name" />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
      </div>
      <label>
        Subject <span>(optional)</span>
        <input name="subject" maxLength={160} />
      </label>
      <label>
        What are you thinking?
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {demo && (
        <p className="form-note">
          Demo mode — message delivery will be available after setup.
        </p>
      )}
      <button className="button" disabled={busy || demo}>
        {busy ? "Sending…" : sendLabel}
        <ArrowUpRight size={18} />
      </button>
      <p role="status">{state}</p>
        </form>
        <div
          className="contact-success"
          role="status"
          aria-live="polite"
          aria-hidden={!sent}
        >
          <span className="contact-success-mark" aria-hidden="true">
            âœ¦
          </span>
          <span className="eyebrow">MESSAGE RECEIVED</span>
          <h3>Thank you for reaching out.</h3>
          <p>Your note is safely in my inbox. I&apos;ll be in touch soon.</p>
          <button
            className="button"
            type="button"
            onClick={() => {
              setSent(false);
              set("");
            }}
          >
            Send another message
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
