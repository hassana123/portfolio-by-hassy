import { owner } from "@/lib/supabase";
import { portfolio } from "@/lib/data";
import { Home } from "@/components/home";
import { modes, type Mode } from "@/lib/model";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private preview",
  robots: { index: false, follow: false },
};
export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  await owner();
  const { mode } = await searchParams;
  const data = await portfolio(
    true,
    modes.includes(mode as Mode) ? (mode as Mode) : undefined,
  );
  return (
    <>
      <div className="preview-banner">
        Private draft preview · {data.mode} · Not published{" "}
        <a href="/admin">Return to studio</a>
      </div>
      <Home data={data} />
    </>
  );
}
