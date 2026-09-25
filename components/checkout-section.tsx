"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import {
	getApiErrorMessage,
	getCheckoutSessionUrl,
	type CheckoutSessionRequest,
} from "@/lib/checkout";

type Status = "idle" | "processing" | "success" | "error";

type FormState = {
	name: string;
	email: string;
	street: string;
	place: string;
	number: string;
	postcode: string;
	country: string;
};

const initialForm: FormState = {
	name: "",
	email: "",
	street: "",
	place: "",
	number: "",
	postcode: "",
	country: "",
};

const pillInput =
	"w-full rounded-full border border-primary/20 bg-white px-5 py-3 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent";
const cardShell = "rounded-4xl border border-primary/15 bg-white/50 p-8 md:p-9";
const cardTitle = "font-serif text-2xl italic text-primary";
const cardSubtext = "mt-1 text-sm text-primary/60";
const fieldLabel = "sr-only";

export default function CheckoutSection({ shippingFee }: { shippingFee: number }) {
	const items = useCartStore((state) => state.items);
	const clearCart = useCartStore((state) => state.clearCart);
	const [form, setForm] = useState<FormState>(initialForm);
	const [status, setStatus] = useState<Status>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shipping = items.length > 0 ? shippingFee : 0;
	const total = subtotal + shipping;

	const isContactValid = form.name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(form.email);
	const isShippingValid =
		form.street.trim().length > 0 &&
		form.place.trim().length > 0 &&
		form.number.trim().length > 0 &&
		form.postcode.trim().length > 0 &&
		form.country.trim().length > 0;

	const canPay = isContactValid && isShippingValid;

	const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, [field]: event.target.value }));

	const handleCheckout = async () => {
		const cartItems = items;
		setStatus("processing");
		setErrorMessage("");

		try {
			const checkoutPayload: CheckoutSessionRequest = {
				items: cartItems.map(({ id, size, quantity }) => ({ id, size, quantity })),
				contact: { name: form.name, email: form.email },
				shipping: {
					street: form.street,
					place: form.place,
					number: form.number,
					postcode: form.postcode,
					country: form.country,
				},
			};

      const response = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
				body: JSON.stringify(checkoutPayload),
      });

			const data: unknown = await response.json().catch(() => null);
			if (!response.ok) throw new Error(getApiErrorMessage(data) ?? "Checkout failed");

			const checkoutUrl = getCheckoutSessionUrl(data);
			if (!checkoutUrl) throw new Error("Checkout service returned an invalid payment URL");

			clearCart();
			window.location.assign(checkoutUrl);
    } catch (err) {
			setStatus("error");
			setErrorMessage(err instanceof Error ? err.message : "Checkout failed");
    }
	}

	if (items.length === 0) {
		return (
			<section className="bg-secondary px-6 py-20 md:px-12 md:py-28">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-primary/70">Your cart is empty.</p>
					<Link
						href="/shop"
						className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
					>
						Continue Shopping
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-secondary px-6 py-20 md:px-12 md:py-28">
			<div className="mx-auto max-w-6xl">
				<div className="flex items-center gap-8">
					<h1 className="font-montserrat text-4xl font-bold uppercase tracking-tight text-primary md:text-5xl">
						Checkout
					</h1>
					<div className="h-px flex-1 bg-primary/20" />
				</div>

				<div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
					<div className="flex flex-col gap-8">
						<div className={cardShell}>
							<h2 className={cardTitle}>Contact Info</h2>
							<p className={cardSubtext}>We&apos;ll use this to send your order confirmation.</p>
							<div className="mt-6 flex flex-col gap-4">
								<label htmlFor="checkout-name" className={fieldLabel}>
									Full name
								</label>
								<input
									id="checkout-name"
									type="text"
									autoComplete="name"
									placeholder="Name"
									value={form.name}
									onChange={updateField("name")}
									className={pillInput}
								/>
								<label htmlFor="checkout-email" className={fieldLabel}>
									Email
								</label>
								<input
									id="checkout-email"
									type="email"
									autoComplete="email"
									placeholder="Email"
									value={form.email}
									onChange={updateField("email")}
									className={pillInput}
								/>
							</div>
						</div>

						<div className={cardShell}>
							<h2 className={cardTitle}>Shipping Address</h2>
							<p className={cardSubtext}>Where should we send your order?</p>
							<div className="mt-6 flex flex-col gap-4">
								<label htmlFor="checkout-street" className={fieldLabel}>
									Street
								</label>
								<input
									id="checkout-street"
									type="text"
									autoComplete="address-line1"
									placeholder="Street"
									value={form.street}
									onChange={updateField("street")}
									className={pillInput}
								/>
								<label htmlFor="checkout-place" className={fieldLabel}>
									City
								</label>
								<input
									id="checkout-place"
									type="text"
									autoComplete="address-level2"
									placeholder="City"
									value={form.place}
									onChange={updateField("place")}
									className={pillInput}
								/>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label htmlFor="checkout-number" className={fieldLabel}>
											House number
										</label>
										<input
											id="checkout-number"
											type="text"
											autoComplete="address-line2"
											placeholder="Number"
											value={form.number}
											onChange={updateField("number")}
											className={pillInput}
										/>
									</div>
									<div>
										<label htmlFor="checkout-postcode" className={fieldLabel}>
											Postcode
										</label>
										<input
											id="checkout-postcode"
											type="text"
											autoComplete="postal-code"
											placeholder="Postcode"
											value={form.postcode}
											onChange={updateField("postcode")}
											className={pillInput}
										/>
									</div>
								</div>
								<label htmlFor="checkout-country" className={fieldLabel}>
									Country
								</label>
								<input
									id="checkout-country"
									type="text"
									autoComplete="country-name"
									placeholder="Country"
									value={form.country}
									onChange={updateField("country")}
									className={pillInput}
								/>
							</div>
						</div>
					</div>

					<div className="h-fit rounded-4xl bg-primary p-8 md:p-9">
						<p className="font-serif text-2xl italic text-secondary">Order Summary</p>
						<ul className="mt-6 space-y-3 border-b border-secondary/20 pb-6">
							{items.map((item) => (
								<li key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-4 text-sm text-secondary/90">
									<span>
										{item.name}
										<span className="text-secondary/60"> · {item.size}</span>
										<span className="text-secondary/60"> &times; {item.quantity}</span>
									</span>
									<span className="font-montserrat font-semibold">${item.price * item.quantity}</span>
								</li>
							))}
						</ul>
						<dl className="mt-6 space-y-3 font-montserrat text-sm text-secondary/80">
							<div className="flex items-center justify-between">
								<dt>Subtotal</dt>
								<dd>${subtotal}</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt>Shipping Fee</dt>
								<dd>${shipping}</dd>
							</div>
						</dl>
						<div className="mt-4 flex items-center justify-between border-t border-secondary/20 pt-4">
							<span className="font-montserrat text-xl font-bold uppercase text-secondary">Total</span>
							<span className="font-montserrat text-xl font-bold text-secondary">${total}</span>
						</div>

						<button onClick={handleCheckout} disabled={!canPay} className="mt-8 rounded-full bg-secondary px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-wide text-primary">
							{!canPay ? (
								<p>
								Fill in your contact info and shipping address to continue to payment.
								</p>
							) : (
								<p>
									Pay with Stripe
								</p>
							)}
						</button>

						{status === "processing" && (
							<p className="mt-4 text-center text-xs uppercase tracking-wide text-secondary/70">
								Processing your order&hellip;
							</p>
						)}
						{status === "error" && (
							<p className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-xs text-red-700">{errorMessage}</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
