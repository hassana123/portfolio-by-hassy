import { test } from "node:test";
import assert from "node:assert/strict";
import { byteRange, uploadMimeForFile, validSignature } from "../lib/uploads";
test("File signatures reject renamed executable/HTML content", () => {
  assert.equal(
    validSignature(
      new TextEncoder().encode("<html>fake image</html>"),
      "image/png",
    ),
    false,
  );
  assert.equal(
    validSignature(new TextEncoder().encode("%PDF-1.7"), "application/pdf"),
    true,
  );
  assert.equal(
    validSignature(Uint8Array.from([255, 216, 255]), "image/jpeg"),
    true,
  );
  assert.equal(
    validSignature(new TextEncoder().encode("<svg/>"), "image/svg+xml"),
    false,
  );
});
test("Media byte ranges support seeking and reject invalid requests", () => {
  assert.deepEqual(byteRange("bytes=10-20", 100), { start: 10, end: 20 });
  assert.deepEqual(byteRange("bytes=80-", 100), { start: 80, end: 99 });
  assert.deepEqual(byteRange("bytes=-10", 100), { start: 90, end: 99 });
  assert.equal(byteRange("bytes=100-", 100), null);
  assert.equal(byteRange("bytes=30-10", 100), null);
  assert.equal(byteRange("bytes=0-2,4-6", 100), null);
  assert.equal(byteRange(null, 100), undefined);
});
test("Power BI and spreadsheet extensions normalize browser MIME types", () => {
  assert.equal(uploadMimeForFile("report.pbix", ""), "application/octet-stream");
  assert.equal(
    uploadMimeForFile("template.pbit", "application/x-msdownload"),
    "application/octet-stream",
  );
  assert.equal(
    uploadMimeForFile("sales.xlsx", ""),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
});
