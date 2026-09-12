import Image from "next/image";
import Link from "next/link";
import ProductCard, { type Product } from "@/components/product-card";

const products: Product[] = [
	{ name: "Navy Flow Set", price: 72, image: "/product-images/sora-flow-set-navy.png", badge: "New" },
	{ name: "Black Charm Set", price: 64, image: "/product-images/sora-charm-set-black.png", badge: "New" },
	{ name: "Brown Flow Shorts", price: 52, image: "/product-images/sora-flow-set-brown-shorts.png", badge: "New" },
	{ name: "Cream Charm Set", price: 64, image: "/product-images/sora-charm-set-white.png", badge: "New" },
	{ name: "Black Flow Capris", price: 58, image: "/product-images/sora-flow-set-black.png", badge: "New" },
	{ name: "Cream Charm Shorts", price: 48, image: "/product-images/sora-charm-set-white-shorts.png", badge: "New" },
];

export default function NewArrivals() {
	return (
		<section className="relative overflow-hidden bg-secondary px-6 py-28 md:px-12 md:py-40">
			<Image
				src="/sora-logo.png"
				alt=""
				aria-hidden="true"
				width={1103}
				height={641}
				className="pointer-events-none absolute left-1/2 top-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.06] sm:w-[110%] md:w-[85%]"
			/>
			<div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
				<h2 className="font-serif text-4xl italic leading-[1.1] text-primary md:text-5xl">
					New Arrivals
				</h2>
				<Link
					href="/shop"
					className="rounded-sm font-montserrat text-xs uppercase tracking-[0.15em] text-primary/70 underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
				>
					View all
				</Link>
			</div>
			<div className="relative mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product) => (
					<ProductCard key={product.name} {...product} />
				))}
			</div>
		</section>
	);
}
