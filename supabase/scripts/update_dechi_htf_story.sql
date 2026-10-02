-- Paste this file into Supabase Dashboard > SQL Editor after
-- add_dechi_htf_project.sql has created the Dechi HTF draft.
-- Updates the draft story to record the 2024 build while preserving
-- the cover, media, links, tools and any published revision.

begin;

select pg_advisory_xact_lock(8675309);

do $update_dechi$
declare
  project_id uuid;
  base_payload jsonb;
  next_payload jsonb;
  revision_id uuid;
begin
  select e.id, coalesce(d.payload, p.payload)
  into project_id, base_payload
  from public.content_entries e
  left join public.content_revisions d on d.id = e.draft_id
  left join public.content_revisions p on p.id = e.published_id
  where e.kind = 'project'
    and (
      d.payload->>'slug' = 'dechi-htf'
      or p.payload->>'slug' = 'dechi-htf'
    )
  order by e.updated_at desc
  limit 1;

  if project_id is null or base_payload is null then
    raise notice 'Dechi HTF was not found. Run add_dechi_htf_project.sql first.';
    return;
  end if;

  next_payload := base_payload || jsonb_build_object(
    'summary', 'In 2024, I built a client website for Dechi HTF together with a dedicated admin dashboard for managing its content.',
    'date', '2024',
    'body', 'In 2024, I built Dechi HTF as a client website with a dedicated admin dashboard. The public site gives visitors a clear way to understand the organisation, while the management area gives the team a practical way to keep supported content current after delivery.

This project brought the public-facing experience and the day-to-day editing workflow together. My contribution covered the website interface and the dashboard used to maintain it.',
    'blocks', jsonb_build_array(
      jsonb_build_object(
        'heading', 'The brief',
        'body', 'Dechi HTF needed a public website and a manageable way to keep it updated. The work therefore had two connected parts: an experience for visitors and an editing interface for the team behind it.',
        'image', '',
        'alt', ''
      ),
      jsonb_build_object(
        'heading', 'My contribution',
        'body', 'I designed and built the client-facing website, then developed the accompanying admin dashboard. The dashboard lets the team update supported website content without returning to the source code for every change.',
        'image', '',
        'alt', ''
      ),
      jsonb_build_object(
        'heading', 'How the pieces work together',
        'body', 'The public pages present Dechi HTF clearly to visitors. Behind them, the dashboard provides focused editing workflows so the content shown on the site can be maintained in one place.',
        'image', '',
        'alt', ''
      ),
      jsonb_build_object(
        'heading', 'Outcome',
        'body', 'The 2024 delivery gave Dechi HTF both a public online presence and an admin area for keeping that presence current. It is a practical example of building the visitor experience and the content workflow as one product.',
        'image', '',
        'alt', ''
      )
    ),
    'seoTitle', 'Dechi HTF Website & Admin Dashboard | Hassana Abdullahi',
    'seoDescription', 'A 2024 client website and admin dashboard for Dechi HTF, built by Hassana Abdullahi.'
  );

  insert into public.content_revisions (entry_id, payload)
  values (project_id, next_payload)
  returning id into revision_id;

  update public.content_entries
  set draft_id = revision_id, updated_at = now()
  where id = project_id;

  raise notice 'Dechi HTF draft story updated for 2024. The published revision was left unchanged.';
end;
$update_dechi$;

commit;

select
  e.id as project_id,
  d.payload->>'title' as title,
  d.payload->>'date' as period,
  case when e.published_id is null then 'Draft only' else 'Draft updated; published version unchanged' end as status
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'project'
  and d.payload->>'slug' = 'dechi-htf';
