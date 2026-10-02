import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { contentSchema } from "../lib/model";

async function database() {
  const pg = new PGlite();
  await pg.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid,bucket_id text);
    alter table storage.objects enable row level security;
  `);
  await pg.exec(await readFile("supabase/migrations/001_portfolio.sql", "utf8"));
  return pg;
}

test("collaboration SQL creates draft projects and an external article without publishing", async () => {
  const pg = await database();
  try {
    const sql = await readFile(
      "supabase/scripts/add_collaboration_projects.sql",
      "utf8",
    );
    await pg.exec(sql);
    const rows = (
      await pg.query<{ kind: string; slug: string; published_id: string | null; payload: unknown }>(
        `select e.kind, d.payload->>'slug' as slug, e.published_id, d.payload
         from content_entries e join content_revisions d on d.id=e.draft_id
         where d.payload->>'slug' in ('women-techmakers-website-sprint','g3women-digital-academy','saqo-frontend','international-womens-day-website-sprint-hersite')
         order by d.payload->>'slug'`,
      )
    ).rows;
    assert.equal(rows.length, 4);
    assert.ok(rows.every((row) => row.published_id === null));
    const wtm = contentSchema.parse(
      rows.find((row) => row.slug === "women-techmakers-website-sprint")!.payload,
    );
    assert.equal(wtm.scope, "general");
    assert.equal(wtm.category, "Community · Women Techmakers");
    assert.equal(wtm.blocks.length, 3);
    assert.equal(wtm.tools[0], "Lovable");
    assert.equal(
      wtm.links[0].url,
      "https://techsulatana.hashnode.dev/the-international-women-s-day-website-sprint-building-hersite-in-a-day",
    );
    const saqo = contentSchema.parse(
      rows.find((row) => row.slug === "saqo-frontend")!.payload,
    );
    assert.equal(saqo.links.length, 2);
    const article = contentSchema.parse(
      rows.find((row) => row.slug === "international-womens-day-website-sprint-hersite")!.payload,
    );
    assert.equal(article.externalUrl?.includes("hashnode.dev"), true);

    const revisionsBefore = (
      await pg.query<{ count: number }>("select count(*) from content_revisions")
    ).rows[0].count;
    await pg.exec(sql);
    assert.equal(
      (
        await pg.query<{ count: number }>("select count(*) from content_revisions")
      ).rows[0].count,
      revisionsBefore,
    );
  } finally {
    await pg.close();
  }
});

test("Dechi story update changes only the draft narrative and keeps media and links", async () => {
  const pg = await database();
  try {
    const entry = (
      await pg.query<{ id: string }>(
        "insert into content_entries(kind) values ('project') returning id",
      )
    ).rows[0].id;
    const payload = {
      title: "Dechi HTF - Client Website & Admin Dashboard",
      slug: "dechi-htf",
      summary: "Old summary",
      scope: "engineering",
      featured: true,
      order: 2,
      cover: "https://example.com/dechi.png",
      alt: "Dechi HTF website",
      category: "Client Project · Dechi HTF",
      body: "Old body",
      blocks: [{ heading: "Old", body: "Old", image: "", alt: "" }],
      tools: [],
      links: [{ label: "Visit website", url: "https://dechi-htf.vercel.app/" }],
      externalUrl: "",
      platform: "",
      embedUrl: "",
      embedTitle: "",
      date: "",
      seoTitle: "",
      seoDescription: "",
      eligibleModes: [],
      file: "",
      video: "",
      videoTitle: "",
    };
    const revision = (
      await pg.query<{ id: string }>(
        "insert into content_revisions(entry_id,payload) values($1,$2) returning id",
        [entry, JSON.stringify(payload)],
      )
    ).rows[0].id;
    await pg.query("update content_entries set draft_id=$1 where id=$2", [revision, entry]);
    const sql = await readFile(
      "supabase/scripts/update_dechi_htf_story.sql",
      "utf8",
    );
    await pg.exec(sql);
    const row = (
      await pg.query<{ payload: any }>(
        "select d.payload from content_entries e join content_revisions d on d.id=e.draft_id where e.id=$1",
        [entry],
      )
    ).rows[0].payload;
    assert.equal(row.date, "2024");
    assert.match(row.body, /In 2024/);
    assert.equal(row.cover, payload.cover);
    assert.deepEqual(row.links, payload.links);
    assert.equal(row.blocks.length, 4);
  } finally {
    await pg.close();
  }
});
