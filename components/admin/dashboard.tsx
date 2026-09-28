"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  blankContent,
  contentSchema,
  settingsSchema,
  modes,
  type Settings,
  type RecordItem,
  type Kind,
  type Content,
} from "@/lib/model";
import {
  saveSettings,
  saveContent,
  clearStarter,
  seedSamples,
  updateMessage,
  editMedia,
  deleteMedia,
  logout,
} from "@/app/admin/actions";
import ContentEditor from "./content-editor";
import SettingsEditor from "./settings-editor";
import MediaUpload from "./media-upload";
import { Field, type MediaItem } from "./fields";
type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  archived: boolean;
  notification: string;
  created_at: string;
};
const tabs = [
  ["overview", "Overview"],
  ["modes", "Site modes"],
  ["homepage", "Homepage / sections"],
  ["projects", "Projects"],
  ["articles", "Articles"],
  ["experience", "Experience / education"],
  ["community", "Community / teaching"],
  ["certifications", "Certifications"],
  ["testimonials", "Testimonials"],
  ["media", "Media"],
  ["cvs", "CVs"],
  ["messages", "Messages"],
  ["settings", "Settings"],
] as const;
const kindMap: Record<string, Kind> = {
  projects: "project",
  articles: "article",
  experience: "experience",
  community: "community",
  certifications: "certification",
  testimonials: "testimonial",
  cvs: "cv",
  services: "service",
  skills: "skill",
};
export default function Dashboard({
  initialSettings,
  initialRecords,
  messages,
  media,
  demo,
  tab: initialTab,
}: {
  initialSettings: Settings;
  initialRecords: RecordItem[];
  messages: Message[];
  media: MediaItem[];
  demo: boolean;
  tab: string;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings),
    [records, setRecords] = useState(initialRecords),
    [tab, setTab] = useState(initialTab),
    [status, setStatus] = useState(""),
    [pending, start] = useTransition(),
    [editor, setEditor] = useState<{
      id: string | null;
      kind: Kind;
      content: Content;
      sample: boolean;
    } | null>(null),
    [search, setSearch] = useState(""),
    [confirm, setConfirm] = useState(""),
    [preview, setPreview] = useState(false),
    [mode, setMode] = useState("combined"),
    [mobile, setMobile] = useState(false),
    [localMessages, setMessages] = useState(messages);
  useEffect(() => {
    if (!demo) setRecords(initialRecords);
  }, [initialRecords, demo]);
  useEffect(() => {
    if (!demo) setMessages(messages);
  }, [messages, demo]);
  const base = demo ? "/admin/demo" : "/admin";
  const navigate = (next: string) => {
    setTab(next);
    setEditor(null);
    setSearch("");
    history.replaceState(
      null,
      "",
      next === "overview" ? base : `${base}/${next}`,
    );
  };
  const run = (fn: () => Promise<{ ok: boolean; message: string }>) =>
    start(async () => {
      try {
        const result = await fn();
        setStatus(result.message);
        if (result.ok) router.refresh();
      } catch {
        setStatus(
          "The request failed. Your edits are still here. Please try again.",
        );
      }
    });
  const save = (publish: boolean) => {
    if (demo) {
      const result = settingsSchema.safeParse(settings);
      setStatus(
        result.success
          ? `Demo ${publish ? "publish" : "save"} simulated in this tab only. Nothing is stored.`
          : result.error.issues.map((x) => x.message).join("; "),
      );
      return;
    }
    run(() => saveSettings(settings, publish));
  };
  const persist = (
    c: Content,
    action: string,
    id = editor?.id ?? null,
    kind = editor?.kind,
  ) => {
    if (!kind) return;
    if (demo) {
      const parsed = contentSchema.safeParse(c);
      if (!parsed.success) {
        setStatus(parsed.error.issues.map((x) => x.message).join("; "));
        return;
      }
      const recordId = id || crypto.randomUUID();
      setRecords((old) =>
        action === "delete"
          ? old.filter((x) => x.id !== recordId)
          : id
            ? old.map((r) =>
                r.id === id
                  ? {
                      ...r,
                      draft: c,
                      published:
                        action === "publish"
                          ? c
                          : action === "unpublish"
                            ? null
                            : r.published,
                      archived:
                        action === "archive"
                          ? true
                          : action === "restore"
                            ? false
                            : r.archived,
                    }
                  : r,
              )
            : [
                ...old,
                {
                  id: recordId,
                  kind,
                  draft: c,
                  published: action === "publish" ? c : null,
                  is_seed: false,
                  source: "",
                  archived: false,
                },
              ],
      );
      setStatus(
        "Demo change applied in memory only. Reloading resets this demonstration.",
      );
      setEditor(null);
      return;
    }
    run(async () => {
      const r = await saveContent(id, kind, c, action);
      if (r.ok) {
        setEditor(null);
        const recordId = id || r.id!;
        setRecords((old) =>
          action === "delete"
            ? old.filter((x) => x.id !== recordId)
            : id
              ? old.map((x) =>
                  x.id === id
                    ? {
                        ...x,
                        draft: c,
                        published:
                          action === "publish"
                            ? c
                            : action === "unpublish"
                              ? null
                              : x.published,
                        archived:
                          action === "archive"
                            ? true
                            : action === "restore"
                              ? false
                              : x.archived,
                      }
                    : x,
                )
              : [
                  ...old,
                  {
                    id: recordId,
                    kind,
                    draft: c,
                    published: action === "publish" ? c : null,
                    is_seed: false,
                    source: "",
                    archived: false,
                  },
                ],
        );
      }
      return r;
    });
  };
  const seedCount = records.filter((x) => x.is_seed).length;
  const activeKind = kindMap[tab];
  const add = (kind: Kind) => {
    const content = blankContent();
    if (kind === "project") {
      content.scope = "engineering";
      content.blocks = [
        { heading: "Overview & problem", body: "", image: "", alt: "" },
        { heading: "My role & contributions", body: "", image: "", alt: "" },
        { heading: "Approach & outcomes", body: "", image: "", alt: "" },
      ];
    }
    setEditor({ id: null, kind, content, sample: false });
  };
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="wordmark" href="/">
          hassana<span>✦</span>
        </a>
        <nav aria-label="Owner dashboard">
          {tabs.map(([id, label]) => (
            <a
              key={id}
              className={tab === id ? "active" : ""}
              href={`${base}/${id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        {!demo && (
          <form action={logout}>
            <button className="admin-button" style={{ marginTop: 25 }}>
              Sign out
            </button>
          </form>
        )}
      </aside>
      <main className="admin-main" id="main">
        <span className="eyebrow">
          YOUR PORTFOLIO STUDIO{demo ? " / DEMO" : ""}
        </span>
        <h1>
          {editor
            ? `${editor.id ? "Edit" : "New"} ${editor.kind}`
            : tabs.find((x) => x[0] === tab)?.[1] || tab}
        </h1>
        {demo && (
          <p className="admin-note">
            Interactive demo. Changes stay in this browser tab&apos;s memory and
            reset on reload. Authentication, persistence, media and messages
            require Supabase.
          </p>
        )}
        {editor ? (
          <ContentEditor
            key={editor.id || "new"}
            initial={editor.content}
            kind={editor.kind}
            sample={editor.sample}
            media={media}
            busy={pending}
            onClose={() => setEditor(null)}
            onSave={persist}
          />
        ) : (
          <>
            {tab === "overview" && (
              <>
                <div className="admin-panel">
                  <h2>A space that grows with you.</h2>
                  <p>
                    Manage your work, shape your story, and publish with
                    intention.
                  </p>
                  <div className="admin-toolbar">
                    <button
                      className="admin-button primary"
                      onClick={() => navigate("modes")}
                    >
                      Choose your site mode
                    </button>
                    <button
                      className="admin-button"
                      onClick={() => navigate("homepage")}
                    >
                      Arrange your homepage
                    </button>
                    <a
                      className="admin-button"
                      href="/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open public site ↗
                    </a>
                  </div>
                  <p className="admin-note">
                    {records.length} content records ·{" "}
                    {records.filter((x) => x.published && !x.archived).length}{" "}
                    published · {localMessages.filter((x) => !x.is_read).length}{" "}
                    unread enquiries
                  </p>
                </div>
                <div className="admin-panel">
                  <h2>Starter content</h2>
                  <p className="admin-note">
                    {seedCount} labelled sample/imported records across your
                    content library. Clearing them preserves your own records,
                    owner account, media and site settings. It does not reset
                    homepage copy.
                  </p>
                  {!records.length && (
                    <button
                      className="admin-button"
                      disabled={pending || demo}
                      onClick={() => run(seedSamples)}
                    >
                      Add optional sample drafts
                    </button>
                  )}
                  {seedCount > 0 && (
                    <>
                      <Field
                        label="Type CLEAR STARTER CONTENT to confirm removal"
                        value={confirm}
                        onChange={setConfirm}
                      />
                      <button
                        className="admin-button danger"
                        disabled={
                          pending || confirm !== "CLEAR STARTER CONTENT"
                        }
                        onClick={() =>
                          demo
                            ? (setRecords(records.filter((x) => !x.is_seed)),
                              setStatus(
                                "Sample records removed from this demo tab.",
                              ))
                            : run(async () => {
                                const r = await clearStarter(
                                  seedCount,
                                  confirm,
                                );
                                if (r.ok) {
                                  setRecords(records.filter((x) => !x.is_seed));
                                  setConfirm("");
                                }
                                return r;
                              })
                        }
                      >
                        Clear {seedCount} starter records
                      </button>
                    </>
                  )}
                </div>
                <div className="admin-panel">
                  <h2>Publishing guide</h2>
                  <p className="admin-note">
                    Save draft keeps the public version intact. Preview lets you
                    inspect all three role modes. Publish site updates role
                    settings, copy and sections together. Publish individual
                    records when ready. Unpublish hides a record without
                    deleting it.
                  </p>
                </div>
              </>
            )}
            {["modes", "homepage", "settings"].includes(tab) && (
              <>
                <div className="admin-toolbar">
                  <button
                    className="admin-button"
                    disabled={pending}
                    onClick={() => save(false)}
                  >
                    Save draft
                  </button>
                  <button
                    className="admin-button"
                    disabled={demo}
                    onClick={() => setPreview((x) => !x)}
                  >
                    Preview saved drafts
                  </button>
                  <button
                    className="admin-button primary"
                    disabled={pending}
                    onClick={() => save(true)}
                  >
                    Publish site
                  </button>
                  {tab === "homepage" && (
                    <>
                      <button
                        className="admin-button"
                        onClick={() => navigate("services")}
                      >
                        Edit service rows
                      </button>
                      <button
                        className="admin-button"
                        onClick={() => navigate("skills")}
                      >
                        Edit tools
                      </button>
                    </>
                  )}
                </div>
                {preview && (
                  <div className="admin-panel">
                    <p className="admin-note">
                      This preview uses saved drafts. Save first to include
                      recent edits.
                    </p>
                    <div className="admin-toolbar">
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        aria-label="Preview role mode"
                      >
                        {modes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <button
                        className="admin-button"
                        onClick={() => setMobile((x) => !x)}
                      >
                        {mobile ? "Desktop width" : "Mobile width"}
                      </button>
                      <a
                        href={`/admin/preview?mode=${mode}`}
                        target="_blank"
                        className="admin-button"
                        rel="noreferrer"
                      >
                        Open preview ↗
                      </a>
                    </div>
                    <iframe
                      title="Private homepage draft preview"
                      className={`preview-frame ${mobile ? "mobile" : ""}`}
                      src={`/admin/preview?mode=${mode}`}
                    />
                  </div>
                )}
                <SettingsEditor
                  value={settings}
                  onChange={setSettings}
                  tab={tab}
                  media={media}
                />
                <div className="admin-toolbar">
                  <button
                    className="admin-button"
                    disabled={pending}
                    onClick={() => save(false)}
                  >
                    Save draft
                  </button>
                  <button
                    className="admin-button primary"
                    disabled={pending}
                    onClick={() => save(true)}
                  >
                    Publish site
                  </button>
                </div>
              </>
            )}
            {activeKind && (
              <>
                <div className="admin-toolbar">
                  <button
                    className="admin-button primary"
                    onClick={() => add(activeKind)}
                  >
                    + Add {activeKind}
                  </button>
                </div>
                <input
                  aria-label="Search content"
                  placeholder="Search titles or summaries…"
                  className="admin-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="admin-panel">
                  {records
                    .filter(
                      (x) =>
                        x.kind === activeKind &&
                        `${x.draft.title} ${x.draft.summary}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((r) => (
                      <article className="admin-record" key={r.id}>
                        <div>
                          <h3>{r.draft.title}</h3>
                          <p>
                            {r.archived
                              ? "Archived"
                              : r.published
                                ? "Published"
                                : "Draft"}{" "}
                            · {r.draft.scope}
                            {r.is_seed ? " · Starter" : ""} · Order{" "}
                            {r.draft.order}
                          </p>
                          {r.source && <p>{r.source}</p>}
                        </div>
                        <button
                          className="admin-button"
                          onClick={() =>
                            setEditor({
                              id: r.id,
                              kind: r.kind,
                              content: r.draft,
                              sample: r.is_seed,
                            })
                          }
                        >
                          Edit
                        </button>
                        {r.published && (
                          <button
                            className="admin-button"
                            disabled={pending}
                            onClick={() =>
                              persist(r.draft, "unpublish", r.id, r.kind)
                            }
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          className="admin-button"
                          disabled={pending}
                          onClick={() =>
                            persist(
                              r.draft,
                              r.archived ? "restore" : "archive",
                              r.id,
                              r.kind,
                            )
                          }
                        >
                          {r.archived ? "Restore" : "Archive"}
                        </button>
                        <button
                          className="admin-button danger"
                          disabled={pending}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete “${r.draft.title}” and all its revisions? This cannot be undone.`,
                              )
                            )
                              persist(r.draft, "delete", r.id, r.kind);
                          }}
                        >
                          Delete
                        </button>
                      </article>
                    ))}
                  {!records.some((x) => x.kind === activeKind) && (
                    <p className="empty-state">
                      A fresh start. Add your first {activeKind}.
                    </p>
                  )}
                </div>
              </>
            )}
            {tab === "media" && (
              <>
                <div className="admin-panel">
                  <h2>Upload a file</h2>
                  <p className="admin-note">
                    JPG, PNG, WebP, PDF or MP4 · up to 25 MB. Files remain
                    private until referenced by visible published content.
                    Replace an asset by uploading a new file and selecting it in
                    the draft editor.
                  </p>
                  <MediaUpload demo={demo} />
                </div>
                <div className="media-grid">
                  {media.map((m) => (
                    <div className="admin-panel" key={m.id}>
                      {m.mime.startsWith("image/") && (
                        <img
                          src={`/api/media/${m.id}`}
                          alt={m.alt}
                          width="300"
                          height="200"
                        />
                      )}
                      <h3>{m.name}</h3>
                      <p className="admin-note">
                        {(m.bytes / 1024).toFixed(0)} KB · {m.mime}
                      </p>
                      <code>/api/media/{m.id}</code>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = new FormData(e.currentTarget);
                          run(() => editMedia(m.id, String(form.get("alt"))));
                        }}
                      >
                        <label className="admin-field">
                          Alt text
                          <input name="alt" defaultValue={m.alt} />
                        </label>
                        <button className="admin-button" disabled={pending}>
                          Save alt text
                        </button>
                      </form>
                      <button
                        className="admin-button danger"
                        disabled={pending}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Permanently delete unused file “${m.name}”?`,
                            )
                          )
                            run(() => deleteMedia(m.id));
                        }}
                      >
                        Delete unused file
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {tab === "messages" && (
              <div className="admin-panel">
                {localMessages.length ? (
                  localMessages.map((m) => (
                    <article className="block-editor" key={m.id}>
                      <span className="eyebrow">
                        {m.is_read ? "READ" : "UNREAD"}
                        {m.archived ? " / ARCHIVED" : ""} ·{" "}
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                      <h3>{m.subject || "New enquiry"}</h3>
                      <p>
                        {m.name} · <a href={`mailto:${m.email}`}>{m.email}</a>
                      </p>
                      <p style={{ whiteSpace: "pre-wrap", marginTop: 15 }}>
                        {m.message}
                      </p>
                      <p className="admin-note">
                        Email notification: {m.notification}
                      </p>
                      <div className="admin-toolbar">
                        {[
                          m.is_read ? "unread" : "read",
                          m.archived ? "restore" : "archive",
                          "delete",
                        ].map((a) => (
                          <button
                            key={a}
                            className="admin-button"
                            disabled={pending}
                            onClick={() => {
                              if (
                                a === "delete" &&
                                !window.confirm(
                                  "Permanently delete this enquiry?",
                                )
                              )
                                return;
                              run(async () => {
                                const r = await updateMessage(m.id, a);
                                if (r.ok)
                                  setMessages((old) =>
                                    a === "delete"
                                      ? old.filter((x) => x.id !== m.id)
                                      : old.map((x) =>
                                          x.id === m.id
                                            ? {
                                                ...x,
                                                is_read:
                                                  a === "read"
                                                    ? true
                                                    : a === "unread"
                                                      ? false
                                                      : x.is_read,
                                                archived:
                                                  a === "archive"
                                                    ? true
                                                    : a === "restore"
                                                      ? false
                                                      : x.archived,
                                              }
                                            : x,
                                        ),
                                  );
                                return r;
                              });
                            }}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="empty-state">
                    Your inbox is clear. Persisted contact messages will appear
                    here.
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {status && (
          <div className="admin-status" role="status">
            {status}
          </div>
        )}
      </main>
    </div>
  );
}
