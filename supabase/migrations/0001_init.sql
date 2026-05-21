-- Trove Cellar — initial schema
-- Apply with: supabase db push  (or run via SQL editor on supabase.com)

create extension if not exists "pgcrypto";

-- ============================================================
-- distilleries — global master list
-- ============================================================
create table if not exists distilleries (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  name_ko       text,
  country       text not null,
  region        text,                       -- Speyside | Islay | Highlands | …
  founded_year  int,
  description    text,
  description_ko text,
  created_at    timestamptz default now()
);

create index if not exists distilleries_region_idx on distilleries(region);

-- ============================================================
-- bottles — global catalog of whisky bottlings
-- ============================================================
create table if not exists bottles (
  id              uuid primary key default gen_random_uuid(),
  distillery_id   uuid not null references distilleries(id) on delete restrict,
  name            text not null,            -- "18 Year Old"
  full_name       text not null,            -- "Glenfiddich 18"
  age_years       int,                      -- NULL = NAS
  abv             numeric(4,1),
  cask_type       text,
  expression      text,
  expression_ko   text,
  bottle_style    text not null check (bottle_style in ('malt','islay','japan','bourbon','highland')),
  image_url       text,
  msrp_krw        int,
  created_at      timestamptz default now()
);

create index if not exists bottles_distillery_idx on bottles(distillery_id);

-- ============================================================
-- user_bottles — bottles a user owns / has owned
-- ============================================================
create table if not exists user_bottles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  bottle_id           uuid not null references bottles(id),
  acquired_at         timestamptz default now(),
  acquired_price_krw  int,
  notes               text,
  is_finished         boolean default false,
  finished_at         timestamptz,
  shelf_position      int,
  is_public           boolean default false,
  created_at          timestamptz default now()
);

create unique index if not exists user_bottles_unique on user_bottles(user_id, bottle_id);
create index if not exists user_bottles_user_idx on user_bottles(user_id, acquired_at desc);

-- ============================================================
-- tastings — one entry per sit-down
-- ============================================================
create table if not exists tastings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  bottle_id       uuid not null references bottles(id),
  user_bottle_id  uuid references user_bottles(id) on delete set null,
  tasted_at       timestamptz not null default now(),
  nose            text,
  palate          text,
  finish          text,
  rating          int check (rating between 1 and 100),
  rating_stars    int check (rating_stars between 1 and 5),
  setting         text,                      -- "혼자" | "친구와" | "위스키 동호회"
  paired_with     text,
  card_url        text,                      -- pre-rendered share card
  is_public       boolean default false,
  created_at      timestamptz default now()
);

create index if not exists tastings_bottle_idx on tastings(bottle_id);
create index if not exists tastings_user_idx   on tastings(user_id, tasted_at desc);

-- ============================================================
-- wishlist — bottles a user wants next
-- ============================================================
create table if not exists wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  bottle_id   uuid not null references bottles(id),
  priority    int default 0,
  notes       text,
  added_at    timestamptz default now()
);

create unique index if not exists wishlist_unique on wishlist(user_id, bottle_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table distilleries enable row level security;
alter table bottles      enable row level security;
alter table user_bottles enable row level security;
alter table tastings     enable row level security;
alter table wishlist     enable row level security;

drop policy if exists "distilleries readable" on distilleries;
drop policy if exists "bottles readable"      on bottles;
drop policy if exists "own user_bottles"      on user_bottles;
drop policy if exists "public user_bottles readable" on user_bottles;
drop policy if exists "own tastings"          on tastings;
drop policy if exists "public tastings readable"     on tastings;
drop policy if exists "own wishlist"          on wishlist;

create policy "distilleries readable" on distilleries for select using (true);
create policy "bottles readable"      on bottles      for select using (true);

create policy "own user_bottles" on user_bottles for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public user_bottles readable" on user_bottles for select
  using (is_public = true);

create policy "own tastings" on tastings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public tastings readable" on tastings for select
  using (is_public = true);

create policy "own wishlist" on wishlist for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
