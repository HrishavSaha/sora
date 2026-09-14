import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import CheckoutSection from "@/components/checkout-section";
import Footer from "@/components/footer";
import { getShippingFee } from "@/lib/pricing";

export const metadata: Metadata = {
	title: "Checkout",
};

// Shipping fee comes from Supabase and can change at any time; without this,
// Next.js would prerender this page once at build time and keep serving
// whatever fee existed then.
export const dynamic = "force-dynamic";

export default async function Checkout() {
	const shippingFee = await getShippingFee();

	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			<CheckoutSection shippingFee={shippingFee} />
			<Footer />
		</div>
	);
}
