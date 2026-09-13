"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import type { CatalogProduct } from "@/lib/products";

export default function ShopHero({ product }: { product: CatalogProduct }) {
	const addItem = useCartStore((state) => state.addItem);
	const [justAdded, setJustAdded] = useState(false);

	const handleAddToCart = () => {
		addItem(product);
		setJustAdded(true);
		window.setTimeout(() => setJustAdded(false), 1500);
	};

	return (
		<section className="grid md:min-h-[80vh] md:grid-cols-2">
			<div className="relative min-h-[60vh] bg-secondary md:min-h-full">
				<Image
					src={product.image}
					alt={`Model wearing the ${product.name}`}
					fill
					priority
					sizes="(min-width: 768px) 50vw, 100vw"
					className="object-cover"
				/>
			</div>

			<div className="flex flex-col justify-center bg-primary px-8 py-16 md:px-16">
				<Image
					src="/sora-logo.png"
					alt="Sora Wear"
					width={140}
					height={82}
					className="h-12 w-auto self-start brightness-0 invert"
				/>
				<p className="mt-10 font-montserrat text-xs uppercase tracking-[0.2em] text-secondary/75">
					Flow Collection
				</p>
				<h1 className="mt-3 font-montserrat text-4xl font-bold uppercase leading-tight tracking-tight text-secondary md:text-5xl">
					{product.name}
				</h1>
				<div className="mt-6 border-y border-secondary/50 py-4">
					<span className="font-montserrat text-2xl font-semibold text-secondary">
						${product.price}
					</span>
				</div>
				<p className="mt-6 max-w-sm text-sm leading-relaxed text-secondary/80 md:text-base">
					Cropped-length leggings with a striped foldover waistband. Soft, breathable
					fabric that moves with you through every pose.
				</p>
				<button
					type="button"
					onClick={handleAddToCart}
					className={`mt-10 inline-flex w-fit items-center justify-center rounded-full px-8 py-3 font-montserrat text-sm font-medium uppercase tracking-[0.15em] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
						justAdded ? "bg-accent text-secondary" : "bg-secondary text-primary"
					}`}
				>
					{justAdded ? "Added to Cart ✓" : "Add to Cart"}
				</button>
			</div>
		</section>
	);
}
