"use client";
import { useState } from "react";
import {
  modes,
  templates,
  contrast,
  type Settings,
  type Section,
  type Mode,
} from "@/lib/model";
import {
  Field,
  Check,
  AssetField,
  Blocks,
  ScopeField,
  type MediaItem,
} from "./fields";
export default function SettingsEditor({
  value: s,
  onChange: set,
  tab,
  media,
}: {
  value: Settings;
  onChange: (s: Settings) => void;
  tab: string;
  media: MediaItem[];
}) {
  const [mode, setMode] = useState<Mode>("combined");
  const [drag, setDrag] = useState<number | null>(null);
  const [template, setTemplate] = useState<Section["template"]>("text-image");
  const update = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    set({ ...s, [k]: v });
  const profile = s.profiles[mode];
  const setProfile = (k: string, v: unknown) =>
    set({ ...s, profiles: { ...s.profiles, [mode]: { ...profile, [k]: v } } });
  const sectionUpdate = (i: number, next: Section) =>
    update(
      "sections",
      s.sections.map((x, n) => (n === i ? next : x)),
    );
  const move = (from: number, to: number) => {
    if (to < 0 || to >= s.sections.length) return;
    const a = [...s.sections],
      item = a.splice(from, 1)[0];
    a.splice(to, 0, item);
    update("sections", a);
  };
  if (tab === "modes")
    return (
      <>
        <div className="admin-panel">
          <h2>One portfolio. Three ways to show up.</h2>
          <p className="admin-note">
            Role switches are drafts until you publish. Disabling a role
            preserves its content and removes its public routes.
          </p>
          <Check
            label="Front End Engineering enabled"
            value={s.engineering}
            onChange={(v) => update("engineering", v)}
          />
          <Check
            label="Data Analysis enabled"
            value={s.data}
            onChange={(v) => update("data", v)}
          />
          {!s.engineering && !s.data && (
            <p role="alert">At least one role must remain enabled.</p>
          )}
        </div>
        <div className="admin-tabs">
          {modes.map((m) => (
            <button
              key={m}
              className={m === mode ? "active" : ""}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="admin-panel">
          <p className="admin-note">
            Single-role starter words are sample alternatives. Edit each
            complete profile before publishing.
          </p>
          <Field
            label="Professional title"
            value={profile.title}
            onChange={(v) => setProfile("title", v)}
          />
          <div className="admin-grid">
            {profile.words.map((w, i) => (
              <Field
                key={i}
                label={`Hero word ${i + 1}`}
                value={w}
                onChange={(v) =>
                  setProfile(
                    "words",
                    profile.words.map((x, n) => (n === i ? v : x)),
                  )
                }
              />
            ))}
          </div>
          <Field
            label="Introduction heading"
            value={profile.heading}
            onChange={(v) => setProfile("heading", v)}
          />
          <Field
            label="Introduction text"
            area
            value={profile.intro}
            onChange={(v) => setProfile("intro", v)}
          />
          <Field
            label="Cycling phrases (one per line)"
            area
            value={profile.phrases.join("\n")}
            onChange={(v) => setProfile("phrases", v.split("\n"))}
          />
          <Field
            label="ID card back rows (one per line)"
            area
            value={profile.back.join("\n")}
            onChange={(v) => setProfile("back", v.split("\n"))}
          />
          <Field
            label="Contact invitation"
            value={profile.contact}
            onChange={(v) => setProfile("contact", v)}
          />
          <Field
            label="SEO description for this mode"
            area
            value={profile.seoDescription}
            onChange={(v) => setProfile("seoDescription", v)}
          />
        </div>
      </>
    );
  if (tab === "homepage")
    return (
      <>
        <p className="admin-note">
          Drag sections to reorder or use Move up / Move down. Empty content
          sections automatically disappear, including their navigation links.
        </p>
        {s.sections.map((x, i) => (
          <div
            className="admin-panel"
            key={x.id}
            draggable
            onDragStart={() => setDrag(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (drag !== null) move(drag, i);
              setDrag(null);
            }}
          >
            <div className="admin-toolbar">
              <b>{x.heading || x.template}</b>
              <button
                className="admin-button"
                disabled={!i}
                onClick={() => move(i, i - 1)}
              >
                ↑ Move up
              </button>
              <button
                className="admin-button"
                disabled={i === s.sections.length - 1}
                onClick={() => move(i, i + 1)}
              >
                ↓ Move down
              </button>
              <button
                className="admin-button danger"
                onClick={() =>
                  update(
                    "sections",
                    s.sections.filter((_, n) => n !== i),
                  )
                }
              >
                Remove section
              </button>
            </div>
            <Check
              label="Section visible"
              value={x.enabled}
              onChange={(v) => sectionUpdate(i, { ...x, enabled: v })}
            />
            <details>
              <summary>Edit section · {x.template}</summary>
              <div className="admin-grid">
                <Field
                  label="Section heading"
                  value={x.heading}
                  onChange={(v) => sectionUpdate(i, { ...x, heading: v })}
                />
                <Field
                  label="Navigation label"
                  value={x.label}
                  onChange={(v) => sectionUpdate(i, { ...x, label: v })}
                />
                <Field
                  label="Anchor ID"
                  value={x.id}
                  onChange={(v) => sectionUpdate(i, { ...x, id: v })}
                />
                <ScopeField
                  value={x.scope}
                  onChange={(v) => sectionUpdate(i, { ...x, scope: v })}
                />
              </div>
              <Field
                label="Section introduction"
                area
                value={x.intro}
                onChange={(v) => sectionUpdate(i, { ...x, intro: v })}
              />
              {["text-image", "gallery", "cards"].includes(x.template) && (
                <>
                  <AssetField
                    label="Section image"
                    value={x.image}
                    onChange={(v) => sectionUpdate(i, { ...x, image: v })}
                    media={media}
                  />
                  <Field
                    label="Section image alt"
                    value={x.alt}
                    onChange={(v) => sectionUpdate(i, { ...x, alt: v })}
                  />
                  <Blocks
                    value={x.items}
                    onChange={(v) => sectionUpdate(i, { ...x, items: v })}
                    media={media}
                  />
                </>
              )}
            </details>
          </div>
        ))}
        <div className="admin-panel">
          <label className="admin-field">
            New section template
            <select
              value={template}
              onChange={(e) =>
                setTemplate(e.target.value as Section["template"])
              }
            >
              {templates.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button
            className="admin-button"
            onClick={() =>
              update("sections", [
                ...s.sections,
                {
                  id: `section-${crypto.randomUUID().slice(0, 8)}`,
                  template,
                  label: "New section",
                  heading: "New section",
                  intro: "",
                  enabled: true,
                  scope:
                    template === "engineering-projects"
                      ? "engineering"
                      : template === "data-projects"
                        ? "data"
                        : "general",
                  image: "",
                  alt: "",
                  items: [],
                },
              ])
            }
          >
            + Insert section
          </button>
        </div>
      </>
    );
  return (
    <>
      <div className="admin-panel">
        <h2>Identity & contact</h2>
        <div className="admin-grid">
          <Field
            label="Full name"
            value={s.name}
            onChange={(v) => update("name", v)}
          />
          <Field
            label="Navigation brand"
            value={s.brand}
            onChange={(v) => update("brand", v)}
          />
          <Field
            label="Handwritten signature"
            value={s.signature}
            onChange={(v) => update("signature", v)}
          />
          <Field
            label="Availability (empty hides pill)"
            value={s.availability}
            onChange={(v) => update("availability", v)}
          />
          <Field
            label="Contact email"
            value={s.email}
            onChange={(v) => update("email", v)}
          />
          <Field
            label="Social handle on badge"
            value={s.handle}
            onChange={(v) => update("handle", v)}
          />
        </div>
        <Field
          label="Personal details"
          area
          value={s.personal}
          onChange={(v) => update("personal", v)}
        />
        <div className="admin-grid">
          <AssetField
            label="ID portrait"
            value={s.portrait}
            onChange={(v) => update("portrait", v)}
            media={media}
          />
          <Field
            label="Portrait alt text"
            value={s.portraitAlt}
            onChange={(v) => update("portraitAlt", v)}
          />
          <AssetField
            label="About photo"
            value={s.aboutImage}
            onChange={(v) => update("aboutImage", v)}
            media={media}
          />
          <Field
            label="About photo alt text"
            value={s.aboutAlt}
            onChange={(v) => update("aboutAlt", v)}
          />
          <AssetField
            label="Second collage image"
            value={s.collageImage}
            onChange={(v) => update("collageImage", v)}
            media={media}
          />
          <Field
            label="Second collage image alt text"
            value={s.collageAlt}
            onChange={(v) => update("collageAlt", v)}
          />
        </div>
        <h2>Social links</h2>
        {s.socials.map((x, i) => (
          <div className="block-editor" key={i}>
            <Field
              label="Label"
              value={x.label}
              onChange={(v) =>
                update(
                  "socials",
                  s.socials.map((a, n) => (n === i ? { ...a, label: v } : a)),
                )
              }
            />
            <Field
              label="HTTPS URL"
              value={x.url}
              onChange={(v) =>
                update(
                  "socials",
                  s.socials.map((a, n) => (n === i ? { ...a, url: v } : a)),
                )
              }
            />
            <button
              className="admin-button danger"
              onClick={() =>
                update(
                  "socials",
                  s.socials.filter((_, n) => n !== i),
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="admin-button"
          onClick={() =>
            update("socials", [...s.socials, { label: "", url: "" }])
          }
        >
          + Add social link
        </button>
      </div>
      <div className="admin-panel">
        <h2>Interface labels</h2>
        {Object.entries(s.labels).map(([k, v]) => (
          <Field
            key={k}
            label={k}
            value={v}
            onChange={(next) => update("labels", { ...s.labels, [k]: next })}
          />
        ))}
      </div>
      <div className="admin-panel">
        <h2>Midnight Lilac theme</h2>
        {Object.entries(s.theme).map(([k, v]) => (
          <Field
            key={k}
            type="color"
            label={k}
            value={v}
            onChange={(next) => update("theme", { ...s.theme, [k]: next })}
          />
        ))}
        <div
          style={{
            padding: 20,
            background: s.theme.paper,
            color: s.theme.ink,
            borderRadius: 10,
          }}
        >
          Body text on ivory · {contrast(s.theme.ink, s.theme.paper).toFixed(2)}
          :1
          <br />
          <span
            style={{
              display: "inline-block",
              background: s.theme.accent,
              padding: 10,
              borderRadius: 10,
            }}
          >
            Button contrast · {contrast(s.theme.ink, s.theme.accent).toFixed(2)}
            :1
          </span>
        </div>
        {(contrast(s.theme.ink, s.theme.paper) < 4.5 ||
          contrast(s.theme.ink, s.theme.accent) < 4.5) && (
          <p role="alert">
            Contrast is below 4.5:1. Choose a darker ink or lighter background
            before saving.
          </p>
        )}
      </div>
    </>
  );
}
