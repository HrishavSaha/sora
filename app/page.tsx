import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import BrandStatement from "@/components/brand-statement"
import NewArrivals from "@/components/new-arrivals"
import Footer from "@/components/footer"

// New Arrivals prices come from Supabase and can change at any time; without
// this, Next.js would prerender this page once at build time and keep
// serving whatever prices existed then.
export const dynamic = "force-dynamic"

export default function Home() {
	return(
		<div className="relative min-h-screen flex flex-col">
			<Navbar variant="transparent" />
			<Hero />
			<BrandStatement />
			<NewArrivals />
			<Footer />
		</div>
	)
}
