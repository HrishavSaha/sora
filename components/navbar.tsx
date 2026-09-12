"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
	const isTransparent = variant === "transparent";
	const barColor = isTransparent ? "bg-secondary" : "bg-primary";

	return (
		<nav
			className={`px-6 py-5 md:px-12 md:py-6 ${
				isTransparent
					? "absolute inset-x-0 top-0 z-20 bg-transparent"
					: "relative bg-secondary"
			}`}
		>
			<div className="flex items-center justify-between">
				<Image
					src="/sora-logo.png"
					alt="Logo of Sora wear"
					width={120}
					height={70}
					className={isTransparent ? "h-11 w-auto brightness-0 invert md:h-14" : "h-11 w-auto md:h-14"}
				/>
				<div
					className={`hidden gap-10 text-sm font-montserrat font-medium uppercase tracking-[0.2em] md:flex ${
						isTransparent ? "text-secondary" : "text-primary"
					}`}
				>
					{navLinks.map((link) => (
						<Link key={link.href} href={link.href} className="transition-opacity hover:opacity-70">
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-5">
					<Image
						src="/vectors/cart.svg"
						alt="Cart"
						width={24}
						height={24}
						className={isTransparent ? "brightness-0 invert" : ""}
					/>
					<button
						type="button"
						onClick={() => setOpen((prev) => !prev)}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						className="flex h-6 w-7 flex-col justify-center gap-1.5 md:hidden"
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
				} ${isTransparent ? "rounded-2xl bg-primary/95 backdrop-blur-sm" : ""}`}
			>
				<div className={`flex flex-col gap-5 ${isTransparent ? "p-6" : "pb-2 pt-2"}`}>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className={`text-sm font-montserrat font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70 ${
								isTransparent ? "text-secondary" : "text-primary"
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
