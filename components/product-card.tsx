"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

export type Product = {
	id: string;
	name: string;
	price: number;
	image: string;
	badge?: string;
};

export default function ProductCard({ id, name, price, image, badge }: Product) {
	const addItem = useCartStore((state) => state.addItem);
	const buyNow = useCartStore((state) => state.buyNow);
	const router = useRouter();
	const [justAdded, setJustAdded] = useState(false);

	const handleAddToCart = () => {
		addItem({ id, name, price, image });
		setJustAdded(true);
		window.setTimeout(() => setJustAdded(false), 1500);
	};

	const handleBuyNow = () => {
		buyNow({ id, name, price, image });
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
