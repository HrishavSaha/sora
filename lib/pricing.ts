import { createPublicClient } from "@/lib/supabase/server";

/**
 * Flat shipping fee, configured in Supabase (shipping_settings) rather than
 * hardcoded, so it can change without a redeploy. Public data — read with
 * the publishable key like the product catalog.
 */
export async function getShippingFee(): Promise<number> {
	const supabase = createPublicClient();
	const { data, error } = await supabase.from("shipping_settings").select("fee").eq("id", 1).single();

	if (error) throw new Error(`Failed to load shipping fee: ${error.message}`);
	return Number(data.fee);
}
