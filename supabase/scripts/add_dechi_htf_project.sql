-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Adds Dechi HTF as an Engineering draft. It does not publish or overwrite
-- existing projects, site settings, media, or owner content.
-- Add the real cover/screenshots in Admin > Media and Projects, then publish.

begin;

select pg_advisory_xact_lock(8675309);

do $import_dechi$
declare
  project_id uuid;
  revision_id uuid;
  project_payload jsonb := $project_json$
  {
    "title": "Dechi HTF - Client Website & Admin Dashboard",
    "slug": "dechi-htf",
    "summary": "In 2024, I built a client website for Dechi HTF together with a dedicated admin dashboard for managing its content.",
    "scope": "engineering",
    "featured": true,
    "order": 2,
    "cover": "",
    "alt": "",
    "category": "Client Project - Dechi HTF",
    "body": "In 2024, I built Dechi HTF as a client website with a dedicated admin dashboard. The public site gives visitors a clear way to understand the organisation, while the management area gives the team a practical way to keep supported content current after delivery.\n\nThis project brought the public-facing experience and the day-to-day editing workflow together. My contribution covered the website interface and the dashboard used to maintain it.",
    "blocks": [
      {
        "heading": "The brief",
        "body": "Dechi HTF needed a public website and a manageable way to keep it updated. The work therefore had two connected parts: an experience for visitors and an editing interface for the team behind it.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "My contribution",
        "body": "I designed and built the client-facing website, then developed the accompanying admin dashboard. The dashboard lets the team update supported website content without returning to the source code for every change.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "How the pieces work together",
        "body": "The public pages present Dechi HTF clearly to visitors. Behind them, the dashboard provides focused editing workflows so the content shown on the site can be maintained in one place.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "Outcome",
        "body": "The 2024 delivery gave Dechi HTF both a public online presence and an admin area for keeping that presence current. It is a practical example of building the visitor experience and the content workflow as one product.",
        "image": "",
        "alt": ""
      }
    ],
    "tools": [],
    "links": [
      { "label": "Visit website", "url": "https://dechi-htf.vercel.app/" },
      { "label": "View source code", "url": "https://github.com/hassana123/dechiHTF" }
    ],
    "externalUrl": "",
    "platform": "",
    "embedUrl": "",
    "embedTitle": "",
    "date": "2024",
    "seoTitle": "Dechi HTF Website & Admin Dashboard | Hassana Abdullahi",
    "seoDescription": "A 2024 client website and admin dashboard for Dechi HTF, built by Hassana Abdullahi.",
    "eligibleModes": [],
    "file": "",
    "video": "",
    "videoTitle": ""
  }
  $project_json$::jsonb;
begin
  if exists (
    select 1
    from public.content_entries e
    left join public.content_revisions d on d.id = e.draft_id
    left join public.content_revisions p on p.id = e.published_id
    where e.kind = 'project'
      and (
        d.payload->>'slug' = project_payload->>'slug'
        or p.payload->>'slug' = project_payload->>'slug'
      )
  ) then
    raise notice 'Dechi HTF already exists. No content was changed.';
    return;
  end if;

  insert into public.content_entries (kind, is_seed, source)
  values (
    'project',
    false,
    'Owner-supplied Dechi HTF case study; https://dechi-htf.vercel.app/ ; https://github.com/hassana123/dechiHTF'
  ) returning id into project_id;

  insert into public.content_revisions (entry_id, payload)
  values (project_id, project_payload)
  returning id into revision_id;

  update public.content_entries
  set draft_id = revision_id, updated_at = now()
  where id = project_id;

  raise notice 'Dechi HTF draft created. Add screenshots and publish it from Admin > Projects.';
end;
$import_dechi$;

commit;

select
  e.id as project_id,
  d.payload->>'title' as title,
  case when e.published_id is null then 'Draft' else 'Has published version' end as status,
  jsonb_array_length(d.payload->'blocks') as block_count
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'project'
  and d.payload->>'slug' = 'dechi-htf';
