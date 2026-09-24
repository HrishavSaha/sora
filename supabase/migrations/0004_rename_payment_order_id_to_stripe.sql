-- Align an existing deployment with the Stripe checkout schema. Fresh
-- deployments receive stripe_order_id directly from 0001_init.sql.
alter table orders rename column paypal_order_id to stripe_order_id;
