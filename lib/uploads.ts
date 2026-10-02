export const uploadExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "text/csv": "csv",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/octet-stream": "bin",
};
const extensionMimes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
  mp4: "video/mp4",
  csv: "text/csv",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pbix: "application/octet-stream",
  pbit: "application/octet-stream",
  zip: "application/zip",
};
/** Normalize browser-reported MIME types, which may be empty or vendor-specific on Windows. */
export function uploadMimeForFile(name: string, mime: string) {
  if (uploadExtensions[mime]) return mime;
  const extension = name.toLowerCase().split(".").pop() || "";
  return extensionMimes[extension] || mime;
}
export const maxUploadBytes = 25 * 1024 * 1024;
export function byteRange(
  value: string | null,
  size: number,
): { start: number; end: number } | null | undefined {
  if (!value) return undefined;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1]
    ? Number(match[1])
    : Math.max(0, size - Number(match[2]));
  const end = match[1]
    ? match[2]
      ? Math.min(Number(match[2]), size - 1)
      : size - 1
    : size - 1;
  return Number.isSafeInteger(start) &&
    Number.isSafeInteger(end) &&
    start >= 0 &&
    end >= start &&
    start < size
    ? { start, end }
    : null;
}
export function validSignature(bytes: Uint8Array, mime: string) {
  const text = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end));
  if (mime === "image/jpeg")
    return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === "image/png") return bytes[0] === 137 && text(1, 4) === "PNG";
  if (mime === "image/webp")
    return text(0, 4) === "RIFF" && text(8, 12) === "WEBP";
  if (mime === "application/pdf") return text(0, 5) === "%PDF-";
  if (mime === "video/mp4") return text(4, 8) === "ftyp";
  if (
    mime === "application/zip" ||
    mime === "application/x-zip-compressed" ||
    mime === "application/octet-stream"
  )
    return (
      bytes[0] === 80 &&
      bytes[1] === 75 &&
      ((bytes[2] === 3 && bytes[3] === 4) ||
        (bytes[2] === 5 && bytes[3] === 6) ||
        (bytes[2] === 7 && bytes[3] === 8))
    );
  if (mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    return bytes[0] === 80 && bytes[1] === 75;
  if (mime === "application/vnd.ms-excel")
    return bytes[0] === 208 && bytes[1] === 207 && bytes[2] === 17 && bytes[3] === 224;
  if (mime === "text/csv") {
    try {
      const source = new TextDecoder().decode(bytes.slice(0, 4096));
      return Boolean(source.trim()) && !/<\/?(?:html|script|svg|!doctype)\b/i.test(source);
    } catch {
      return false;
    }
  }
  return false;
}
