"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { SHIPPING_FEE } from "@/lib/pricing";

export default function CartSection() {
	const items = useCartStore((state) => state.items);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const removeItem = useCartStore((state) => state.removeItem);
	const [promoCode, setPromoCode] = useState("");

	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shipping = items.length > 0 ? SHIPPING_FEE : 0;
	const total = subtotal + shipping;

	return (
		<section className="bg-accent px-6 py-20 md:px-12 md:py-28">
			<div className="mx-auto max-w-6xl">
				<div className="flex items-center gap-8">
					<h1 className="font-montserrat text-4xl font-bold uppercase tracking-tight text-secondary md:text-5xl">
						Cart
					</h1>
					<div className="h-px flex-1 bg-secondary/50" />
				</div>

				{items.length === 0 ? (
					<div className="mt-16 flex flex-col items-start gap-6">
						<p className="text-secondary/70">Your cart is empty.</p>
						<Link
							href="/shop"
							className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-primary transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
						<div>
							<p className="font-montserrat text-xs uppercase tracking-[0.2em] text-secondary/70">
								Products
							</p>
							<ul className="mt-6 divide-y divide-secondary/20">
								{items.map((item) => (
									<li key={item.id} className="flex gap-5 py-6">
										<div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
											<Image
												src={item.image}
												alt={item.name}
												fill
												sizes="96px"
												className="object-cover"
											/>
										</div>
										<div className="flex flex-1 flex-col justify-between gap-3">
											<div>
												<h3 className="font-montserrat text-lg font-bold uppercase leading-snug text-secondary">
													{item.name}
												</h3>
												{item.variant && (
													<p className="mt-1 text-xs uppercase tracking-wide text-secondary/70">
														{item.variant}
													</p>
												)}
											</div>
											<div className="flex items-center justify-between gap-3">
												<div className="flex items-center gap-3">
													<button
														type="button"
														onClick={() => updateQuantity(item.id, -1)}
														aria-label={`Decrease quantity of ${item.name}`}
														className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-secondary/50 text-secondary transition-colors hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
													>
														&minus;
													</button>
													<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-montserrat text-sm font-semibold text-accent">
														{item.quantity}
													</span>
													<button
														type="button"
														onClick={() => updateQuantity(item.id, 1)}
														aria-label={`Increase quantity of ${item.name}`}
														className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-secondary/50 text-secondary transition-colors hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
													>
														+
													</button>
												</div>
												<span className="font-montserrat text-base font-semibold text-secondary">
													${item.price * item.quantity}
												</span>
											</div>
											<button
												type="button"
												onClick={() => removeItem(item.id)}
												className="w-fit rounded-sm font-montserrat text-xs uppercase tracking-wide text-secondary/70 underline decoration-secondary/40 underline-offset-4 transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
											>
												Remove
											</button>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="h-fit rounded-3xl bg-secondary p-8">
							<div className="rounded-full bg-accent px-6 py-3 text-center font-montserrat text-lg font-bold uppercase tracking-wide text-secondary">
								Your Order
							</div>
							<dl className="mt-6 space-y-3 font-montserrat text-sm text-primary">
								<div className="flex items-center justify-between">
									<dt>Subtotal</dt>
									<dd>${subtotal}</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt>Shipping Fee</dt>
									<dd>${shipping}</dd>
								</div>
							</dl>
							<div className="mt-4 flex items-center justify-between border-t border-primary/20 pt-4">
								<span className="font-montserrat text-xl font-bold uppercase text-primary">
									Total
								</span>
								<span className="font-montserrat text-xl font-bold text-primary">${total}</span>
							</div>
							<label htmlFor="promo-code" className="sr-only">
								Promo code
							</label>
							<input
								id="promo-code"
								type="text"
								value={promoCode}
								onChange={(event) => setPromoCode(event.target.value)}
								placeholder="Enter a promo code"
								className="mt-6 w-full border-b border-primary/30 bg-transparent pb-2 text-sm text-primary outline-none placeholder:text-primary/60 focus:border-accent"
							/>
							<Link
								href="/checkout"
								className="mt-8 flex w-full items-center justify-center rounded-full bg-primary px-8 py-3 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
							>
								Check Out
							</Link>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
