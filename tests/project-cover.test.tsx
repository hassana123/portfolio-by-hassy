import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectCover, { projectCoverLinks } from "../components/project-cover";
import { blankContent } from "../lib/model";

test("View Project and View Github labels produce both independent cover links", () => {
  const links = [
    { label: "View Project", url: "https://example.com/" },
    { label: "View Github", url: "https://github.com/example/project" },
  ];
  const result = projectCoverLinks(links);
  assert.equal(result.live?.url, links[0].url);
  assert.equal(result.github?.url, links[1].url);
  const html = renderToStaticMarkup(
    <ProjectCover
      content={{ ...blankContent(), title: "Project", links }}
      href="/projects/project"
    />,
  );
  assert.equal((html.match(/target="_blank"/g) || []).length, 2);
  assert.ok(html.includes('href="/projects/project"'));
  let depth = 0;
  for (const tag of html.match(/<a\s[^>]*>|<\/a>/g) || []) {
    depth += tag.startsWith("</") ? -1 : 1;
    assert.ok(
      depth >= 0 && depth <= 1,
      "Cover actions must not be nested links",
    );
  }
  assert.equal(depth, 0);
});

test("Named live destination takes priority over other links and unsafe URLs are excluded", () => {
  const live = { label: "Live site", url: "https://example.com/app" };
  const result = projectCoverLinks([
    { label: "Report", url: "https://example.com/report.pdf" },
    live,
    { label: "GitHub", url: "javascript:alert(1)" },
  ]);
  assert.equal(result.live, live);
  assert.equal(result.github, undefined);
  assert.deepEqual(projectCoverLinks([]), {
    live: undefined,
    github: undefined,
  });
});
