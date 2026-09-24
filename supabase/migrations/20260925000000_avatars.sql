-- Avatars: a profiles table + a public "avatars" storage bucket where each
-- user can only write inside their own folder: avatars/<auth.uid()>/...
-- Run this once in Supabase Dashboard → SQL Editor.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  -- One row per auth user; the profile goes away with the account.
  id          uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  avatar_url  text,
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- avatars bucket
-- public = true  → anyone can READ files through the public URL (so <img>
--                  works without a signed URL). Writing is still governed by
--                  the policies below.
-- The size / MIME limits are enforced by Supabase itself, so a hostile client
-- that skips our React validation is still refused.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  1048576,                                                   -- 1 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif'] -- no SVG: it can carry scripts
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Storage policies (on storage.objects, shared by ALL buckets — so every
-- policy must pin bucket_id = 'avatars', or it would leak into other buckets).
--
-- storage.foldername('<uid>/avatar') returns {'<uid>'}; [1] is the top
-- folder. Requiring it to equal auth.uid() locks each user to their own folder.
--
-- upsert: true needs INSERT (first upload) + UPDATE (overwrite) + SELECT
-- (Storage checks whether the object already exists).
-- ---------------------------------------------------------------------------

drop policy if exists "Avatar: users can read their own folder" on storage.objects;
create policy "Avatar: users can read their own folder"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatar: users can upload into their own folder" on storage.objects;
create policy "Avatar: users can upload into their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatar: users can replace files in their own folder" on storage.objects;
create policy "Avatar: users can replace files in their own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatar: users can delete files in their own folder" on storage.objects;
create policy "Avatar: users can delete files in their own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
