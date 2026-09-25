"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PRODUCT_SIZES, type ProductSize, useCartStore } from "@/lib/cart-store";

export type Product = {
	id: string;
	name: string;
	price: number;
	image: string;
	badge?: string;
	sizes: string[];
};

export default function ProductCard({ id, name, price, image, badge, sizes }: Product) {
	const addItem = useCartStore((state) => state.addItem);
	const buyNow = useCartStore((state) => state.buyNow);
	const router = useRouter();
	const [justAdded, setJustAdded] = useState(false);
	const availableSizes = PRODUCT_SIZES.filter((size) => sizes.includes(size));
	const [selectedSize, setSelectedSize] = useState<ProductSize>(availableSizes[0] ?? "M");

	const handleAddToCart = () => {
		addItem({ id, name, price, image, size: selectedSize });
		setJustAdded(true);
		window.setTimeout(() => setJustAdded(false), 1500);
	};

	const handleBuyNow = () => {
		buyNow({ id, name, price, image, size: selectedSize });
		router.push("/checkout");
	};

	return (
		<article className="group">
			<div className="relative aspect-4/5 w-full">
				<div className="absolute inset-0 overflow-hidden rounded-2xl bg-secondary">
					<Image
						src={image}
						alt={name}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="scale-[1.02] object-cover transition-transform duration-500 group-hover:scale-[1.08]"
					/>
					{badge && (
						<span className="absolute left-4 top-4 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-montserrat uppercase tracking-wide text-primary">
							{badge}
						</span>
					)}
				</div>
				<span className="absolute -bottom-6 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent font-montserrat text-sm font-semibold text-secondary shadow-lg">
					${price}
				</span>
			</div>
			<div className="pt-10 pb-2">
				<h3 className="font-montserrat text-base font-medium leading-snug text-primary">
					{name}
				</h3>
				<fieldset className="mt-4">
					<legend className="font-montserrat text-[11px] uppercase tracking-wide text-primary/70">
						Size: {selectedSize}
					</legend>
					<div className="mt-2 flex gap-1.5" role="radiogroup" aria-label={`Select size for ${name}`}>
						{availableSizes.map((size) => (
							<button
								key={size}
								type="button"
								role="radio"
								aria-checked={selectedSize === size}
								onClick={() => setSelectedSize(size)}
								className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-1.5 font-montserrat text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
									selectedSize === size
										? "border-primary bg-primary text-secondary"
										: "border-primary/35 text-primary hover:border-primary"
								}`}
							>
								{size}
							</button>
						))}
					</div>
				</fieldset>
				<div className="mt-4 flex items-center gap-2">
					<button
						type="button"
						onClick={handleAddToCart}
						aria-label={justAdded ? `${name} added to cart` : `Add ${name} to cart`}
						className={`flex-1 whitespace-nowrap rounded-full border px-4 py-1.5 font-montserrat text-xs uppercase tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
							justAdded
								? "border-accent bg-accent text-secondary"
								: "border-primary text-primary hover:bg-primary hover:text-secondary"
						}`}
					>
						{justAdded ? "Added ✓" : "Add to cart"}
					</button>
					<button
						type="button"
						onClick={handleBuyNow}
						aria-label={`Buy ${name} now`}
						className="flex-1 whitespace-nowrap rounded-full border border-primary bg-primary px-4 py-1.5 font-montserrat text-xs uppercase tracking-wide text-secondary transition-colors duration-300 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
					>
						Buy now
					</button>
				</div>
			</div>
		</article>
	);
}
