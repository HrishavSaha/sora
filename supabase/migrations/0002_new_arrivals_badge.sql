-- Marks the products currently shown in the "New Arrivals" home page section
-- so the frontend can query for them instead of hardcoding the list.
update products
set badge = 'New'
where id in (
	'navy-flow-set',
	'black-charm-set',
	'brown-flow-shorts',
	'cream-charm-set',
	'black-flow-capris',
	'cream-charm-shorts'
);
