import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the secret key, which bypasses RLS.
 * Never import this from a Client Component or expose the key to the browser.
 * Reserved for checkout writes (orders/order_items) that RLS deliberately
 * blocks for everyone else.
 */
export function createServiceClient() {
	const url = process.env.SUPABASE_URL;
	const secretKey = process.env.SUPABASE_SECRET_KEY;

	if (!url || !secretKey) {
		throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables");
	}

	return createClient(url, secretKey, {
		auth: { autoRefreshToken: false, persistSession: false },
	});
}

/**
 * Server-only Supabase client using the publishable key, subject to RLS —
 * the same access level a browser client would have. Use this for reads that
 * are genuinely public (the product catalog), so a bug here can't do more
 * than the "Public can read active products" policy already allows.
 */
export function createPublicClient() {
	const url = process.env.SUPABASE_URL;
	const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

	if (!url || !publishableKey) {
		throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variables");
	}

	return createClient(url, publishableKey, {
		auth: { autoRefreshToken: false, persistSession: false },
	});
}
