"use client";

import { useState } from "react";
import ProductCard, { type Product } from "@/components/product-card";

type Category = "flow" | "charm";

const products: (Product & { category: Category })[] = [
	{ name: "Navy Flow Set", price: 72, image: "/product-images/sora-flow-set-navy.png", category: "flow" },
	{ name: "Black Charm Set", price: 64, image: "/product-images/sora-charm-set-black.png", category: "charm" },
	{
		name: "Brown Flow Shorts",
		price: 52,
		image: "/product-images/sora-flow-set-brown-shorts.png",
		category: "flow",
	},
	{ name: "Cream Charm Set", price: 64, image: "/product-images/sora-charm-set-white.png", category: "charm" },
	{ name: "Black Flow Capris", price: 58, image: "/product-images/sora-flow-set-black.png", category: "flow" },
	{
		name: "Cream Charm Shorts",
		price: 48,
		image: "/product-images/sora-charm-set-white-shorts.png",
		category: "charm",
	},
	{ name: "Brown Flow Set", price: 72, image: "/product-images/sora-flow-set-brown.png", category: "flow" },
	{
		name: "Cream Charm Capris",
		price: 56,
		image: "/product-images/sora-charm-set-white-capri.png",
		category: "charm",
	},
];

const filters: { label: string; value: Category | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Flow", value: "flow" },
	{ label: "Charm", value: "charm" },
];

export default function ShopCatalog() {
	const [active, setActive] = useState<Category | "all">("all");
	const visible = active === "all" ? products : products.filter((product) => product.category === active);

	return (
		<section className="bg-secondary px-6 py-24 md:px-12 md:py-32">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<h2 className="font-serif text-4xl italic leading-[1.1] text-primary md:text-5xl">
						Shop All
					</h2>
					<div className="flex gap-3" role="group" aria-label="Filter products by collection">
						{filters.map((filter) => (
							<button
								key={filter.value}
								type="button"
								onClick={() => setActive(filter.value)}
								aria-pressed={active === filter.value}
								className={`rounded-full px-5 py-2 font-montserrat text-xs uppercase tracking-[0.15em] transition-colors duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
									active === filter.value
										? "bg-primary text-secondary"
										: "border border-primary/30 text-primary/80 hover:border-primary/50 hover:text-primary"
								}`}
							>
								{filter.label}
							</button>
						))}
					</div>
				</div>

				<div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
					{visible.map((product) => (
						<ProductCard key={product.name} {...product} />
					))}
				</div>
			</div>
		</section>
	);
}
