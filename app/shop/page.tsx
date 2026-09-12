import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ShopHero from "@/components/shop-hero";
import ShopCatalog from "@/components/shop-catalog";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: "Shop",
};

export default function Shop() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			<ShopHero />
			<ShopCatalog />
			<Footer />
		</div>
	);
}
