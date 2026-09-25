import { createPublicClient, createServiceClient } from "@/lib/supabase/server";

export type Product = {
	id: string;
	name: string;
	price: number;
	image: string;
	sizes: string[];
};

export type CatalogProduct = Product & { category: string; badge?: string };

/**
 * Fetches the full public catalog for the storefront (shop grid, new
 * arrivals, etc). Uses the publishable key since this is genuinely public
 * data — RLS's "Public can read active products" policy already limits it
 * to active rows.
 */
export async function getActiveProducts(): Promise<CatalogProduct[]> {
	const supabase = createPublicClient();
	const { data, error } = await supabase
		.from("products")
		.select("id, name, price, image, category, badge, sizes")
		.eq("active", true)
		.order("created_at", { ascending: true });

	if (error) throw new Error(`Failed to load products: ${error.message}`);

	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		price: Number(row.price),
		image: row.image,
		sizes: row.sizes,
		category: row.category,
		badge: row.badge ?? undefined,
	}));
}

/**
 * Fetches the given product ids from the source of truth (Supabase), ignoring
 * anything inactive or unknown. Callers must treat a missing id as invalid
 * input rather than silently skipping it, since prices must never be trusted
 * from the client.
 */
export async function getActiveProductsByIds(ids: string[]): Promise<Product[]> {
	if (ids.length === 0) return [];

	const supabase = createServiceClient();
	const { data, error } = await supabase
		.from("products")
		.select("id, name, price, image, sizes")
		.eq("active", true)
		.in("id", ids);

	if (error) throw new Error(`Failed to load products: ${error.message}`);

	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		price: Number(row.price),
		image: row.image,
		sizes: row.sizes,
	}));
}
