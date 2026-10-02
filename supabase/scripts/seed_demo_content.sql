-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Run after 001_portfolio.sql and after your site owner has been created.
-- Seeds labelled demo records EXCEPT projects and CVs. It does not overwrite projects,
-- site settings, media, or records that use the same kind + slug.
-- Records are published immediately so every data-backed homepage section can
-- render useful samples: Services, Tools, Experience, Community, Certifications,
-- Testimonials and Articles.
-- Edit, unpublish, archive, or delete them from the owner dashboard afterwards.

begin;

select pg_advisory_xact_lock(8675309);

do $seed_demo$
declare
  item jsonb;
  project_id uuid;
  revision_id uuid;
  seed_records jsonb := $records$
  [
    {
      "kind": "service",
      "payload": {
        "title": "Interfaces that feel right.",
        "slug": "frontend-service",
        "summary": "Accessible websites and web applications, built with care.",
        "scope": "engineering",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "service",
      "payload": {
        "title": "Data that makes sense.",
        "slug": "data-service",
        "summary": "Cleaning, exploration and dashboards that make the story clearer.",
        "scope": "data",
        "featured": false,
        "order": 1,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "service",
      "payload": {
        "title": "Knowledge worth sharing.",
        "slug": "teaching-service",
        "summary": "Learning in the open, building together, and making room for curiosity.",
        "scope": "general",
        "featured": false,
        "order": 2,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "React",
        "slug": "react",
        "summary": "Sample tool",
        "scope": "engineering",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "TypeScript",
        "slug": "typescript",
        "summary": "Sample tool",
        "scope": "engineering",
        "featured": false,
        "order": 1,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "Next.js",
        "slug": "nextjs",
        "summary": "Sample tool",
        "scope": "engineering",
        "featured": false,
        "order": 2,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "Tailwind CSS",
        "slug": "tailwindcss",
        "summary": "Sample tool",
        "scope": "engineering",
        "featured": false,
        "order": 3,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "SQL",
        "slug": "sql",
        "summary": "Sample tool",
        "scope": "data",
        "featured": false,
        "order": 4,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "Python",
        "slug": "python",
        "summary": "Sample tool",
        "scope": "data",
        "featured": false,
        "order": 5,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "Power BI",
        "slug": "powerbi",
        "summary": "Sample tool",
        "scope": "data",
        "featured": false,
        "order": 6,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "skill",
      "payload": {
        "title": "Excel",
        "slug": "excel",
        "summary": "Sample tool",
        "scope": "data",
        "featured": false,
        "order": 7,
        "cover": "",
        "alt": "",
        "category": "",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "article",
      "payload": {
        "title": "A place for ideas in progress",
        "slug": "sample-notebook",
        "summary": "Sample article - Your writing will live here.",
        "scope": "general",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "Notebook",
        "body": "This is a sample article. Use the editor to share your own notes, tutorials, or reflections. Markdown supports headings, lists, code and links.",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "2026-09-28",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "experience",
      "payload": {
        "title": "Frontend engineering practice",
        "slug": "sample-frontend-practice",
        "summary": "Sample experience entry - replace this with a verified role, project period or education detail.",
        "scope": "engineering",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "Experience",
        "body": "Use this space for a concise, verifiable description of what you worked on and learned.",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "community",
      "payload": {
        "title": "Learning and sharing in community",
        "slug": "sample-community",
        "summary": "Sample community entry - replace this with a real teaching, speaking or community contribution.",
        "scope": "general",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "Community",
        "body": "Add a short description of the people you supported, the topic and the part you played.",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "certification",
      "payload": {
        "title": "Certification or achievement",
        "slug": "sample-certification",
        "summary": "Sample credential entry - replace this with a credential you can verify.",
        "scope": "general",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "Certification",
        "body": "Add the issuing organisation, date and a public verification link when available.",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "testimonial",
      "payload": {
        "title": "Sample kind words",
        "slug": "sample-testimonial",
        "summary": "Sample testimonial - replace before publishing as a real endorsement.",
        "scope": "general",
        "featured": false,
        "order": 0,
        "cover": "",
        "alt": "",
        "category": "Sample",
        "body": "This placeholder is intentionally labelled as sample content. Replace it only with a statement you have permission to publish.",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "",
        "seoDescription": "",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    }
  ]
  $records$::jsonb;
begin
  for item in select value from jsonb_array_elements(seed_records) loop
    if exists (
      select 1
      from public.content_entries e
      left join public.content_revisions d on d.id = e.draft_id
      left join public.content_revisions p on p.id = e.published_id
      where e.kind = item->>'kind'
        and (
          d.payload->>'slug' = item->'payload'->>'slug'
          or p.payload->>'slug' = item->'payload'->>'slug'
        )
    ) then
      raise notice 'Skipping existing %/%', item->>'kind', item->'payload'->>'slug';
      continue;
    end if;

    insert into public.content_entries (kind, is_seed, source)
    values (
      item->>'kind',
      true,
      'Labelled demonstration content; not verified professional work'
    ) returning id into project_id;

    insert into public.content_revisions (entry_id, payload)
    values (project_id, item->'payload')
    returning id into revision_id;

    update public.content_entries
    set draft_id = revision_id,
        published_id = revision_id,
        updated_at = now()
    where id = project_id;
  end loop;
end;
$seed_demo$;

commit;

select kind, count(*) as seeded_or_existing_demo_records
from public.content_entries
where is_seed and kind <> 'project'
group by kind
order by kind;
