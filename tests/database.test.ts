import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { demoSettings } from "../lib/demo";
import { blankContent } from "../lib/model";
test("Postgres publication, role visibility, private drafts, RLS, media and seed removal", async () => {
  const pg = new PGlite();
  try {
    await pg.exec(
      `create role anon;create role authenticated;create role service_role;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('test.actor',true),'')::uuid$$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid,bucket_id text);alter table storage.objects enable row level security;`,
    );
    await pg.exec(
      await readFile("supabase/migrations/001_portfolio.sql", "utf8"),
    );
    await pg.exec(
      `grant usage on schema public,auth to anon,authenticated;grant select,insert,update,delete on all tables in schema public to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;insert into auth.users values('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');insert into owners values('10000000-0000-4000-8000-000000000001');set role authenticated;set test.actor='10000000-0000-4000-8000-000000000001';`,
    );
    const call = async (name: string, args: unknown[] = []) => {
      const r = await pg.query<{ value: any }>(
        `select public.${name}(${args.map((_, i) => "$" + (i + 1)).join(",")}) as value`,
        args,
      );
      return r.rows[0].value;
    };
    await call("save_site", [JSON.stringify(demoSettings), true]);
    const mediaId = "20000000-0000-4000-8000-000000000001";
    await pg.query(
      "insert into media(id,path,name,mime,bytes) values($1,$2,$3,$4,$5)",
      [mediaId, "private.png", "private.png", "image/png", 100],
    );
    const engineering = {
      ...blankContent(),
      title: "Original live",
      slug: "engineering-work",
      scope: "engineering",
      cover: `/api/media/${mediaId}`,
    };
    const analysis = {
      ...blankContent(),
      title: "Analysis",
      slug: "analysis-work",
      scope: "data",
    };
    const id = await call("save_content", [
      null,
      "project",
      JSON.stringify(engineering),
      "publish",
      false,
      "",
    ]);
    const dataId = await call("save_content", [
      null,
      "project",
      JSON.stringify(analysis),
      "publish",
      true,
      "sample",
    ]);
    await call("save_content", [
      id,
      "project",
      JSON.stringify({ ...engineering, title: "Private draft" }),
      "draft",
      false,
      "",
    ]);
    let snap = await call("public_snapshot");
    assert.equal(
      snap.records.find((x: any) => x.id === id).published.title,
      "Original live",
    );
    assert.equal(
      (await call("owner_snapshot")).records.find((x: any) => x.id === id).draft
        .title,
      "Private draft",
    );
    await call("save_site", [
      JSON.stringify({ ...demoSettings, engineering: false }),
      false,
    ]);
    assert.equal((await call("public_snapshot")).records.length, 2);
    await call("save_site", [
      JSON.stringify({ ...demoSettings, engineering: false }),
      true,
    ]);
    snap = await call("public_snapshot");
    assert.equal(snap.records.length, 1);
    assert.equal(snap.records[0].id, dataId);
    assert.deepEqual(Object.keys(snap.settings.profiles), ["data"]);
    assert.equal(
      (await pg.query("select * from public_media($1)", [mediaId])).rows.length,
      0,
    );
    await call("save_site", [
      JSON.stringify({ ...demoSettings, data: false }),
      true,
    ]);
    snap = await call("public_snapshot");
    assert.equal(snap.records.length, 1);
    assert.equal(snap.records[0].id, id);
    assert.equal(
      (await pg.query("select * from public_media($1)", [mediaId])).rows.length,
      1,
    );
    await assert.rejects(() =>
      call("save_site", [
        JSON.stringify({ ...demoSettings, engineering: false, data: false }),
        true,
      ]),
    );
    await call("save_site", [JSON.stringify(demoSettings), true]);
    assert.equal((await call("public_snapshot")).records.length, 2);
    await assert.rejects(() =>
      call("save_content", [
        null,
        "project",
        JSON.stringify(engineering),
        "publish",
        false,
        "",
      ]),
    );
    await pg.exec(`set test.actor='10000000-0000-4000-8000-000000000002';`);
    assert.equal(await call("is_owner"), false);
    await assert.rejects(() => call("owner_snapshot"));
    await assert.rejects(() =>
      call("save_site", [JSON.stringify(demoSettings), true]),
    );
    assert.equal(
      (await pg.query("select * from content_revisions")).rows.length,
      0,
    );
    assert.equal((await pg.query("select * from enquiries")).rows.length, 0);
    assert.equal((await pg.query("select * from media")).rows.length, 0);
    await assert.rejects(() =>
      pg.query("insert into owners values($1)", [
        "10000000-0000-4000-8000-000000000002",
      ]),
    );
    await pg.exec(`reset role;set role anon;set test.actor='';`);
    assert.equal(
      (await pg.query("select * from content_entries")).rows.length,
      0,
    );
    assert.equal((await call("public_snapshot")).records.length, 2);
    await assert.rejects(() => call("owner_snapshot"));
    await assert.rejects(() =>
      call("save_site", [JSON.stringify(demoSettings), true]),
    );
    await assert.rejects(() => call("contact_limit", ["test"]));
    await pg.exec(
      `reset role;set role authenticated;set test.actor='10000000-0000-4000-8000-000000000001';`,
    );
    assert.equal(await call("clear_starter", [1]), 1);
    snap = await call("public_snapshot");
    assert.equal(snap.records.length, 1);
    assert.equal(snap.records[0].id, id);
    assert.equal((await call("owner_snapshot")).records.length, 1);
    assert.equal((await call("public_snapshot")).records.length, 1);
    await call("save_content", [
      id,
      "project",
      JSON.stringify(engineering),
      "unpublish",
      false,
      "",
    ]);
    assert.equal((await call("public_snapshot")).records.length, 0);
    assert.equal(
      (await pg.query("select * from public_media($1)", [mediaId])).rows.length,
      0,
    );
    await pg.exec("reset role;set role service_role;");
    for (let i = 0; i < 5; i++)
      assert.equal(await call("contact_limit", ["hashed-client"]), true);
    assert.equal(await call("contact_limit", ["hashed-client"]), false);
  } finally {
    await pg.close();
  }
});
