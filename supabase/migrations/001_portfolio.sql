-- Run once in a new Supabase project. Never auto-seed on app startup.
create table public.owners (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.owners enable row level security;
create function public.is_owner() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from owners where user_id=auth.uid()) $$;
create table public.site_revisions (id uuid primary key default gen_random_uuid(), payload jsonb not null check(jsonb_typeof(payload)='object'), created_at timestamptz not null default now(), check(coalesce((payload->>'engineering')::boolean,false) or coalesce((payload->>'data')::boolean,false)));
create table public.site_state (id int primary key check(id=1), draft_id uuid references site_revisions(id), published_id uuid references site_revisions(id));
insert into public.site_state(id) values(1);
create table public.content_entries (id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('project','article','service','skill','experience','community','certification','testimonial','cv')), is_seed boolean not null default false, source text not null default '', archived boolean not null default false, draft_id uuid, published_id uuid, updated_at timestamptz not null default now());
create table public.content_revisions (id uuid primary key default gen_random_uuid(), entry_id uuid not null references content_entries(id) on delete cascade, payload jsonb not null check(jsonb_typeof(payload)='object'), created_at timestamptz not null default now(), check(payload->>'scope' in ('general','engineering','data','both')),check(payload->>'slug' ~ '^[a-z0-9]+(-[a-z0-9]+)*$'));
alter table public.content_entries add constraint draft_revision foreign key(draft_id) references content_revisions(id) on delete set null;
alter table public.content_entries add constraint published_revision foreign key(published_id) references content_revisions(id) on delete set null;
create index entries_kind on public.content_entries(kind);
create index revisions_entry on public.content_revisions(entry_id);
create table public.media (id uuid primary key default gen_random_uuid(), path text not null unique, name text not null, mime text not null, bytes bigint not null check(bytes>0 and bytes<=26214400), alt text not null default '', created_at timestamptz not null default now());
create table public.enquiries (id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 100), email text not null check(length(email)<=254), subject text not null default '' check(length(subject)<=160), message text not null check(length(message) between 10 and 5000), is_read boolean not null default false, archived boolean not null default false, notification text not null default 'unconfigured', created_at timestamptz not null default now());
create table public.contact_limits (key text primary key, attempts int not null, window_start timestamptz not null);
do $$ declare t text; begin foreach t in array array['site_revisions','site_state','content_entries','content_revisions','media','enquiries'] loop execute format('alter table public.%I enable row level security',t);execute format('create policy owner_access on public.%I for all to authenticated using (public.is_owner()) with check(public.is_owner())',t);end loop;end $$;
alter table public.contact_limits enable row level security;
-- No public table reads: all public access resolves one coherent published snapshot.
create function public.scope_visible(scope text, settings jsonb) returns boolean language sql immutable as $$ select scope in ('general','both') or (scope='engineering' and coalesce((settings->>'engineering')::boolean,false)) or (scope='data' and coalesce((settings->>'data')::boolean,false)) $$;
create function public.record_visible(kind text, payload jsonb, settings jsonb) returns boolean language sql immutable as $$ select public.scope_visible(payload->>'scope',settings) and (kind<>'cv' or coalesce(payload->'eligibleModes','[]'::jsonb) ? (case when (settings->>'engineering')::boolean and (settings->>'data')::boolean then 'combined' when (settings->>'engineering')::boolean then 'engineering' else 'data' end)) $$;
create function public.public_snapshot() returns jsonb language plpgsql stable security definer set search_path=public as $$ declare s jsonb; rows jsonb; begin
select r.payload into s from site_state st join site_revisions r on r.id=st.published_id where st.id=1;
if s is null then raise exception 'Site has not been published';end if;
select coalesce(jsonb_agg(jsonb_build_object('id',e.id,'kind',e.kind,'published',r.payload,'is_seed',e.is_seed,'source',e.source,'archived',false) order by (r.payload->>'order')::int),'[]'::jsonb) into rows from content_entries e join content_revisions r on r.id=e.published_id where not e.archived and public.record_visible(e.kind,r.payload,s);
-- Filter settings fields too: inactive profiles and sections never leave the public data API.
s=jsonb_set(s,'{sections}',coalesce((select jsonb_agg(x) from jsonb_array_elements(s->'sections') x where (x->>'enabled')::boolean and public.scope_visible(x->>'scope',s) and (x->>'template'<>'engineering-projects' or (s->>'engineering')::boolean) and (x->>'template'<>'data-projects' or (s->>'data')::boolean)),'[]'::jsonb));
s=jsonb_set(s,'{profiles}',jsonb_build_object(case when (s->>'engineering')::boolean and (s->>'data')::boolean then 'combined' when (s->>'engineering')::boolean then 'engineering' else 'data' end,s->'profiles'->(case when (s->>'engineering')::boolean and (s->>'data')::boolean then 'combined' when (s->>'engineering')::boolean then 'engineering' else 'data' end)));
return jsonb_build_object('settings',s,'records',rows);end $$;
create function public.owner_snapshot() returns jsonb language plpgsql stable security definer set search_path=public as $$ declare s jsonb; rows jsonb;begin
if not public.is_owner() then raise exception 'Unauthorized';end if;
select r.payload into s from site_state st join site_revisions r on r.id=st.draft_id where st.id=1;
select coalesce(jsonb_agg(jsonb_build_object('id',e.id,'kind',e.kind,'draft',d.payload,'published',p.payload,'is_seed',e.is_seed,'source',e.source,'archived',e.archived,'updated_at',e.updated_at)),'[]'::jsonb) into rows from content_entries e join content_revisions d on d.id=e.draft_id left join content_revisions p on p.id=e.published_id;
return jsonb_build_object('settings',s,'records',rows);end $$;
create function public.save_site(payload jsonb, publish boolean default false) returns void language plpgsql security definer set search_path=public as $$ declare rev uuid;begin
if not public.is_owner() then raise exception 'Unauthorized';end if;
insert into site_revisions(payload) values(payload) returning id into rev;
update site_state set draft_id=rev,published_id=case when publish then rev else published_id end where id=1;end $$;
create function public.save_content(entry uuid, entry_kind text, payload jsonb, action text default 'draft', seed boolean default false, source_text text default '') returns uuid language plpgsql security definer set search_path=public as $$ declare rev uuid; result uuid;begin
if not public.is_owner() then raise exception 'Unauthorized';end if;
if action not in ('draft','publish','unpublish','archive','restore','delete') then raise exception 'Unknown action';end if;
perform pg_advisory_xact_lock(8675309);
if entry is null then insert into content_entries(kind,is_seed,source) values(entry_kind,seed,source_text) returning id into result;else result=entry;perform 1 from content_entries where id=result and kind=entry_kind for update;if not found then raise exception 'Record not found';end if;end if;
if action='delete' then delete from content_entries where id=result;return result;end if;
if action='archive' then update content_entries set archived=true,updated_at=now() where id=result;return result;end if;
if action='restore' then update content_entries set archived=false,updated_at=now() where id=result;return result;end if;
if action='unpublish' then update content_entries set published_id=null,updated_at=now() where id=result;return result;end if;
if action='publish' and exists(select 1 from content_entries e join content_revisions r on r.id=e.published_id where e.id<>result and e.kind=entry_kind and r.payload->>'slug'=save_content.payload->>'slug') then raise exception 'A published record already uses this slug';end if;
if entry_kind='project' and payload->>'slug' in ('frontend','data-analysis') then raise exception 'Reserved project slug';end if;
insert into content_revisions(entry_id,payload) values(result,payload) returning id into rev;
update content_entries set draft_id=rev,published_id=case when action='publish' then rev else published_id end,updated_at=now() where id=result;return result;end $$;
create function public.clear_starter(expected_count int) returns int language plpgsql security definer set search_path=public as $$ declare n int;begin
if not public.is_owner() then raise exception 'Unauthorized';end if;
lock table content_entries in exclusive mode;select count(*) into n from content_entries where is_seed;
if n<>expected_count then raise exception 'Starter count changed. Review again.';end if;
delete from content_entries where is_seed;return n;end $$;
create function public.contact_limit(client_key text) returns boolean language plpgsql security definer set search_path=public as $$ declare n int;begin
delete from contact_limits where window_start<now()-interval '1 day';
insert into contact_limits(key,attempts,window_start) values(client_key,1,now()) on conflict(key) do update set attempts=case when contact_limits.window_start<now()-interval '1 hour' then 1 else contact_limits.attempts+1 end,window_start=case when contact_limits.window_start<now()-interval '1 hour' then now() else contact_limits.window_start end returning attempts into n;return n<=5;end $$;
-- Media stays in a private bucket. Public media is streamed only if currently referenced by visible published data.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('portfolio','portfolio',false,26214400,array['image/jpeg','image/png','image/webp','application/pdf','video/mp4','text/csv','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/x-zip-compressed','application/octet-stream']);
create policy owner_storage on storage.objects for all to authenticated using(bucket_id='portfolio' and public.is_owner()) with check(bucket_id='portfolio' and public.is_owner());
create function public.public_media(media_id uuid) returns table(path text,mime text,name text) language plpgsql stable security definer set search_path=public as $$ declare snap jsonb;needle text;begin
snap=public.public_snapshot();needle='/api/media/'||media_id::text;
if position('"'||needle||'"' in snap::text)>0 then return query select m.path,m.mime,m.name from media m where m.id=media_id;end if;end $$;
revoke execute on function public.is_owner(),public.scope_visible(text,jsonb),public.record_visible(text,jsonb,jsonb),public.public_snapshot(),public.public_media(uuid),public.owner_snapshot(),public.save_site(jsonb,boolean),public.save_content(uuid,text,jsonb,text,boolean,text),public.clear_starter(int),public.contact_limit(text) from public;
grant execute on function public.is_owner() to authenticated;
grant execute on function public.public_snapshot(),public.public_media(uuid) to anon,authenticated;
grant execute on function public.owner_snapshot(),public.save_site(jsonb,boolean),public.save_content(uuid,text,jsonb,text,boolean,text),public.clear_starter(int) to authenticated;
grant execute on function public.scope_visible(text,jsonb),public.record_visible(text,jsonb,jsonb) to authenticated;
grant execute on function public.contact_limit(text) to service_role;
grant select,insert,update,delete on public.site_revisions,public.site_state,public.content_entries,public.content_revisions,public.media,public.enquiries to authenticated;
grant all on public.owners,public.site_revisions,public.site_state,public.content_entries,public.content_revisions,public.media,public.enquiries,public.contact_limits to service_role;

