import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { blankContent } from "../lib/model";

test("demo content SQL seeds non-project records and is safe to rerun", async () => {
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
    const project = (
      await pg.query<{ id: string }>(
        "insert into content_entries(kind) values ('project') returning id",
      )
    ).rows[0].id;
    const projectRevision = (
      await pg.query<{ id: string }>(
        "insert into content_revisions(entry_id,payload) values($1,$2) returning id",
        [project, JSON.stringify({ ...blankContent(), slug: "mentoraft" })],
      )
    ).rows[0].id;
    await pg.query(
      "update content_entries set draft_id=$1,published_id=$1 where id=$2",
      [projectRevision, project],
    );

    const sql = await readFile(
      "supabase/scripts/seed_demo_content.sql",
      "utf8",
    );
    await pg.exec(sql);
    const seeded = await pg.query<{
      kind: string;
      slug: string;
      is_seed: boolean;
      draft_id: string;
      published_id: string;
    }>(
      `select e.kind, r.payload->>'slug' as slug, e.is_seed, e.draft_id, e.published_id
       from content_entries e join content_revisions r on r.id=e.published_id
       where e.is_seed order by e.kind, slug`,
    );
    assert.equal(seeded.rows.length, 16);
    assert.equal(seeded.rows.filter((x) => x.kind === "service").length, 3);
    assert.equal(seeded.rows.filter((x) => x.kind === "skill").length, 8);
    assert.equal(seeded.rows.filter((x) => x.kind === "article").length, 1);
    assert.equal(seeded.rows.filter((x) => x.kind === "experience").length, 1);
    assert.equal(seeded.rows.filter((x) => x.kind === "community").length, 1);
    assert.equal(
      seeded.rows.filter((x) => x.kind === "certification").length,
      1,
    );
    assert.equal(
      seeded.rows.filter((x) => x.kind === "testimonial").length,
      1,
    );
    assert.ok(seeded.rows.every((x) => x.is_seed && x.draft_id === x.published_id));
    assert.equal(
      (
        await pg.query<{ count: number }>(
          "select count(*) from content_entries where kind='project'",
        )
      ).rows[0].count,
      1,
    );

    const revisionCount = (
      await pg.query<{ count: number }>("select count(*) from content_revisions")
    ).rows[0].count;
    await pg.exec(sql);
    assert.equal(
      (await pg.query<{ count: number }>("select count(*) from content_revisions"))
        .rows[0].count,
      revisionCount,
    );
  } finally {
    await pg.close();
  }
});
