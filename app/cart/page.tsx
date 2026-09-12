import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import CartSection from "@/components/cart-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: "Cart",
};

export default function Cart() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			<CartSection />
			<Footer />
		</div>
	);
}
