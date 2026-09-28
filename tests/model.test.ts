import { test } from "node:test";
import assert from "node:assert/strict";
import { demoSettings } from "../lib/demo";
import {
  modeOf,
  visible,
  eligible,
  blankContent,
  contentSchema,
  settingsSchema,
  contrast,
  sectionVisible,
} from "../lib/model";
test("role modes and general/both visibility resolve consistently", () => {
  assert.equal(modeOf({ engineering: true, data: true }), "combined");
  assert.equal(modeOf({ engineering: true, data: false }), "engineering");
  assert.equal(modeOf({ engineering: false, data: true }), "data");
  assert.throws(() => modeOf({ engineering: false, data: false }));
  assert.equal(visible("data", "engineering"), false);
  assert.equal(visible("engineering", "data"), false);
  for (const m of ["combined", "engineering", "data"] as const) {
    assert.ok(visible("both", m));
    assert.ok(visible("general", m));
  }
});
test("CV mode eligibility is explicit", () => {
  const c = {
    ...blankContent(),
    scope: "both" as const,
    eligibleModes: ["combined" as const],
  };
  assert.equal(eligible(c, "combined", "cv"), true);
  assert.equal(eligible(c, "engineering", "cv"), false);
  assert.equal(eligible(c, "data", "cv"), false);
});
test("Project section templates cannot expose an inactive role even with general scope", () => {
  const section = {
    ...demoSettings.sections.find(
      (s) => s.template === "engineering-projects",
    )!,
    scope: "general" as const,
  };
  assert.equal(sectionVisible(section, "data"), false);
  assert.equal(sectionVisible(section, "engineering"), true);
});
test("validation rejects no-role settings, unsafe links, arbitrary embeds and untrusted assets", () => {
  assert.equal(contentSchema.safeParse({...blankContent(),embedUrl:'not a URL'}).success,false);
  assert.equal(
    settingsSchema.safeParse({
      ...demoSettings,
      engineering: false,
      data: false,
    }).success,
    false,
  );
  for (const url of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:pass@example.com",
  ])
    assert.equal(
      contentSchema.safeParse({ ...blankContent(), externalUrl: url }).success,
      false,
    );
  assert.equal(
    contentSchema.safeParse({
      ...blankContent(),
      embedUrl: "https://evil.example/dashboard",
    }).success,
    false,
  );
  assert.equal(
    contentSchema.safeParse({
      ...blankContent(),
      cover: "https://tracking.example/image.png",
    }).success,
    false,
  );
  assert.ok(
    contentSchema.safeParse({
      ...blankContent(),
      embedUrl: "https://app.powerbi.com/view?r=example",
    }).success,
  );
});
test("Midnight Lilac primary text pairs meet AA contrast", () => {
  assert.ok(contrast("#17152C", "#FAF8F4") >= 4.5);
  assert.ok(contrast("#17152C", "#B9A7F7") >= 4.5);
  assert.ok(contrast("#F7F5FF", "#17152C") >= 4.5);
});
