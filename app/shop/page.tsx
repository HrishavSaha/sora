import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ShopHero from "@/components/shop-hero";
import ShopCatalog from "@/components/shop-catalog";
import Footer from "@/components/footer";
import { getActiveProducts } from "@/lib/products";

export const metadata: Metadata = {
	title: "Shop",
};

// Product prices come from Supabase and can change at any time; without this,
// Next.js would prerender this page once at build time and keep serving
// whatever prices existed then.
export const dynamic = "force-dynamic";

export default async function Shop() {
	const products = await getActiveProducts();
	const featured = products.find((product) => product.id === "black-flow-capris") ?? products[0];

	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			{featured && <ShopHero product={featured} />}
			<ShopCatalog products={products} />
			<Footer />
		</div>
	);
}
