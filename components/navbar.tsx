"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartCount } from "@/lib/cart-store";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/shop", label: "Shop" },
	{ href: "/contact", label: "Contact" },
];

type NavbarProps = {
	variant?: "solid" | "transparent";
};

export default function Navbar({ variant = "solid" }: NavbarProps) {
	const [open, setOpen] = useState(false);
	const cartCount = useCartCount();
	const isTransparent = variant === "transparent";

	const contentColor = isTransparent ? "text-secondary" : "text-primary";
	const barColor = isTransparent ? "bg-secondary" : "bg-primary";
	const logoFilter = isTransparent ? "brightness-0 invert" : "";
	const mobileBackdrop = isTransparent ? "rounded-2xl bg-primary/95 backdrop-blur-sm" : "";
	const focusRing = isTransparent
		? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-0"
		: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary";

	return (
		<nav
			className={`px-6 py-5 md:px-12 md:py-6 ${
				isTransparent ? "absolute inset-x-0 top-0 z-20 bg-transparent" : "relative bg-secondary"
			}`}
		>
			<div className="flex items-center justify-between">
				<Image
					src="/sora-logo.png"
					alt="Sora Wear"
					width={120}
					height={70}
					className={`h-11 w-auto md:h-14 ${logoFilter}`}
				/>
				<div className={`hidden gap-10 text-sm font-montserrat font-medium uppercase tracking-[0.2em] md:flex ${contentColor}`}>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`rounded-sm transition-opacity hover:opacity-70 ${focusRing}`}
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-5">
					<Link
						href="/cart"
						aria-label={`View cart${cartCount > 0 ? ` (${cartCount} item${cartCount === 1 ? "" : "s"})` : ""}`}
						className={`relative rounded-full transition-opacity hover:opacity-70 ${focusRing}`}
					>
						<Image
							src="/vectors/cart.svg"
							alt=""
							aria-hidden="true"
							width={24}
							height={24}
							className={logoFilter}
						/>
						{cartCount > 0 && (
							<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-montserrat font-semibold text-secondary">
								{cartCount}
							</span>
						)}
					</Link>
					<button
						type="button"
						onClick={() => setOpen((prev) => !prev)}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						className={`flex h-6 w-7 flex-col justify-center gap-1.5 rounded-sm md:hidden ${focusRing}`}
					>
						<span
							className={`block h-0.5 w-full transition-transform duration-300 ${barColor} ${
								open ? "translate-y-2 rotate-45" : ""
							}`}
						/>
						<span
							className={`block h-0.5 w-full transition-opacity duration-300 ${barColor} ${
								open ? "opacity-0" : ""
							}`}
						/>
						<span
							className={`block h-0.5 w-full transition-transform duration-300 ${barColor} ${
								open ? "-translate-y-2 -rotate-45" : ""
							}`}
						/>
					</button>
				</div>
			</div>

			<div
				className={`overflow-hidden transition-[max-height,opacity] duration-300 md:hidden ${
					open ? "mt-6 max-h-60 opacity-100" : "max-h-0 opacity-0"
				} ${mobileBackdrop}`}
			>
				<div className={`flex flex-col gap-5 ${isTransparent ? "p-6" : "pb-2 pt-2"}`}>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className={`rounded-sm text-sm font-montserrat font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70 ${focusRing} ${contentColor}`}
						>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
