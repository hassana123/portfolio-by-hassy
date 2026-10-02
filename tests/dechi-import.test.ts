import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { contentSchema } from "../lib/model";

test("Dechi HTF SQL import creates an engineering draft without publishing it", async () => {
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
    await pg.exec(
      await readFile("supabase/migrations/001_portfolio.sql", "utf8"),
    );
    const sql = await readFile(
      "supabase/scripts/add_dechi_htf_project.sql",
      "utf8",
    );
    await pg.exec(sql);
    const result = await pg.query<{
      published_id: string | null;
      payload: unknown;
    }>(
      `select e.published_id, d.payload
       from content_entries e join content_revisions d on d.id=e.draft_id
       where e.kind='project' and d.payload->>'slug'='dechi-htf'`,
    );
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].published_id, null);
    const content = contentSchema.parse(result.rows[0].payload);
    assert.equal(content.scope, "engineering");
    assert.equal(content.blocks.length, 4);
    assert.equal(content.date, "2024");
    assert.match(content.body, /In 2024/);
    assert.equal(content.links[0].url, "https://dechi-htf.vercel.app/");
    assert.equal(content.links[1].url, "https://github.com/hassana123/dechiHTF");
    const revisions = (
      await pg.query<{ count: number }>("select count(*) from content_revisions")
    ).rows[0].count;
    await pg.exec(sql);
    assert.equal(
      (
        await pg.query<{ count: number }>("select count(*) from content_revisions")
      ).rows[0].count,
      revisions,
    );
  } finally {
    await pg.close();
  }
});
