-- Paste this ENTIRE file into Supabase Dashboard > SQL Editor > New query.
-- Run using the SQL Editor's default postgres role, after 001_portfolio.sql.
-- Adds ONE real project as a DRAFT. No owner UUID or secret is needed here.
-- Does not publish anything, change settings, or touch MentoRaft.
-- Safe to rerun: an existing MDCL draft/published slug is left unchanged.
-- Add screenshots in Admin > Projects afterwards, preview, then Publish.

begin;

-- Coordinate with the application's content-saving function.
select pg_advisory_xact_lock(8675309);

do $import_mdcl$
declare
  project_id uuid;
  revision_id uuid;
  project_payload jsonb := $project_json$
  {
    "title": "MDCL — Website Redesign & Content Management",
    "slug": "mdcl-website-redesign",
    "summary": "Redesigned and rebuilt MDCL’s corporate website with an updated user experience and an admin dashboard for managing projects, articles, resources and other website content.",
    "scope": "engineering",
    "featured": true,
    "order": 1,
    "cover": "",
    "alt": "",
    "category": "Client Project · MicroDevelopment Consulting Limited",
    "body": "MicroDevelopment Consulting Limited is a Nigerian consulting firm established in 2009. In 2025, it sharpened its focus on advancing women’s empowerment across agricultural systems and value chains.\n\nI redesigned and rebuilt its website to communicate this direction, improve how visitors explore its work, and give the team an admin area for maintaining website content.",
    "blocks": [
      {
        "heading": "Overview & project goals",
        "body": "The project involved upgrading an existing corporate website to better present MDCL’s identity, services and development work.\n\nThe goals were to refresh the interface, organise the company’s information into clear visitor journeys, and introduce content-management tools so the team could maintain key sections through an admin dashboard.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "My role & contributions",
        "body": "I redesigned the website’s interface and rebuilt its frontend, improving the page layouts, navigation and presentation of content.\n\nI also developed an admin area for managing projects, blog posts, galleries, resources, announcements and team information. Additional admin sections support viewing newsletter subscribers and contact messages.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "Technologies & key features",
        "body": "Built with Next.js, React, JavaScript, Tailwind CSS and Firebase.\n\nKey features include:\n\n- Public pages for the organisation, its services, projects and programmes.\n- An admin dashboard with content-management interfaces.\n- Blog publishing and individual article pages.\n- Gallery and image management.\n- Resource sections for newsletters, policy documents and facts.\n- Team-member and announcement management.\n- Newsletter subscriptions and contact-message management.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "Design & development approach",
        "body": "I organised the public website around the information visitors need: understanding MDCL, exploring its solutions, reviewing its projects and accessing its resources.\n\nThe updated interface combines clear navigation, section headings and imagery to present the organisation’s work. Behind the public pages, dedicated admin sections provide focused workflows for adding and updating different types of content.",
        "image": "",
        "alt": ""
      },
      {
        "heading": "Outcome",
        "body": "The redesigned website is live on MDCL’s domain, presenting the organisation’s current focus alongside its services, projects, publications and contact information.\n\nThe rebuild also introduced an admin area for managing key content, giving the team a practical way to keep the website updated without editing source code for each supported content change.",
        "image": "",
        "alt": ""
      }
    ],
    "tools": ["Next.js", "React", "JavaScript", "Tailwind CSS", "Firebase"],
    "links": [
      { "label": "Visit website", "url": "https://www.microdevelopmentng.com/" },
      { "label": "View source code", "url": "https://github.com/hassana123/mdcl" }
    ],
    "externalUrl": "",
    "platform": "",
    "embedUrl": "",
    "embedTitle": "",
    "date": "2025",
    "seoTitle": "MDCL Website Redesign | Hassana Abdullahi",
    "seoDescription": "A corporate website redesign for MDCL, built with Next.js and Firebase, with an updated interface and admin tools for managing website content.",
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
    raise notice 'MDCL already exists. No content was changed. Edit the existing project in Admin > Projects (check archived records too).';
    return;
  end if;

  insert into public.content_entries (kind, is_seed, source)
  values (
    'project',
    false,
    'Owner-supplied MDCL case study; https://www.microdevelopmentng.com/ ; https://github.com/hassana123/mdcl'
  ) returning id into project_id;

  insert into public.content_revisions (entry_id, payload)
  values (project_id, project_payload)
  returning id into revision_id;

  update public.content_entries
  set draft_id = revision_id, updated_at = now()
  where id = project_id;

  raise notice 'MDCL draft created. Refresh Admin > Projects, add screenshots, and publish when ready.';
end;
$import_mdcl$;

commit;

-- The result confirms the stored project; published_id stays NULL for a new draft.
select
  e.id as project_id,
  coalesce(d.payload->>'title', p.payload->>'title') as title,
  case when e.published_id is null then 'Draft' else 'Has published version (unchanged)' end as status,
  e.archived,
  jsonb_array_length(coalesce(d.payload, p.payload)->'blocks') as block_count
from public.content_entries e
left join public.content_revisions d on d.id = e.draft_id
left join public.content_revisions p on p.id = e.published_id
where e.kind = 'project'
  and (
    d.payload->>'slug' = 'mdcl-website-redesign'
    or p.payload->>'slug' = 'mdcl-website-redesign'
  );
