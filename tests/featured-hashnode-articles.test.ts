import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { contentSchema } from "../lib/model";

test("featured Hashnode article SQL creates three external drafts without publishing", async () => {
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
    const sql = await readFile("supabase/scripts/add_featured_hashnode_articles.sql", "utf8");
    await pg.exec(sql);

    const result = await pg.query<{ published_id: string | null; payload: unknown }>(
      `select e.published_id, d.payload
       from content_entries e join content_revisions d on d.id=e.draft_id
       where e.kind='article' order by (d.payload->>'order')::int`,
    );
    assert.equal(result.rows.length, 3);
    for (const row of result.rows) {
      assert.equal(row.published_id, null);
      const content = contentSchema.parse(row.payload);
      assert.equal(content.featured, true);
      assert.equal(content.platform, "Hashnode");
      assert.match(content.externalUrl, /^https:\/\/techsulatana\.hashnode\.dev\//);
    }
    assert.equal(contentSchema.parse(result.rows[0].payload).slug, "international-womens-day-website-sprint-hersite");
    assert.equal(contentSchema.parse(result.rows[1].payload).slug, "how-to-implement-africas-talking-sms-api");
    assert.equal(contentSchema.parse(result.rows[2].payload).slug, "browser-to-beyond-front-end-developer-mobile-development");

    const revisions = (await pg.query<{ count: number }>("select count(*) from content_revisions")).rows[0].count;
    await pg.exec(sql);
    assert.equal((await pg.query<{ count: number }>("select count(*) from content_revisions")).rows[0].count, revisions);
  } finally {
    await pg.close();
  }
});
