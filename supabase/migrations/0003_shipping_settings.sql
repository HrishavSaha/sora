-- Single-row shipping configuration, replacing the hardcoded SHIPPING_FEE
-- constant. Read publicly (it's just a displayed number, not sensitive) and
-- written only by hand in the SQL editor for now — there's no admin UI yet.
create table if not exists shipping_settings (
	id int primary key default 1,
	fee numeric(10, 2) not null default 0 check (fee >= 0),
	check (id = 1)
);

alter table shipping_settings enable row level security;

drop policy if exists "Public can read shipping settings" on shipping_settings;
create policy "Public can read shipping settings" on shipping_settings
	for select using (true);
grant select on shipping_settings to anon, authenticated;

-- Free shipping for now.
insert into shipping_settings (id, fee) values (1, 0)
on conflict (id) do update set fee = excluded.fee;
