export const uploadExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
};
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
  return false;
}
