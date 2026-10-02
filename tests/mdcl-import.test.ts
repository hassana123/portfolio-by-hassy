import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { blankContent, contentSchema, type Content } from "../lib/model";
import { demoSettings } from "../lib/demo";

test("MDCL SQL import creates a valid private draft and reruns preserve edits, publications and other content", async () => {
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
    const original = {
      ...blankContent(),
      title: "MentoRaft",
      slug: "mentoraft",
      scope: "engineering",
    };
    const entry = (
      await pg.query<{ id: string }>(
        "insert into content_entries(kind) values ('project') returning id",
      )
    ).rows[0].id;
    const revision = (
      await pg.query<{ id: string }>(
        "insert into content_revisions(entry_id,payload) values($1,$2) returning id",
        [entry, JSON.stringify(original)],
      )
    ).rows[0].id;
    await pg.query(
      "update content_entries set draft_id=$1,published_id=$1 where id=$2",
      [revision, entry],
    );
    const site = (
      await pg.query<{ id: string }>(
        "insert into site_revisions(payload) values($1) returning id",
        [JSON.stringify(demoSettings)],
      )
    ).rows[0].id;
    await pg.query(
      "update site_state set draft_id=$1,published_id=$1 where id=1",
      [site],
    );

    const sql = await readFile("supabase/scripts/add_mdcl_project.sql", "utf8");
    const existingBefore = (
      await pg.query("select * from content_entries where id=$1", [entry])
    ).rows;
    const siteBefore = (await pg.query("select * from site_state")).rows;
    await pg.exec(sql);
    const getMdcl = async () =>
      (
        await pg.query<{
          id: string;
          published_id: string | null;
          is_seed: boolean;
          payload: Content;
        }>(
          "select e.id,e.published_id,e.is_seed,r.payload from content_entries e join content_revisions r on r.id=e.draft_id where e.id<>$1",
          [entry],
        )
      ).rows;
    const [mdcl] = await getMdcl();
    const payload = contentSchema.parse(mdcl.payload);
    assert.equal(mdcl.published_id, null);
    assert.equal(mdcl.is_seed, false);
    assert.equal(payload.slug, "mdcl-website-redesign");
    assert.equal(payload.scope, "engineering");
    assert.equal(payload.featured, true);
    assert.equal(payload.order, 1);
    assert.equal(payload.date, "2025");
    assert.equal(payload.blocks.length, 5);
    assert.equal(payload.cover, "");
    assert.equal(payload.links.length, 2);
    assert.equal(payload.tools.length, 5);
    assert.ok(payload.body.includes("\n\n"));
    const published = (
      await pg.query<{ snapshot: { records: { id: string }[] } }>(
        "select public_snapshot() as snapshot",
      )
    ).rows[0].snapshot;
    assert.deepEqual(
      published.records.map((r) => r.id),
      [entry],
    );

    // Running it twice must not duplicate the project or add revisions.
    const countBefore = (
      await pg.query("select count(*) from content_revisions")
    ).rows;
    await pg.exec(sql);
    assert.equal((await getMdcl()).length, 1);
    assert.deepEqual(
      (await pg.query("select count(*) from content_revisions")).rows,
      countBefore,
    );

    // Preserve an owner's later changes, including images, publication and archive state.
    await pg.query(
      "update content_revisions set payload=jsonb_set(payload,'{cover}','\"/demo/about.jpg\"') where entry_id=$1",
      [mdcl.id],
    );
    await pg.query(
      "update content_entries set published_id=draft_id,archived=true where id=$1",
      [mdcl.id],
    );
    const mdclBefore = (
      await pg.query("select * from content_entries where id=$1", [mdcl.id])
    ).rows;
    await pg.exec(sql);
    assert.equal((await getMdcl())[0].payload.cover, "/demo/about.jpg");
    assert.deepEqual(
      (await pg.query("select * from content_entries where id=$1", [mdcl.id]))
        .rows,
      mdclBefore,
    );
    assert.deepEqual(
      (await pg.query("select * from content_entries where id=$1", [entry]))
        .rows,
      existingBefore,
    );
    assert.deepEqual(
      (await pg.query("select * from site_state")).rows,
      siteBefore,
    );
  } finally {
    await pg.close();
  }
});
