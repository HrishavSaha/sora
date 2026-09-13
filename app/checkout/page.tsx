import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import CheckoutSection from "@/components/checkout-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: "Checkout",
};

export default function Checkout() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			<CheckoutSection />
			<Footer />
		</div>
	);
}
