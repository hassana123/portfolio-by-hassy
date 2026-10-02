-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Adds three owner-supplied draft projects and one external article entry.
-- It does not overwrite existing records or publish anything.
-- Safe to rerun: matching kind/slug records are left unchanged.
-- Add the real covers and screenshots in Admin > Media and Projects,
-- then preview and publish each draft.

begin;

select pg_advisory_xact_lock(8675309);

do $add_collaborations$
declare
  item jsonb;
  entry_id uuid;
  revision_id uuid;
  records jsonb := $records$
  [
    {
      "kind": "project",
      "source": "Owner-supplied Women Techmakers community sprint; Hashnode story supplied by the owner",
      "payload": {
        "title": "Women Techmakers International Women's Day Website Sprint",
        "slug": "women-techmakers-website-sprint",
        "summary": "A community build sprint in which I created three Lovable websites for International Women's Day and brought the work together as one shared project.",
        "scope": "general",
        "featured": true,
        "order": 3,
        "cover": "",
        "alt": "",
        "category": "Community · Women Techmakers",
        "body": "This community project brings together the three websites I built with Lovable during the Women Techmakers International Women's Day sprint. They were created in one focused day, with the sprint making space to move quickly from an idea to a working public experience.\n\nThe three sites belong together as one story: a fast, collaborative experiment in using an AI-assisted builder to turn a community brief into real web pages. I am keeping them under one project so the sprint, the shared context and the individual site links can be understood together.",
        "blocks": [
          {
            "heading": "The sprint",
            "body": "The International Women's Day sprint was a community build challenge. The goal was to create useful, presentable websites in a short window and learn by shipping rather than waiting for a perfect first version.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Three sites, one project",
            "body": "I built three Lovable sites during the sprint. They are presented as one community project because the sites came from the same event, the same day of building and the same shared learning context. Add each confirmed live URL as a project link when it is ready to be listed.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "What I learned",
            "body": "The sprint strengthened my practice of shaping a clear idea, making fast interface decisions and getting a working experience in front of people quickly. The accompanying article documents the process and the build story.",
            "image": "",
            "alt": ""
          }
        ],
        "tools": ["Lovable"],
        "links": [
          {
            "label": "Read the sprint story",
            "url": "https://techsulatana.hashnode.dev/the-international-women-s-day-website-sprint-building-hersite-in-a-day"
          }
        ],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Women Techmakers Website Sprint | Hassana Abdullahi",
        "seoDescription": "A Women Techmakers community project bringing together three Lovable websites built during an International Women's Day sprint.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "project",
      "source": "Owner-supplied G3Women Digital Academy team contribution; public site verified at https://academy.g3women.org/",
      "payload": {
        "title": "G3Women Digital Academy — Team Frontend",
        "slug": "g3women-digital-academy",
        "summary": "Part of the team building a free digital academy that helps Nigerian women learn technology, life and business skills in their own languages.",
        "scope": "engineering",
        "featured": true,
        "order": 4,
        "cover": "",
        "alt": "",
        "category": "Community · G3Women",
        "body": "I am part of the team building the G3Women Digital Academy platform. The academy gives Nigerian women access to free learning across technology, life skills and business, with courses designed for Hausa, Yoruba, Igbo and English speakers.\n\nMy role is described as a team contribution rather than a solo build. The platform combines public course discovery with a learning experience designed to make practical education more accessible.",
        "blocks": [
          {
            "heading": "Team contribution",
            "body": "I contribute to the team building the G3Women Digital Academy. The work is collaborative, so this case study focuses on my participation in the platform rather than attributing the whole product to one person.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Learning experience",
            "body": "The public platform helps learners discover courses in areas such as AI safety and data privacy, prompt engineering and office productivity. Course pages provide descriptions, durations and instructor information before a learner starts.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Access and community",
            "body": "G3Women Digital Academy is presented as a free learning platform and a G3Women initiative. Its language options and community support reflect the goal of making digital education useful and reachable for more Nigerian women.",
            "image": "",
            "alt": ""
          }
        ],
        "tools": [],
        "links": [
          {
            "label": "Visit the academy",
            "url": "https://academy.g3women.org/"
          }
        ],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "G3Women Digital Academy | Hassana Abdullahi",
        "seoDescription": "A team contribution to the G3Women Digital Academy, a free multilingual learning platform for Nigerian women.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "project",
      "source": "Owner-supplied Saqo frontend contribution while working with Bellbank",
      "payload": {
        "title": "Saqo — Frontend Development",
        "slug": "saqo-frontend",
        "summary": "Frontend work on Saqo while collaborating with Bellbank, with the live product and source repository available for review.",
        "scope": "engineering",
        "featured": true,
        "order": 5,
        "cover": "",
        "alt": "",
        "category": "Collaboration · Bellbank",
        "body": "I worked on the frontend for Saqo while collaborating with Bellbank. This project represents a focused contribution to an existing product: shaping the interface and frontend experience while working as part of a wider team.",
        "blocks": [
          {
            "heading": "The collaboration",
            "body": "Saqo was built as a collaborative project with Bellbank. My contribution was on the frontend, so the case study keeps the focus on the interface work and the product experience I helped deliver.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Frontend contribution",
            "body": "I worked on the frontend experience for Saqo, translating the product needs into usable pages and interactions. Add the screenshots and confirmed technology details in Admin after importing this draft.",
            "image": "",
            "alt": ""
          },
          {
            "heading": "Explore the work",
            "body": "The live product and source repository provide the best starting points for reviewing the work. The project can be expanded with the specific screens, decisions and outcomes you want to document.",
            "image": "",
            "alt": ""
          }
        ],
        "tools": [],
        "links": [
          {
            "label": "Visit Saqo",
            "url": "https://saqo.netlify.app/"
          },
          {
            "label": "View source code",
            "url": "https://github.com/hassana123/Saqo-Frontend"
          }
        ],
        "externalUrl": "",
        "platform": "",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Saqo Frontend Development | Hassana Abdullahi",
        "seoDescription": "Frontend work on Saqo completed in collaboration with Bellbank, with links to the live product and source repository.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "kind": "article",
      "source": "Owner-supplied external Hashnode article",
      "payload": {
        "title": "The International Women's Day Website Sprint: Building HerSite in a Day",
        "slug": "international-womens-day-website-sprint-hersite",
        "summary": "A build-in-public reflection on creating HerSite during an International Women's Day website sprint.",
        "scope": "general",
        "featured": true,
        "order": 1,
        "cover": "",
        "alt": "",
        "category": "Community",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/the-international-women-s-day-website-sprint-building-hersite-in-a-day",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Building HerSite in a Day | Hassana Abdullahi",
        "seoDescription": "Hassana Abdullahi's Hashnode story about building HerSite during an International Women's Day website sprint.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    }
  ]
  $records$::jsonb;
begin
  for item in select value from jsonb_array_elements(records) loop
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
    values (item->>'kind', false, item->>'source')
    returning id into entry_id;

    insert into public.content_revisions (entry_id, payload)
    values (entry_id, item->'payload')
    returning id into revision_id;

    update public.content_entries
    set draft_id = revision_id, updated_at = now()
    where id = entry_id;
  end loop;
end;
$add_collaborations$;

commit;

select
  e.kind,
  d.payload->>'title' as title,
  d.payload->>'slug' as slug,
  case when e.published_id is null then 'Draft' else 'Has published version' end as status
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where d.payload->>'slug' in (
  'women-techmakers-website-sprint',
  'g3women-digital-academy',
  'saqo-frontend',
  'international-womens-day-website-sprint-hersite'
)
order by e.kind, d.payload->>'slug';
