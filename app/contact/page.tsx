import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ContactHero from "@/components/contact-hero";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: "Contact",
};

export default function Contact() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="transparent" />
			<ContactHero />
			<Footer />
		</div>
	);
}
