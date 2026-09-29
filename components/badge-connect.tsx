"use client";
import { useMemo, useRef } from "react";
import QRCode from "qrcode";
import type { Settings } from "@/lib/model";

export function badgeLinks(socials: Settings["socials"]) {
  const links: { platform: "LinkedIn" | "GitHub"; url: string }[] = [];
  for (const social of socials) {
    try {
      const u = new URL(social.url);
      if (u.protocol !== "https:" || u.username || u.password) continue;
      const host = u.hostname.replace(/^www\./, "");
      const platform =
        host === "linkedin.com"
          ? "LinkedIn"
          : host === "github.com"
            ? "GitHub"
            : null;
      if (platform && !links.some((x) => x.platform === platform))
        links.push({ platform, url: social.url });
    } catch {
      /* Missing URLs do not render links. */
    }
  }
  return links.sort((a, b) =>
    a.platform === b.platform ? 0 : a.platform === "LinkedIn" ? -1 : 1,
  );
}

export function BadgeSocials({ socials }: { socials: Settings["socials"] }) {
  const links = badgeLinks(socials);
  if (!links.length) return null;
  return (
    <div
      className="badge-social-links"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {links.map(({ platform, url }) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          aria-label={`${platform} profile (new tab)`}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
          >
            {platform === "LinkedIn" ? (
              <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96C2 21.32 2.69 22 3.55 22h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2zM7.93 18.75H4.98V9.2h2.95v9.55zM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26z" />
            ) : (
              <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.82.58A12 12 0 0 0 12 .3z" />
            )}
          </svg>
        </a>
      ))}
    </div>
  );
}

export function BadgeQr({ url }: { url: string }) {
  const code = useMemo(() => {
    try {
      return QRCode.create(url, { errorCorrectionLevel: "M" });
    } catch {
      return null;
    }
  }, [url]);
  if (!code) return <span>Use the LinkedIn link below.</span>;
  const size = code.modules.size;
  let path = "";
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (code.modules.get(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
  return (
    <svg
      width="256"
      height="256"
      viewBox={`0 0 ${size + 8} ${size + 8}`}
      role="img"
      aria-label="LinkedIn QR code"
      shapeRendering="crispEdges"
    >
      <rect width={size + 8} height={size + 8} fill="#FAF8F4" />
      <path d={path} fill="#17152C" />
    </svg>
  );
}

export function BadgeConnect({ url, hold }: { url: string; hold: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div
      className="badge-connect"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => {
          hold();
          dialog.current?.showModal();
        }}
      >
        Connect ↗
      </button>
      <dialog
        ref={dialog}
        className="badge-connect-dialog"
        aria-label="Connect on LinkedIn"
      >
        <button type="button" autoFocus onClick={() => dialog.current?.close()}>
          Close
        </button>
        <p>Scan to connect</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open LinkedIn profile (new tab)"
        >
          <BadgeQr url={url} />
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open LinkedIn ↗
        </a>
      </dialog>
    </div>
  );
}
