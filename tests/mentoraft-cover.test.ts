import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { contentSchema } from "../lib/model";

test("MentoRaft cover update preserves the draft case study and changes only cover metadata", async () => {
  const pg = new PGlite();
  try {
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
    const entry = (
      await pg.query<{ id: string }>(
        "insert into content_entries(kind) values ('project') returning id",
      )
    ).rows[0].id;
    const payload = {
      title: "MentoRaft",
      slug: "mentoraft",
      summary: "Learning platform",
      scope: "engineering",
      featured: true,
      order: 0,
      cover: "/demo/old.png",
      alt: "Old cover",
      category: "EdTech",
      body: "Existing story",
      blocks: [{ heading: "Overview", body: "Existing block", image: "", alt: "" }],
      tools: ["Next.js"],
      links: [{ label: "Visit project", url: "https://mentoraft.vercel.app/" }],
      externalUrl: "",
      platform: "",
      embedUrl: "",
      embedTitle: "",
      date: "2024",
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
    await pg.query(
      "update content_entries set draft_id=$1,published_id=$1 where id=$2",
      [revision, entry],
    );
    await pg.exec(
      await readFile("supabase/scripts/update_mentoraft_cover.sql", "utf8"),
    );
    const row = (
      await pg.query<{ payload: unknown }>(
        "select d.payload from content_entries e join content_revisions d on d.id=e.draft_id where e.id=$1",
        [entry],
      )
    ).rows[0];
    const updated = contentSchema.parse(row.payload);
    assert.equal(updated.cover, "/demo/mentoraft-cover-light.png");
    assert.equal(updated.alt, "MentoRaft learning platform homepage showing course paths, tutor controls and learner progress features");
    assert.equal(updated.body, payload.body);
    assert.deepEqual(updated.blocks, payload.blocks);
    assert.deepEqual(updated.links, payload.links);
    const published = (
      await pg.query<{ payload: any }>(
        "select p.payload from content_entries e join content_revisions p on p.id=e.published_id where e.id=$1",
        [entry],
      )
    ).rows[0].payload;
    assert.equal(published.cover, "/demo/old.png");
  } finally {
    await pg.close();
  }
});
