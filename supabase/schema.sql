create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  brand text,
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2),
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}',
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  is_featured boolean not null default false,
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'demo_paid' check (payment_status in ('demo_paid', 'refunded')),
  total numeric(12,2) not null,
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity integer not null check (quantity > 0),
  price numeric(12,2) not null
);

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table if not exists public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists products_updated_at on public.products;
drop trigger if exists orders_updated_at on public.orders;
drop trigger if exists cart_items_updated_at on public.cart_items;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger cart_items_updated_at before update on public.cart_items for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Customer'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.refresh_product_rating()
returns trigger as $$
begin
  update public.products
  set rating = coalesce((select avg(rating)::numeric(3,2) from public.reviews where product_id = coalesce(new.product_id, old.product_id)), 0),
      review_count = (select count(*) from public.reviews where product_id = coalesce(new.product_id, old.product_id))
  where id = coalesce(new.product_id, old.product_id);
  return coalesce(new, old);
end;
$$ language plpgsql;

drop trigger if exists reviews_refresh_rating_insert on public.reviews;
drop trigger if exists reviews_refresh_rating_update on public.reviews;
drop trigger if exists reviews_refresh_rating_delete on public.reviews;

create trigger reviews_refresh_rating_insert after insert on public.reviews for each row execute function public.refresh_product_rating();
create trigger reviews_refresh_rating_update after update on public.reviews for each row execute function public.refresh_product_rating();
create trigger reviews_refresh_rating_delete after delete on public.reviews for each row execute function public.refresh_product_rating();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "Public categories readable" on public.categories;
drop policy if exists "Public products readable" on public.products;
drop policy if exists "Public reviews readable" on public.reviews;
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Users own orders" on public.orders;
drop policy if exists "Users own order items" on public.order_items;
drop policy if exists "Users manage own reviews" on public.reviews;
drop policy if exists "Users manage own wishlist" on public.wishlist;
drop policy if exists "Users manage own cart" on public.cart_items;

create policy "Public categories readable" on public.categories for select using (true);
create policy "Public products readable" on public.products for select using (true);
create policy "Public reviews readable" on public.reviews for select using (true);

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

create policy "Users manage own reviews" on public.reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own wishlist" on public.wishlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own cart" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_search_idx on public.products using gin (to_tsvector('simple', name || ' ' || description || ' ' || coalesce(brand, '')));
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists reviews_product_id_idx on public.reviews(product_id);
