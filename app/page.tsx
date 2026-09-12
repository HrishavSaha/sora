import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import BrandStatement from "@/components/brand-statement"
import NewArrivals from "@/components/new-arrivals"
import Footer from "@/components/footer"

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
