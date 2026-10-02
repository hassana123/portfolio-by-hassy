"use client";
import type { Content, Section } from "@/lib/model";
export function Field({
  label,
  value,
  onChange,
  area = false,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      {label}
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}{" "}
      {hint && <span className="admin-note">{hint}</span>}
    </label>
  );
}
export function Check({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="admin-check">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
export type MediaItem = {
  id: string;
  name: string;
  mime: string;
  alt: string;
  bytes: number;
};
export function AssetField({
  label,
  value,
  onChange,
  onSelect,
  media,
  documents = false,
  videos = false,
  downloadable = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelect?: (value: string, item?: MediaItem) => void;
  media: MediaItem[];
  documents?: boolean;
  videos?: boolean;
  downloadable?: boolean;
}) {
  const eligible = media.filter((m) =>
    documents
      ? m.mime === "application/pdf"
      : videos
        ? m.mime === "video/mp4"
        : downloadable
          ? !m.mime.startsWith("image/") && m.mime !== "video/mp4"
        : m.mime.startsWith("image/"),
  );
  return (
    <label className="admin-field">
      {label}
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          const item = eligible.find((m) => `/api/media/${m.id}` === next);
          if (onSelect) onSelect(next, item);
          else onChange(next);
        }}
      >
        <option value="">None</option>
        {value.startsWith("/demo/") && (
          <option value={value}>Demo asset: {value}</option>
        )}
        {eligible.map((m) => (
          <option key={m.id} value={`/api/media/${m.id}`}>
            {m.name}
          </option>
        ))}
      </select>
      <span className="admin-note">
        Upload files in Media, then select them here. Stored alt text fills
        automatically when available.
      </span>
    </label>
  );
}
export function Blocks({
  value,
  onChange,
  media,
}: {
  value: Content["blocks"];
  onChange: (v: Content["blocks"]) => void;
  media: MediaItem[];
}) {
  const update = (i: number, key: string, v: string) =>
    onChange(value.map((b, n) => (n === i ? { ...b, [key]: v } : b)));
  const move = (i: number, d: number) => {
    const a = [...value];
    [a[i], a[i + d]] = [a[i + d], a[i]];
    onChange(a);
  };
  return (
    <div>
      {value.map((b, i) => (
        <div className="block-editor" key={i}>
          <div className="admin-toolbar">
            <b>Block {i + 1}</b>
            <button
              type="button"
              className="admin-button"
              disabled={!i}
              onClick={() => move(i, -1)}
            >
              ↑ Move up
            </button>
            <button
              type="button"
              className="admin-button"
              disabled={i === value.length - 1}
              onClick={() => move(i, 1)}
            >
              ↓ Move down
            </button>
            <button
              type="button"
              className="admin-button danger"
              onClick={() => onChange(value.filter((_, n) => n !== i))}
            >
              Remove
            </button>
          </div>
          <Field
            label="Heading (optional)"
            value={b.heading}
            onChange={(v) => update(i, "heading", v)}
          />
          <Field
            label="Text / Markdown"
            area
            value={b.body}
            onChange={(v) => update(i, "body", v)}
          />
          <AssetField
            label="Image (optional)"
            value={b.image}
            onChange={(v) => update(i, "image", v)}
            onSelect={(v, item) =>
              onChange(
                value.map((block, n) =>
                  n === i
                    ? { ...block, image: v, ...(item ? { alt: item.alt } : {}) }
                    : block,
                ),
              )
            }
            media={media}
          />
          <Field
            label="Image alt text"
            value={b.alt}
            onChange={(v) => update(i, "alt", v)}
          />
        </div>
      ))}
      <button
        type="button"
        className="admin-button"
        onClick={() =>
          onChange([...value, { heading: "", body: "", image: "", alt: "" }])
        }
      >
        + Add block
      </button>
    </div>
  );
}
export function ScopeField({
  value,
  onChange,
}: {
  value: Content["scope"] | Section["scope"];
  onChange: (v: Content["scope"]) => void;
}) {
  return (
    <label className="admin-field">
      Role scope
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Content["scope"])}
      >
        <option value="general">General — all modes</option>
        <option value="engineering">Engineering only</option>
        <option value="data">Data Analysis only</option>
        <option value="both">Both — relevant in either mode</option>
      </select>
    </label>
  );
}
