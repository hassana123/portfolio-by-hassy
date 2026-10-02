-- Paste this entire file into Supabase Dashboard > SQL Editor.
-- Adds the generated covers and local download files to the two FMCG projects.
-- Existing body, blocks, links and published revisions are preserved.
-- Existing manually selected covers/downloads are kept; run after the projects exist.

begin;

select pg_advisory_xact_lock(8675309);

do $update_fmcg_assets$
declare
  item record;
  project_id uuid;
  base_payload jsonb;
  next_payload jsonb;
  revision_id uuid;
begin
  for item in
    select *
    from (values
      (
        'nigerian-fmcg-sales-analysis',
        '/demo/nigerian-fmcg-sales-analysis-cover.png',
        'Layered dashboard panels showing the Nigerian FMCG sales and distribution analysis for 2025',
        '[]'::jsonb
      ),
      (
        'fmcg-sales-performance-dashboard-fy-2024',
        '/demo/fmcg-sales-performance-2024-cover.png',
        'Layered Power BI dashboard panels showing FMCG sales performance, revenue and stockout risk for FY 2024',
        jsonb_build_array(
          jsonb_build_object('label', 'Download dataset (CSV)', 'file', '/demo/fmcg-sales-2024-dataset.csv'),
          jsonb_build_object('label', 'Download cleaned workbook (XLSX)', 'file', '/demo/fmcg-sales-2024-clean.xlsx'),
          jsonb_build_object('label', 'Download Power BI report (PBIX)', 'file', '/demo/fmcg-sales-2024-report.pbix'),
          jsonb_build_object('label', 'Download Power BI template (PBIT)', 'file', '/demo/fmcg-sales-2024-template.pbit')
        )
      )
    ) as x(slug, cover, alt, downloads)
  loop
    select e.id, coalesce(d.payload, p.payload)
    into project_id, base_payload
    from public.content_entries e
    left join public.content_revisions d on d.id = e.draft_id
    left join public.content_revisions p on p.id = e.published_id
    where e.kind = 'project'
      and (d.payload->>'slug' = item.slug or p.payload->>'slug' = item.slug)
    order by e.updated_at desc
    limit 1;

    if project_id is null or base_payload is null then
      raise notice 'Project % was not found. Run add_data_analysis_projects.sql first.', item.slug;
      continue;
    end if;

    next_payload := base_payload || jsonb_build_object(
      'cover', coalesce(nullif(base_payload->>'cover', ''), item.cover),
      'alt', coalesce(nullif(base_payload->>'alt', ''), item.alt),
      'downloads', case
        when jsonb_array_length(coalesce(base_payload->'downloads', '[]'::jsonb)) > 0
          then base_payload->'downloads'
        else item.downloads
      end
    );

    insert into public.content_revisions (entry_id, payload)
    values (project_id, next_payload)
    returning id into revision_id;

    update public.content_entries
    set draft_id = revision_id, updated_at = now()
    where id = project_id;

    raise notice 'Updated draft assets for %.', item.slug;
  end loop;
end;
$update_fmcg_assets$;

commit;

select
  d.payload->>'slug' as slug,
  d.payload->>'cover' as cover,
  jsonb_array_length(coalesce(d.payload->'downloads', '[]'::jsonb)) as download_count,
  case when e.published_id is null then 'Draft only' else 'Draft updated; published version unchanged' end as status
from public.content_entries e
join public.content_revisions d on d.id = e.draft_id
where e.kind = 'project'
  and d.payload->>'slug' in (
    'nigerian-fmcg-sales-analysis',
    'fmcg-sales-performance-dashboard-fy-2024'
  )
order by d.payload->>'slug';
