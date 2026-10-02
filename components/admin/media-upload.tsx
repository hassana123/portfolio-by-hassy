"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { beginUpload, finishUpload } from "@/app/admin/actions";
import {
  maxUploadBytes,
  uploadExtensions,
  uploadMimeForFile,
} from "@/lib/uploads";
export default function MediaUpload({ demo }: { demo: boolean }) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fields = new FormData(form),
          file = fields.get("file");
        const mime = file instanceof File
          ? uploadMimeForFile(file.name, file.type)
          : "";
        if (
          !(file instanceof File) ||
          !file.size ||
          file.size > maxUploadBytes ||
          !uploadExtensions[mime]
        ) {
          setStatus("Choose a supported file up to 25 MB.");
          return;
        }
        setBusy(true);
        setStatus("Preparing private upload…");
        try {
          const prepared = await beginUpload(mime, file.size);
          if (!prepared.ok || !prepared.path || !prepared.token || !prepared.id)
            throw Error(prepared.message);
          const client = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          );
          setStatus("Uploading directly to private storage…");
          const { error } = await client.storage
            .from("portfolio")
            .uploadToSignedUrl(prepared.path, prepared.token, file, {
              contentType: mime,
            });
          if (error) throw Error(error.message);
          setStatus("Verifying file contents…");
          const complete = await finishUpload(
            prepared.id,
            prepared.path,
            file.name,
            mime,
            String(fields.get("alt") || ""),
          );
          if (!complete.ok) throw Error(complete.message);
          setStatus(complete.message);
          form.reset();
          router.refresh();
        } catch (error) {
          setStatus(
            error instanceof Error
              ? error.message
              : "Upload failed. Please try again.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="admin-field">
        File
        <input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,text/csv,.xlsx,.xls,.pbix,.pbit"
          required
          disabled={demo || busy}
        />
      </label>
      <label className="admin-field">
        Alt text
        <input name="alt" maxLength={300} />
      </label>
      <button className="admin-button primary" disabled={demo || busy}>
        {busy ? "Uploading…" : "Upload privately"}
      </button>
      <p className="admin-note" role="status">
        {status}
      </p>
    </form>
  );
}
