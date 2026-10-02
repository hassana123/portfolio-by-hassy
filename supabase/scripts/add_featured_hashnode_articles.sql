-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Adds three owner-supplied external Hashnode articles as featured drafts.
-- It does not publish, overwrite, or change existing articles or settings.
-- Safe to rerun: matching article slugs are left unchanged.
-- Review each draft in Admin > Articles, add covers if wanted, then publish.

begin;

select pg_advisory_xact_lock(8675309);

do $import_hashnode_articles$
declare
  item jsonb;
  entry_id uuid;
  revision_id uuid;
  records jsonb := $records$
  [
    {
      "source": "Owner-supplied Hashnode article; Women Techmakers International Women's Day sprint",
      "payload": {
        "title": "The International Women's Day Website Sprint: Building HerSite in a Day",
        "slug": "international-womens-day-website-sprint-hersite",
        "summary": "A build-in-public reflection on creating HerSite during an International Women's Day website sprint.",
        "scope": "general",
        "featured": true,
        "order": 0,
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
    },
    {
      "source": "Owner-supplied Hashnode article; Africa's Talking SMS API tutorial",
      "payload": {
        "title": "How to Implement Africa's Talking SMS API",
        "slug": "how-to-implement-africas-talking-sms-api",
        "summary": "A technical guide to implementing the Africa's Talking SMS API.",
        "scope": "engineering",
        "featured": true,
        "order": 1,
        "cover": "",
        "alt": "",
        "category": "APIs & tutorials",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/how-to-implement-africans-talking-sms-api",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "How to Implement Africa's Talking SMS API | Hassana Abdullahi",
        "seoDescription": "A Hashnode tutorial by Hassana Abdullahi on implementing the Africa's Talking SMS API.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article; Dart and mobile development learning path",
      "payload": {
        "title": "Browser to Beyond: A Front-End Developer's Path to Mobile Development",
        "slug": "browser-to-beyond-front-end-developer-mobile-development",
        "summary": "A front-end developer's learning path into mobile development, with an introduction to Dart fundamentals.",
        "scope": "engineering",
        "featured": true,
        "order": 2,
        "cover": "",
        "alt": "",
        "category": "Frontend & mobile",
        "body": "",
        "blocks": [],
        "tools": ["Dart"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/browser-to-beyond-a-front-end-developers-path-to-mobile-development-1",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "2024-07-08",
        "seoTitle": "Browser to Beyond: Front-End to Mobile Development | Hassana Abdullahi",
        "seoDescription": "Hassana Abdullahi's Hashnode article about learning Dart and moving from front-end development toward mobile development.",
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
      where e.kind = 'article'
        and (
          d.payload->>'slug' = item->'payload'->>'slug'
          or p.payload->>'slug' = item->'payload'->>'slug'
        )
    ) then
      raise notice 'Skipping existing article/%', item->'payload'->>'slug';
      continue;
    end if;

    insert into public.content_entries (kind, is_seed, source)
    values ('article', false, item->>'source')
    returning id into entry_id;

    insert into public.content_revisions (entry_id, payload)
    values (entry_id, item->'payload')
    returning id into revision_id;

    update public.content_entries
    set draft_id = revision_id, updated_at = now()
    where id = entry_id;
  end loop;
end;
$import_hashnode_articles$;

commit;

select
  e.id as article_id,
  d.payload->>'title' as title,
  d.payload->>'slug' as slug,
  d.payload->>'externalUrl' as external_url,
  d.payload->>'featured' as featured,
  case when e.published_id is null then 'Draft' else 'Has published version' end as status
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'article'
  and d.payload->>'slug' in (
    'international-womens-day-website-sprint-hersite',
    'how-to-implement-africas-talking-sms-api',
    'browser-to-beyond-front-end-developer-mobile-development'
  )
order by (d.payload->>'order')::int;
