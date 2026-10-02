-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Adds AgriSmart as an Engineering draft for the 2024 hackathon project.
-- It does not publish, overwrite, or change existing projects, media, or settings.
-- Safe to rerun: an existing agri-smart draft or published record is left unchanged.
-- Add the real cover and screenshots in Admin > Media and Projects, then preview
-- and publish the draft when the case study is ready.

begin;

select pg_advisory_xact_lock(8675309);

do $import_agrismart$
declare
  project_id uuid;
  revision_id uuid;
  project_payload jsonb := $project_json$
  {
    "title": "AgriSmart - 2024 Hackathon Project",
    "slug": "agri-smart",
    "summary": "A 2024 hackathon project that earned second place, built to explore a more accessible and practical experience for agriculture-focused users.",
    "scope": "engineering",
    "featured": true,
    "order": 6,
    "cover": "",
    "alt": "",
    "category": "Hackathon - Second place",
    "body": "AgriSmart was a project I built during a hackathon in 2024. The team focused on turning an agriculture-related idea into a working web experience within a short build window.\n\nThe project earned second place in the hackathon. This case study is intentionally kept focused on the product story and the contribution I can verify; the specific technology details and screenshots can be added from the project repository and live site.",
    "blocks": [
      {
        "heading": "The hackathon brief",
        "body": "Hackathons require a team to move from an idea to a usable demonstration quickly. AgriSmart gave us a focused opportunity to think about an agriculture-related problem, shape a clear product direction and build a working experience under time constraints.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "The product",
        "body": "AgriSmart is presented as a practical web project for an agriculture-focused audience. The live project and source repository are the best references for the interface, the final feature set and the implementation details.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "My contribution",
        "body": "I contributed to taking AgriSmart from the hackathon idea to a working web experience. Add the specific responsibilities, screens and technology choices in Admin after reviewing the repository and your project notes.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "Recognition and outcome",
        "body": "AgriSmart earned second place in the 2024 hackathon. The result reflects the value of turning the concept into a working demonstration within the event's time limit. Add the judging criteria or event name when you are ready to document them.",
        "image": "",
        "alt": ""
      }
    ],
    "tools": [],
    "links": [
      { "label": "Visit AgriSmart", "url": "https://agri-smart.vercel.app/" },
      { "label": "View source code", "url": "https://github.com/hassana123/agri-smart" }
    ],
    "externalUrl": "",
    "platform": "",
    "embedUrl": "",
    "embedTitle": "",
    "date": "2024",
    "seoTitle": "AgriSmart Hackathon Project | Hassana Abdullahi",
    "seoDescription": "AgriSmart, a 2024 hackathon project that earned second place and is available as a live web experience and source repository.",
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
    raise notice 'AgriSmart already exists. No content was changed.';
    return;
  end if;

  insert into public.content_entries (kind, is_seed, source)
  values (
    'project',
    false,
    'Owner-supplied AgriSmart 2024 hackathon project; https://agri-smart.vercel.app/ ; https://github.com/hassana123/agri-smart'
  ) returning id into project_id;

  insert into public.content_revisions (entry_id, payload)
  values (project_id, project_payload)
  returning id into revision_id;

  update public.content_entries
  set draft_id = revision_id, updated_at = now()
  where id = project_id;

  raise notice 'AgriSmart draft created. Add screenshots and publish it from Admin > Projects.';
end;
$import_agrismart$;

commit;

select
  e.id as project_id,
  d.payload->>'title' as title,
  case when e.published_id is null then 'Draft' else 'Has published version' end as status,
  d.payload->>'date' as project_year,
  jsonb_array_length(d.payload->'blocks') as block_count
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'project'
  and d.payload->>'slug' = 'agri-smart';
