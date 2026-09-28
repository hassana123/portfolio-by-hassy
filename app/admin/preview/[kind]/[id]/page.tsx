import { owner } from "@/lib/supabase";
import { portfolio } from "@/lib/data";
import { modes, type Mode } from "@/lib/model";
import { ContentDetail } from "@/components/details";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private record preview",
  robots: { index: false, follow: false },
};
export default async function RecordPreview({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string; id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  await owner();
  const { kind, id } = await params;
  const { mode } = await searchParams;
  const data = await portfolio(
    true,
    modes.includes(mode as Mode) ? (mode as Mode) : undefined,
  );
  const record = data.records.find((x) => x.id === id && x.kind === kind);
  if (!record) notFound();
  return (
    <>
      <div className="preview-banner">
        Private draft preview ·{" "}
        <a href={`/admin/preview?mode=${data.mode}`}>
          Back to homepage preview
        </a>
      </div>
      <ContentDetail c={record.content} sample={record.is_seed} kind={kind} />
    </>
  );
}
