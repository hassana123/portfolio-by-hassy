-- Paste this entire file into Supabase Dashboard > SQL Editor > New query.
-- Adds the remaining owner-supplied Hashnode articles as non-featured drafts.
-- The homepage selection is unchanged: only articles marked featured appear there.
-- The already-imported browser-to-beyond...-1 article is intentionally omitted.
-- Safe to rerun: matching article slugs are left unchanged.
-- Review and publish each draft from Admin > Articles.

begin;

select pg_advisory_xact_lock(8675309);

do $add_hashnode_articles$
declare
  item jsonb;
  entry_id uuid;
  revision_id uuid;
  records jsonb := $records$
  [
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "Browser to Beyond: A Front-End Developer's Path to Mobile Development",
        "slug": "browser-to-beyond-a-front-end-developers-path-to-mobile-development",
        "summary": "A Hashnode note about moving from front-end development toward mobile development.",
        "scope": "engineering",
        "featured": false,
        "order": 10,
        "cover": "",
        "alt": "",
        "category": "Frontend & mobile",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/browser-to-beyond-a-front-end-developers-path-to-mobile-development",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Browser to Beyond: Front-End Developer's Path to Mobile Development | Hassana Abdullahi",
        "seoDescription": "A Hashnode article by Hassana Abdullahi about moving from front-end development toward mobile development.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "Browser to Beyond: A Front-End Developer's Path to App Development",
        "slug": "browser-to-beyond-a-front-end-developers-path-to-app-development",
        "summary": "A Hashnode note about a front-end developer's path toward app development.",
        "scope": "engineering",
        "featured": false,
        "order": 11,
        "cover": "",
        "alt": "",
        "category": "Frontend & mobile",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/browser-to-beyond-a-front-end-developers-path-to-app-development",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Browser to Beyond: Front-End Developer's Path to App Development | Hassana Abdullahi",
        "seoDescription": "A Hashnode article by Hassana Abdullahi about the path from front-end development to app development.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "Web5: Revolutionizing Decentralized Application Development",
        "slug": "web5-revolutionizing-decentralized-application-development",
        "summary": "A Hashnode article exploring Web5 and decentralized application development.",
        "scope": "engineering",
        "featured": false,
        "order": 12,
        "cover": "",
        "alt": "",
        "category": "Web development",
        "body": "",
        "blocks": [],
        "tools": [],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/web5-revolutionizing-decentralized-application-development",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Web5: Revolutionizing Decentralized Application Development | Hassana Abdullahi",
        "seoDescription": "A Hashnode article by Hassana Abdullahi exploring Web5 and decentralized application development.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "React.js vs Next.js",
        "slug": "reactjs-vs-nextjs",
        "summary": "A comparison of React.js and Next.js for front-end development.",
        "scope": "engineering",
        "featured": false,
        "order": 13,
        "cover": "",
        "alt": "",
        "category": "Frontend development",
        "body": "",
        "blocks": [],
        "tools": ["React.js", "Next.js"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/reactjs-vs-nextjs",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "React.js vs Next.js | Hassana Abdullahi",
        "seoDescription": "A Hashnode comparison of React.js and Next.js by Hassana Abdullahi.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "A Beginner's Guide to Understanding HTML5 Semantics",
        "slug": "a-beginners-guide-to-understanding-html5-semantics",
        "summary": "A beginner-friendly guide to understanding semantic HTML5 elements.",
        "scope": "engineering",
        "featured": false,
        "order": 14,
        "cover": "",
        "alt": "",
        "category": "HTML & accessibility",
        "body": "",
        "blocks": [],
        "tools": ["HTML5"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/a-beginners-guide-to-understanding-html5-semantics",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "A Beginner's Guide to Understanding HTML5 Semantics | Hassana Abdullahi",
        "seoDescription": "A beginner's guide to semantic HTML5 elements by Hassana Abdullahi.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "My ALX C Simple Shell Project",
        "slug": "my-alx-c-simpleshell-project",
        "summary": "A Hashnode project note about building a simple shell in C during the ALX programme.",
        "scope": "engineering",
        "featured": false,
        "order": 15,
        "cover": "",
        "alt": "",
        "category": "C programming",
        "body": "",
        "blocks": [],
        "tools": ["C"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/my-alx-c-simpleshell-project",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "My ALX C Simple Shell Project | Hassana Abdullahi",
        "seoDescription": "A Hashnode project note about Hassana Abdullahi's ALX C simple shell project.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "The Yarn Whisperer: A Tale of Triumph Over npm Woes",
        "slug": "title-the-yarn-whisperer-a-tale-of-triumph-over-npm-woes",
        "summary": "A Hashnode story about working through package-management and npm problems.",
        "scope": "engineering",
        "featured": false,
        "order": 16,
        "cover": "",
        "alt": "",
        "category": "JavaScript tooling",
        "body": "",
        "blocks": [],
        "tools": ["npm", "Yarn"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/title-the-yarn-whisperer-a-tale-of-triumph-over-npm-woes",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "The Yarn Whisperer: A Tale of Triumph Over npm Woes | Hassana Abdullahi",
        "seoDescription": "A Hashnode story by Hassana Abdullahi about solving npm and package-management problems.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "How to Create a Client-Side Contact Form with EmailJS",
        "slug": "how-to-create-a-client-side-based-contact-form-with-emailjs-service",
        "summary": "A guide to creating a client-side contact form with the EmailJS service.",
        "scope": "engineering",
        "featured": false,
        "order": 17,
        "cover": "",
        "alt": "",
        "category": "Frontend tutorials",
        "body": "",
        "blocks": [],
        "tools": ["JavaScript", "EmailJS"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/how-to-create-a-client-side-based-contact-form-with-emailjs-service",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Client-Side Contact Form with EmailJS | Hassana Abdullahi",
        "seoDescription": "A Hashnode guide by Hassana Abdullahi to creating a client-side contact form with EmailJS.",
        "eligibleModes": [],
        "file": "",
        "video": "",
        "videoTitle": ""
      }
    },
    {
      "source": "Owner-supplied Hashnode article URL",
      "payload": {
        "title": "Creating a Custom Counter Using React.js",
        "slug": "creating-a-custom-counter-using-react-js",
        "summary": "A practical React.js article about creating a custom counter component.",
        "scope": "engineering",
        "featured": false,
        "order": 18,
        "cover": "",
        "alt": "",
        "category": "React tutorials",
        "body": "",
        "blocks": [],
        "tools": ["React.js"],
        "links": [],
        "externalUrl": "https://techsulatana.hashnode.dev/creating-a-custom-counter-using-react-js",
        "platform": "Hashnode",
        "embedUrl": "",
        "embedTitle": "",
        "date": "",
        "seoTitle": "Creating a Custom Counter Using React.js | Hassana Abdullahi",
        "seoDescription": "A practical React.js tutorial by Hassana Abdullahi about creating a custom counter component.",
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
$add_hashnode_articles$;

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
    'browser-to-beyond-a-front-end-developers-path-to-mobile-development',
    'browser-to-beyond-a-front-end-developers-path-to-app-development',
    'web5-revolutionizing-decentralized-application-development',
    'reactjs-vs-nextjs',
    'a-beginners-guide-to-understanding-html5-semantics',
    'my-alx-c-simpleshell-project',
    'title-the-yarn-whisperer-a-tale-of-triumph-over-npm-woes',
    'how-to-create-a-client-side-based-contact-form-with-emailjs-service',
    'creating-a-custom-counter-using-react-js'
  )
order by (d.payload->>'order')::int;

