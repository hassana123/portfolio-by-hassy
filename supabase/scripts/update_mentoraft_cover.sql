-- Paste this file into Supabase Dashboard > SQL Editor.
-- Updates only the MentoRaft draft cover and alt text.
-- Existing body, blocks, links, media and published content are preserved.
-- Publish the draft from Admin > Projects when you are happy with the cover.

begin;

select pg_advisory_xact_lock(8675309);

do $update_mentoraft$
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
      d.payload->>'slug' = 'mentoraft'
      or p.payload->>'slug' = 'mentoraft'
    )
  order by e.updated_at desc
  limit 1;

  if project_id is null or base_payload is null then
    raise notice 'MentoRaft was not found. Create the project first, then run this script.';
    return;
  end if;

  next_payload := base_payload || jsonb_build_object(
    'cover', '/demo/mentoraft-cover-light.png',
    'alt', 'MentoRaft learning platform homepage showing course paths, tutor controls and learner progress features'
  );

  insert into public.content_revisions (entry_id, payload)
  values (project_id, next_payload)
  returning id into revision_id;

  update public.content_entries
  set draft_id = revision_id, updated_at = now()
  where id = project_id;

  raise notice 'MentoRaft draft cover updated. The published version is unchanged.';
end;
$update_mentoraft$;

commit;

select
  e.id as project_id,
  d.payload->>'title' as title,
  d.payload->>'cover' as cover,
  case when e.published_id is null then 'Draft only' else 'Draft updated; published version unchanged' end as status
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'project'
  and d.payload->>'slug' = 'mentoraft';
