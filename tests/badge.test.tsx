import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import jsQR from "jsqr";
import { BadgeQr, badgeLinks, BadgeSocials } from "../components/badge-connect";
import { Hero } from "../components/interactive";
import { demoSettings } from "../lib/demo";

const url = "https://www.linkedin.com/in/hassana-abdullahi-858040240/";
test("Inline QR decodes to the active CV URL at card sizes", async () => {
  const cvUrl = "https://example.com/hassana-engineering-cv.pdf";
  const svg = renderToStaticMarkup(<BadgeQr url={cvUrl} />);
  for (const width of [82, 92, 100, 164, 200]) {
    const { data, info } = await sharp(Buffer.from(svg))
      .resize(width, width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.equal(
      jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data,
      cvUrl,
    );
  }
});
test("Configured LinkedIn, GitHub and X links appear without deceptive domains", () => {
  assert.deepEqual(badgeLinks([]), []);
  assert.deepEqual(badgeLinks([{ label: "X", url: "https://x.com/test" }]), [
    { platform: "X", url: "https://x.com/test" },
  ]);
  assert.deepEqual(
    badgeLinks([
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
    assert.match(
      renderToStaticMarkup(
        <Hero
          settings={demoSettings}
          mode={mode}
          cvUrl="/api/media/00000000-0000-4000-8000-000000000000"
        />,
      ),
      /Scan to download CV/,
    );
    assert.match(html, /GitHub profile \(new tab\)/);
    assert.ok(!html.includes("<dialog"));
    assert.ok(!html.includes("Connect ↗"));
  }
});
