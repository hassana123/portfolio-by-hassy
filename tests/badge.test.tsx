import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import jsQR from "jsqr";
import { BadgeQr, badgeLinks, BadgeSocials } from "../components/badge-connect";
import { Hero } from "../components/interactive";
import { demoSettings } from "../lib/demo";

const url = "https://www.linkedin.com/in/test-profile/"; // Test fixture, never public content.
test("QR rendered in the compact dialog decodes to the exact configured LinkedIn URL", async () => {
  const svg = renderToStaticMarkup(<BadgeQr url={url} />);
  for (const width of [220, 256, 304]) {
    const { data, info } = await sharp(Buffer.from(svg))
      .resize(width, width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.equal(
      jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data,
      url,
    );
  }
});
test("Only configured LinkedIn and GitHub links appear, without X or deceptive domains", () => {
  assert.deepEqual(badgeLinks([]), []);
  assert.deepEqual(
    badgeLinks([
      { label: "X", url: "https://x.com/test" },
      { label: "LinkedIn", url: "https://linkedin.com.evil.example" },
    ]),
    [],
  );
  const html = renderToStaticMarkup(
    <BadgeSocials socials={[{ label: "LinkedIn", url }]} />,
  );
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /draggable="false"/);
  assert.match(html, /LinkedIn profile \(new tab\)/);
});
test("Restored card keeps separate name lines, original back rows and a single front signature", () => {
  for (const mode of ["combined", "engineering", "data"] as const) {
    const html = renderToStaticMarkup(
      <Hero settings={demoSettings} mode={mode} />,
    );
    assert.match(html, /<span>Hassana<\/span><span>Abdullahi<\/span>/);
    assert.equal((html.match(/class="signature"/g) || []).length, 1);
    assert.equal(
      (html.match(/class="back-row"/g) || []).length,
      demoSettings.profiles[mode].back.length,
    );
    assert.ok(!html.includes('class="barcode"'));
    assert.ok(!html.includes('class="back-note"'));
    assert.ok(!html.includes('class="badge-bottom"'));
    assert.match(html, /badge-back" aria-hidden="true" inert=""/);
    assert.match(html, /aria-label="Show back of identity card"/);
    assert.ok(!html.includes("Connect ↗"));
  }
});
