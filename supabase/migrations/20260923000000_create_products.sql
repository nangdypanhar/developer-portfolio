-- Products table, replacing the static public/products.json.
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists public.products (
  id          text primary key default gen_random_uuid()::text,
  name        text not null check (char_length(name) > 0),
  price       numeric(10, 2) not null check (price >= 0),
  in_stock    boolean not null default true,
  on_sale     boolean not null default false,
  cost_price  numeric(10, 2) not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone (signed in or not) can browse the catalog.
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Only signed-in users can add products.
drop policy if exists "Signed-in users can add products" on public.products;
create policy "Signed-in users can add products"
  on public.products for insert
  to authenticated
  with check (true);

-- Seed with the original sample data.
insert into public.products (id, name, price, in_stock, on_sale, cost_price) values
  ('p1', 'Mechanical Keyboard', 89,  true,  true,  53.4),
  ('p2', 'Wireless Mouse',      29,  true,  false, 14.5),
  ('p3', '27" Monitor',         249, false, false, 165),
  ('p4', 'USB-C Dock',          59,  true,  true,  32),
  ('p5', 'Webcam 1080p',        39,  false, false, 21),
  ('p6', 'Desk Lamp',           19,  true,  false, 9)
on conflict (id) do nothing;
