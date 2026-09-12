import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import AboutIntro from "@/components/about-intro";
import TestimonialsIntro from "@/components/testimonials-intro";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: "About",
};

export default function About() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar variant="solid" />
			<AboutIntro />
			<TestimonialsIntro />
			<TestimonialsCarousel />
			<Footer />
		</div>
	);
}
