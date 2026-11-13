-- SaborLab — schema inicial
create extension if not exists pgcrypto;

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image','text')),
  title text not null check (char_length(title) between 1 and 120),
  subject text not null check (char_length(subject) between 1 and 40),
  description text check (description is null or char_length(description) <= 500),
  body text,
  image_path text,
  source text not null check (char_length(source) between 3 and 300),
  license text not null default 'CC BY-SA 4.0',
  author_name text check (author_name is null or char_length(author_name) <= 80),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  constraint material_content check (
    (kind = 'image' and image_path is not null and body is null) or
    (kind = 'text' and body is not null and image_path is null)
  )
);

create table public.layouts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  subject text not null check (char_length(subject) between 1 and 40),
  data jsonb not null,
  author_name text check (author_name is null or char_length(author_name) <= 80),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('material','layout')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 500),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  resolved boolean not null default false
);

create index materials_created_idx on public.materials (created_at desc);
create index materials_subject_idx on public.materials (subject);
create index layouts_created_idx on public.layouts (created_at desc);
create index reports_open_idx on public.reports (created_at desc) where not resolved;

alter table public.materials enable row level security;
alter table public.layouts enable row level security;
alter table public.reports enable row level security;

create policy "materials_leitura_publica" on public.materials
  for select using (true);
create policy "materials_insercao_autenticada" on public.materials
  for insert to authenticated with check (created_by = auth.uid());
create policy "materials_exclusao_autor" on public.materials
  for delete to authenticated using (created_by = auth.uid());

create policy "layouts_leitura_publica" on public.layouts
  for select using (true);
create policy "layouts_insercao_autenticada" on public.layouts
  for insert to authenticated with check (created_by = auth.uid());
create policy "layouts_exclusao_autor" on public.layouts
  for delete to authenticated using (created_by = auth.uid());

create policy "reports_insercao_autenticada" on public.reports
  for insert to authenticated with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('materials','materials', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do update set public = true;

create policy "storage_leitura_publica" on storage.objects
  for select using (bucket_id = 'materials');
create policy "storage_upload_autor" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'materials' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "storage_exclusao_autor" on storage.objects
  for delete to authenticated
  using (bucket_id = 'materials' and (storage.foldername(name))[1] = auth.uid()::text);
