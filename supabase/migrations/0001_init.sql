-- Products, orders, and order line items for the Sora Wear PayPal checkout.
--
-- The app talks to Supabase using the secret key from a Next.js Route
-- Handler only (never the browser), which bypasses RLS. RLS is still left
-- enabled on every table as a safety net: if the publishable key were ever
-- used against these tables by mistake, the default-deny behavior (no
-- policies beyond the public product catalog read) blocks it instead of
-- silently exposing customer data.
--
-- Safe to paste into the Supabase SQL editor whether or not an earlier draft
-- of this migration was already run — the drops below are no-ops otherwise.

create table if not exists products (
	id text primary key,
	name text not null,
	category text not null,
	price numeric(10, 2) not null check (price >= 0),
	image text not null,
	badge text,
	active boolean not null default true,
	created_at timestamptz not null default now()
);

create table if not exists orders (
	id uuid primary key default gen_random_uuid(),
	paypal_order_id text not null unique,
	status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
	subtotal numeric(10, 2) not null,
	shipping numeric(10, 2) not null,
	total numeric(10, 2) not null,
	customer_name text not null,
	customer_email text not null,
	shipping_street text not null,
	shipping_place text not null,
	shipping_number text not null,
	shipping_postcode text not null,
	shipping_country text not null,
	payer_email text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists order_items (
	id uuid primary key default gen_random_uuid(),
	order_id uuid not null references orders (id) on delete cascade,
	product_id text not null references products (id),
	name text not null,
	unit_price numeric(10, 2) not null,
	quantity integer not null check (quantity > 0)
);

create index if not exists order_items_order_id_idx on order_items (order_id);

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Drop objects from an earlier draft of this migration (written before this
-- project had a secret key, when the app had to write through RLS policies
-- and a SECURITY DEFINER function). No-ops if they were never created.
drop policy if exists "Anyone can create a pending order" on orders;
drop policy if exists "Anyone can add items to a pending order" on order_items;
drop function if exists capture_order_result(text, text, text);
drop function if exists is_pending_order(uuid);

-- Products are public catalog data; anyone can read active products.
drop policy if exists "Public can read active products" on products;
create policy "Public can read active products" on products
	for select using (active = true);
grant select on products to anon, authenticated;

-- Orders and order_items are only ever written/read by the server (the
-- secret key bypasses RLS), so no policies are defined for them — the
-- default-deny behavior of RLS-with-no-policies is exactly what we want.

insert into products (id, name, category, price, image) values
	('navy-flow-set', 'Navy Flow Set', 'flow', 72, '/product-images/sora-flow-set-navy.png'),
	('black-charm-set', 'Black Charm Set', 'charm', 64, '/product-images/sora-charm-set-black.png'),
	('brown-flow-shorts', 'Brown Flow Shorts', 'flow', 52, '/product-images/sora-flow-set-brown-shorts.png'),
	('cream-charm-set', 'Cream Charm Set', 'charm', 64, '/product-images/sora-charm-set-white.png'),
	('black-flow-capris', 'Black Flow Capris', 'flow', 58, '/product-images/sora-flow-set-black.png'),
	('cream-charm-shorts', 'Cream Charm Shorts', 'charm', 48, '/product-images/sora-charm-set-white-shorts.png'),
	('brown-flow-set', 'Brown Flow Set', 'flow', 72, '/product-images/sora-flow-set-brown.png'),
	('cream-charm-capris', 'Cream Charm Capris', 'charm', 56, '/product-images/sora-charm-set-white-capri.png')
on conflict (id) do nothing;
