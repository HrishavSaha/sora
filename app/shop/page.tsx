import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ShopHero from "@/components/shop-hero";
import ShopCatalog from "@/components/shop-catalog";
import Footer from "@/components/footer";
import { getActiveProducts } from "@/lib/products";

export const metadata: Metadata = {
	title: "Shop",
};

export default async function Shop() {
	const products = await getActiveProducts();

	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			<ShopHero />
			<ShopCatalog products={products} />
			<Footer />
		</div>
	);
}
