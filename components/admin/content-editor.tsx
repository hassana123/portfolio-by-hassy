"use client";
import { useState } from "react";
import { modes, projectOutlines, type Content, type Kind } from "@/lib/model";
import {
  Field,
  Check,
  Blocks,
  ScopeField,
  AssetField,
  type MediaItem,
} from "./fields";
import { ContentDetail } from "@/components/details";
export default function ContentEditor({
  initial,
  kind,
  onSave,
  onClose,
  media,
  busy,
  sample,
}: {
  initial: Content;
  kind: Kind;
  onSave: (c: Content, action: string) => void;
  onClose: () => void;
  media: MediaItem[];
  busy: boolean;
  sample: boolean;
}) {
  // Older records were saved before downloadable project files were added.
  // Normalize that optional field before the editor renders.
  const [c, set] = useState<Content>(() => ({
      ...initial,
      downloads: initial.downloads ?? [],
    })),
    [preview, setPreview] = useState(false);
  const update = <K extends keyof Content>(k: K, v: Content[K]) =>
    set((current) => ({ ...current, [k]: v }));
  return (
    <div>
      <div className="admin-toolbar">
        <button className="admin-button" onClick={onClose}>
          ← Content library
        </button>
        <button className="admin-button" onClick={() => setPreview((x) => !x)}>
          {preview ? "Edit" : "Preview current edits"}
        </button>
      </div>
      {preview ? (
        <ContentDetail c={c} kind={kind} sample={sample} />
      ) : (
        <div className="admin-panel">
          {kind === "project" && (
            <div className="admin-toolbar">
              {(["engineering", "data"] as const).map((role) => (
                <button
                  className="admin-button"
                  key={role}
                  onClick={() =>
                    set({
                      ...c,
                      scope: role,
                      blocks: [
                        ...c.blocks,
                        ...projectOutlines[role]
                          .filter(
                            (heading) =>
                              !c.blocks.some((b) => b.heading === heading),
                          )
                          .map((heading) => ({
                            heading,
                            body: "",
                            image: "",
                            alt: "",
                          })),
                      ],
                    })
                  }
                >
                  Add {role === "engineering" ? "Engineering" : "Data Analysis"}{" "}
                  outline
                </button>
              ))}
            </div>
          )}
          <div className="admin-grid">
            <Field
              label="Title / label"
              value={c.title}
              onChange={(v) => update("title", v)}
            />
            <Field
              label="URL slug"
              value={c.slug}
              onChange={(v) => update("slug", v)}
              hint="Lowercase words separated by hyphens."
            />
            <ScopeField value={c.scope} onChange={(v) => update("scope", v)} />
            <Field
              label="Category / organisation / attribution"
              value={c.category}
              onChange={(v) => update("category", v)}
            />
            <Field
              label="Display order (smaller first)"
              type="number"
              value={String(c.order)}
              onChange={(v) => update("order", Number(v))}
            />
            <Field
              label="Publication date / period"
              value={c.date}
              onChange={(v) => update("date", v)}
            />
          </div>
          <Field
            label="Summary"
            area
            value={c.summary}
            onChange={(v) => update("summary", v)}
          />
          <Check
            label="Featured in homepage previews"
            value={c.featured}
            onChange={(v) => update("featured", v)}
          />
          <div className="admin-grid">
            <AssetField
              label="Cover image"
              value={c.cover}
              onChange={(v) => update("cover", v)}
              onSelect={(v, item) =>
                set((current) => ({
                  ...current,
                  cover: v,
                  ...(item ? { alt: item.alt } : {}),
                }))
              }
              media={media}
            />
            <Field
              label="Cover alt text"
              value={c.alt}
              onChange={(v) => update("alt", v)}
            />
          </div>
          {kind === "article" && (
            <div className="admin-grid">
              <Field
                label="External article URL (leave empty for internal article)"
                value={c.externalUrl}
                onChange={(v) => update("externalUrl", v)}
              />
              <Field
                label="External platform"
                value={c.platform}
                onChange={(v) => update("platform", v)}
              />
            </div>
          )}
          {kind === "cv" ? (
            <>
              <AssetField
                label="CV PDF"
                documents
                value={c.file}
                onChange={(v) => update("file", v)}
                media={media}
              />
              <p className="admin-note">
                Explicitly choose each mode where this CV is appropriate. A
                combined CV is not enabled for single-role modes automatically.
              </p>
              {modes.map((m) => (
                <Check
                  key={m}
                  label={`Show in ${m} mode`}
                  value={c.eligibleModes.includes(m)}
                  onChange={(yes) =>
                    update(
                      "eligibleModes",
                      yes
                        ? [...c.eligibleModes, m]
                        : c.eligibleModes.filter((x) => x !== m),
                    )
                  }
                />
              ))}
            </>
          ) : (
            <>
              <Field
                label="Body / Markdown"
                area
                value={c.body}
                onChange={(v) => update("body", v)}
                hint="HTML and inline Markdown images are disabled. Use image blocks for managed media."
              />
              <h2>Case study / content blocks</h2>
              <Blocks
                value={c.blocks}
                onChange={(v) => update("blocks", v)}
                media={media}
              />
            </>
          )}
          {kind === "project" && (
            <>
              <label className="admin-field">
                Demo video
                <select
                  value={c.video}
                  onChange={(e) => update("video", e.target.value)}
                >
                  <option value="">None</option>
                  {media
                    .filter((m) => m.mime === "video/mp4")
                    .map((m) => (
                      <option key={m.id} value={`/api/media/${m.id}`}>
                        {m.name}
                      </option>
                    ))}
                </select>
              </label>
              <Field
                label="Video title / accessible description"
                value={c.videoTitle}
                onChange={(v) => update("videoTitle", v)}
              />
              <Field
                label="Tools (comma separated)"
                value={c.tools.join(", ")}
                onChange={(v) =>
                  update(
                    "tools",
                    v
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
              />
              <div className="admin-grid">
                <Field
                  label="Power BI / Tableau embed URL"
                  value={c.embedUrl}
                  onChange={(v) => update("embedUrl", v)}
                />
                <Field
                  label="Dashboard accessible title"
                  value={c.embedTitle}
                  onChange={(v) => update("embedTitle", v)}
                />
              </div>
              <p className="admin-note">
                Publicly embedded dashboards must contain only information
                suitable for public sharing. Use a cover image and dashboard
                link as a fallback.
              </p>
              <h2>Downloadable project files</h2>
              <p className="admin-note">
                Upload datasets, workbooks and Power BI files in Media first,
                then select them here. These appear as public download buttons
                on the published project page.
              </p>
              {c.downloads.map((download, i) => (
                <div className="block-editor" key={i}>
                  <Field
                    label="Download label"
                    value={download.label}
                    onChange={(v) =>
                      update(
                        "downloads",
                        c.downloads.map((x, n) =>
                          n === i ? { ...x, label: v } : x,
                        ),
                      )
                    }
                  />
                  <AssetField
                    label="File"
                    downloadable
                    value={download.file}
                    onChange={(v) =>
                      update(
                        "downloads",
                        c.downloads.map((x, n) =>
                          n === i ? { ...x, file: v } : x,
                        ),
                      )
                    }
                    media={media}
                  />
                  <button
                    type="button"
                    className="admin-button danger"
                    onClick={() =>
                      update(
                        "downloads",
                        c.downloads.filter((_, n) => n !== i),
                      )
                    }
                  >
                    Remove file
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-button"
                onClick={() =>
                  update("downloads", [
                    ...c.downloads,
                    { label: "", file: "" },
                  ])
                }
              >
                + Add downloadable file
              </button>
            </>
          )}
          <h2>Links</h2>
          {kind === "project" && (
            <p className="admin-note">
              Project covers show a GitHub icon for a github.com link and a link
              icon for your other URL, with any label. If you add several other
              URLs, label the main one “Live site”, “Demo”, or “Dashboard” to
              give it priority; otherwise the first is used. Publish this
              project to update its public links.
            </p>
          )}
          {c.links.map((l, i) => (
            <div className="block-editor" key={i}>
              <Field
                label="Link label (Live site, GitHub, report, video…)"
                value={l.label}
                onChange={(v) =>
                  update(
                    "links",
                    c.links.map((x, n) => (n === i ? { ...x, label: v } : x)),
                  )
                }
              />
              <Field
                label="HTTPS URL"
                value={l.url}
                onChange={(v) =>
                  update(
                    "links",
                    c.links.map((x, n) => (n === i ? { ...x, url: v } : x)),
                  )
                }
              />
              <button
                className="admin-button danger"
                onClick={() =>
                  update(
                    "links",
                    c.links.filter((_, n) => n !== i),
                  )
                }
              >
                Remove link
              </button>
            </div>
          ))}
          <button
            className="admin-button"
            onClick={() =>
              update("links", [...c.links, { label: "", url: "" }])
            }
          >
            + Add link
          </button>
          <h2>Search appearance</h2>
          <Field
            label="SEO title (optional)"
            value={c.seoTitle}
            onChange={(v) => update("seoTitle", v)}
          />
          <Field
            label="SEO description (optional)"
            area
            value={c.seoDescription}
            onChange={(v) => update("seoDescription", v)}
          />
        </div>
      )}
      <div className="admin-toolbar">
        <button
          className="admin-button"
          disabled={busy}
          onClick={() => onSave(c, "draft")}
        >
          Save draft
        </button>
        <button
          className="admin-button primary"
          disabled={busy}
          onClick={() => onSave(c, "publish")}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
