import { owner, configured } from "@/lib/supabase";
import { demoSettings, demoRecords } from "@/lib/demo";
import Dashboard from "@/components/admin/dashboard";
import { notFound, redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Portfolio studio",
  robots: { index: false, follow: false },
};
export default async function Admin({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const demo = path[0] === "demo";
  const requested = demo ? path[1] : path[0];
  if (
    requested &&
    ![
      "overview",
      "modes",
      "homepage",
      "projects",
      "articles",
      "experience",
      "community",
      "certifications",
      "testimonials",
      "media",
      "cvs",
      "messages",
      "settings",
      "services",
      "skills",
    ].includes(requested)
  )
    notFound();
  if (demo && configured()) redirect("/admin");
  if (!configured()) {
    if (!demo) redirect("/admin/login");
    return (
      <Dashboard
        demo
        initialSettings={demoSettings}
        initialRecords={demoRecords}
        messages={[]}
        media={[]}
        tab={path[1] || "overview"}
      />
    );
  }
  const c = await owner();
  const [
    { data, error },
    { data: messages, error: messageError },
    { data: media, error: mediaError },
  ] = await Promise.all([
    c.rpc("owner_snapshot"),
    c.from("enquiries").select("*").order("created_at", { ascending: false }),
    c.from("media").select("*").order("created_at", { ascending: false }),
  ]);
  if (error || messageError || mediaError)
    throw Error(
      "Could not load the dashboard. Check migrations and owner access.",
    );
  if (path.length > 1) notFound();
  return (
    <Dashboard
      demo={false}
      initialSettings={
        data.settings || {
          ...demoSettings,
          portrait: "",
          aboutImage: "",
          collageImage: "",
        }
      }
      initialRecords={data.records || []}
      messages={messages || []}
      media={media || []}
      tab={path[0] || "overview"}
    />
  );
}
