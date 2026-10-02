import { Link as LinkIcon } from "lucide-react";
import type { Content } from "@/lib/model";

export function projectCoverLinks(links: Content["links"]) {
  const valid = links.filter(({ url }) => {
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" && !parsed.username && !parsed.password
      );
    } catch {
      return false;
    }
  });
  const isGithub = (url: string) =>
    new URL(url).hostname.replace(/^www\./, "") === "github.com";
  const github = valid.find((link) => isGithub(link.url));
  const external = valid.filter((link) => !isGithub(link.url));
  const live =
    external.find((link) =>
      /\b(live|demo|website|site|dashboard|preview|app)\b/i.test(link.label),
    ) ?? external[0];
  return { live, github };
}

export function ProjectCoverLinks({ content }: { content: Content }) {
  const { live, github } = projectCoverLinks(content.links);
  if (!live && !github) return null;
  return (
    <div className="project-cover-actions">
      {live && (
        <a
          href={live.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-cover-action"
          aria-label={`Open ${content.title}: ${live.label} (new tab)`}
          title={live.label}
        >
          <LinkIcon size={18} aria-hidden="true" />
        </a>
      )}
      {github && (
        <a
          href={github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-cover-action"
          aria-label={`View ${content.title} on GitHub (new tab)`}
          title="View on GitHub"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.625-5.475 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function ProjectCover({
  content,
  href,
}: {
  content: Content;
  href: string;
}) {
  return (
    <div className="project-cover">
      <a
        className="project-cover-link"
        href={href}
        aria-label={`View ${content.title} project`}
      >
        {content.cover ? (
          <img
            src={content.cover}
            alt={content.alt}
            width="1000"
            height="680"
            loading="lazy"
          />
        ) : (
          <span>Project image coming soon</span>
        )}
      </a>
      <ProjectCoverLinks content={content} />
    </div>
  );
}
