-- Products expose their purchasable sizes; each order item stores the size
-- selected at checkout so historical orders remain accurate.
alter table products
	add column if not exists sizes text[] not null default array['XS', 'S', 'M', 'L', 'XL']::text[]
	check (cardinality(sizes) > 0 and sizes <@ array['XS', 'S', 'M', 'L', 'XL']::text[]);

alter table order_items
	add column if not exists size text;

-- Existing order rows predate size selection, so this remains nullable for
-- historical data. The checkout API requires a valid size for every new row.
alter table order_items
	add constraint order_items_size_check check (size is null or size in ('XS', 'S', 'M', 'L', 'XL'));
