"use client";
import { useEffect, useState } from "react";
import type { Settings, Mode } from "@/lib/model";
import { ArrowDown, ArrowUpRight, Pause, Play, Menu, X } from "lucide-react";
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
export function Hero({
  settings: s,
  mode,
  nextId = "contact",
}: {
  settings: Settings;
  mode: Mode;
  nextId?: string;
}) {
  const p = s.profiles[mode];
  const [flipped, flip] = useState(false);
  const [paused, pause] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tick, reset] = useState(0);
  const [phrase, setPhrase] = useState(0);
  const reduced = useReduced();
  useEffect(() => {
    if (reduced || paused || focus || hovered) return;
    let interval: ReturnType<typeof setInterval>;
    const first = setTimeout(
      () => {
        if (!document.hidden) flip((x) => !x);
        interval = setInterval(() => {
          if (!document.hidden) flip((x) => !x);
        }, 3600);
      },
      tick ? 3600 : 3100,
    );
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [reduced, paused, focus, hovered, tick]);
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
      <div className="badge-rig">
        <div className="lanyard" aria-hidden="true">
          <span>
            {s.brand} ✦ {s.brand} ✦
          </span>
        </div>
        <div className="clip" aria-hidden="true" />
        <button
          className={`badge ${flipped ? "flipped" : ""}`}
          onClick={() => {
            flip((x) => !x);
            reset((x) => x + 1);
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={`${flipped ? p.back.join(". ") : `${s.name}. ${p.title}. ${s.availability}`}. Show ${flipped ? "front" : "back"} of identity card`}
        >
          <span className="badge-face badge-front" aria-hidden={flipped}>
            <span className="badge-slot" />
            <span className="badge-meta">{s.labels.badgeTagline}</span>
            {s.portrait ? (
              <img
                className="badge-portrait"
                src={s.portrait}
                alt={s.portraitAlt}
                width="380"
                height="380"
              />
            ) : (
              <span className="portrait-empty">Your portrait here</span>
            )}
            <strong>{s.name}</strong>
            <span className="badge-title">{p.title}</span>
            {s.availability && (
              <span className="availability">
                <i />
                {s.availability}
              </span>
            )}
            <span className="signature">{s.signature}</span>
            <span className="badge-bottom">
              <span className="barcode" aria-hidden="true">
                ┃│┃┃││┃│┃┃│┃│┃┃
              </span>
              <span>
                {s.labels.idLabel}
                <br />
                {s.labels.flipHint}
              </span>
            </span>
          </span>
          <span className="badge-face badge-back" aria-hidden={!flipped}>
            <span className="badge-slot" />
            <span className="eyebrow">{s.labels.backEyebrow}</span>
            <strong>{s.labels.backHeading}</strong>
            {p.back.map((x, i) => (
              <span className="back-row" key={i}>
                <span>0{i + 1}</span>
                {x}
              </span>
            ))}
            <span className="back-note">{s.personal.split(". ")[0]}</span>
            <span className="signature">{s.signature}</span>
            {s.handle && <span>{s.handle}</span>}
          </span>
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
    [busy, setBusy] = useState(false);
  return (
    <form
      className="contact-form"
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
          if (r.ok) f.reset();
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
  );
}
