-- Lets the canceled Checkout redirect identify its pending order without
-- exposing a Stripe session ID in the URL.
alter table orders add column if not exists checkout_reference uuid unique;
