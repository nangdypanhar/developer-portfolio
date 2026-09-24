-- Habit tracker: habits + daily_logs, locked down per user with RLS.
-- Run this once in Supabase Dashboard → SQL Editor.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  -- Owner. Defaults to the caller so the client can't "forget" it, and the
  -- row disappears if the auth user is deleted.
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(trim(name)) > 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id          uuid primary key default gen_random_uuid(),
  -- ON DELETE CASCADE: deleting a habit deletes all of its logs.
  habit_id    uuid not null references public.habits (id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date    date not null default current_date,
  created_at  timestamptz not null default now(),
  -- A habit can only be checked off once per day.
  unique (habit_id, log_date)
);

create index if not exists habits_user_id_idx on public.habits (user_id);
create index if not exists daily_logs_user_id_idx on public.daily_logs (user_id);
create index if not exists daily_logs_habit_id_idx on public.daily_logs (habit_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- With RLS on and no matching policy, a query returns ZERO rows (not an
-- error) — that's why a second account sees an empty list.
-- ---------------------------------------------------------------------------

alter table public.habits enable row level security;
alter table public.daily_logs enable row level security;

-- habits ---------------------------------------------------------------------

drop policy if exists "Users can view their own habits" on public.habits;
create policy "Users can view their own habits"
  on public.habits for select
  to authenticated
  using (auth.uid() = user_id);            -- only rows I own are visible

drop policy if exists "Users can create their own habits" on public.habits;
create policy "Users can create their own habits"
  on public.habits for insert
  to authenticated
  with check (auth.uid() = user_id);       -- can't insert a row owned by someone else

drop policy if exists "Users can update their own habits" on public.habits;
create policy "Users can update their own habits"
  on public.habits for update
  to authenticated
  using (auth.uid() = user_id)             -- can only target my rows...
  with check (auth.uid() = user_id);       -- ...and can't hand them to another user

drop policy if exists "Users can delete their own habits" on public.habits;
create policy "Users can delete their own habits"
  on public.habits for delete
  to authenticated
  using (auth.uid() = user_id);

-- daily_logs -----------------------------------------------------------------

drop policy if exists "Users can view their own logs" on public.daily_logs;
create policy "Users can view their own logs"
  on public.daily_logs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create logs for their own habits" on public.daily_logs;
create policy "Users can create logs for their own habits"
  on public.daily_logs for insert
  to authenticated
  with check (
    auth.uid() = user_id
    -- and the habit being logged must also be mine (no logging on a stranger's habit id)
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update their own logs" on public.daily_logs;
create policy "Users can update their own logs"
  on public.daily_logs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete their own logs" on public.daily_logs;
create policy "Users can delete their own logs"
  on public.daily_logs for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed data
-- Habits need an owner, so this seeds the OLDEST account in auth.users.
-- Sign up in the app first, then run this block (it is safe to re-run).
-- The SQL editor runs as the postgres role, which bypasses RLS.
-- ---------------------------------------------------------------------------

do $$
declare
  seed_user uuid;
  h_water   uuid;
  h_read    uuid;
begin
  select id into seed_user from auth.users order by created_at limit 1;

  if seed_user is null then
    raise notice 'No users yet — sign up in the app, then re-run the seed block.';
    return;
  end if;

  if exists (select 1 from public.habits where user_id = seed_user) then
    raise notice 'Seed user already has habits — skipping seed.';
    return;
  end if;

  insert into public.habits (user_id, name) values (seed_user, 'Drink 8 glasses of water')
    returning id into h_water;
  insert into public.habits (user_id, name) values (seed_user, 'Read 20 pages')
    returning id into h_read;
  insert into public.habits (user_id, name, is_active) values (seed_user, 'Morning run', false);

  insert into public.daily_logs (habit_id, user_id, log_date) values
    (h_water, seed_user, current_date - 2),
    (h_water, seed_user, current_date - 1),
    (h_water, seed_user, current_date),
    (h_read,  seed_user, current_date - 1);
end $$;
