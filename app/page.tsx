import { portfolio } from "@/lib/data";
import { Home } from "@/components/home";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const { settings: s, mode } = await portfolio();
  const p = s.profiles[mode];
  return {
    title: `${s.name} — ${p.title}`,
    description: p.seoDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: `${s.name} — ${p.title}`,
      description: p.seoDescription,
    },
  };
}
export default async function Page() {
  return <Home data={await portfolio()} />;
}
