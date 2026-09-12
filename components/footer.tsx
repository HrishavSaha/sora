import Image from "next/image";
import Link from "next/link";

type FooterColumn = {
	heading: string;
	links: { label: string; href: string }[];
};

const footerColumns: FooterColumn[] = [
	{
		heading: "Explore",
		links: [
			{ label: "Home", href: "/" },
			{ label: "About", href: "/about" },
			{ label: "Shop", href: "/shop" },
		],
	},
	{
		heading: "Support",
		links: [
			{ label: "Shipping", href: "/shipping" },
			{ label: "Size Guide", href: "/size-guide" },
			{ label: "FAQs", href: "/faq" },
		],
	},
	{
		heading: "Contact",
		links: [
			{ label: "Instagram", href: "#" },
			{ label: "WhatsApp", href: "#" },
			{ label: "Email", href: "mailto:hello@sorawear.com" },
		],
	},
];

function FooterColumnList({ heading, links }: FooterColumn) {
	return (
		<div>
			<h3 className="font-montserrat text-xs uppercase tracking-[0.15em] text-secondary/50">
				{heading}
			</h3>
			<ul className="mt-5 space-y-3">
				{links.map((link) => (
					<li key={link.label}>
						<Link
							href={link.href}
							className="font-montserrat text-sm text-secondary/80 transition-colors hover:text-secondary"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function Footer() {
	return (
		<footer className="bg-primary px-6 pt-20 pb-8 md:px-12 md:pt-24">
			<div className="mx-auto grid max-w-7xl gap-16 border-b border-secondary/10 pb-16 md:grid-cols-[1.2fr_1fr] md:gap-12">
				<div className="max-w-sm">
					<Image
						src="/sora-logo.png"
						alt="Sora Wear"
						width={140}
						height={82}
						className="h-14 w-auto brightness-0 invert"
					/>
					<h3 className="mt-8 font-serif text-2xl italic leading-[1.1] text-secondary">
						Stay in rhythm.
					</h3>
					<p className="mt-3 text-sm leading-relaxed text-secondary/60">
						Get early access to new drops and seasonal offers, straight to your inbox.
					</p>
					<form className="mt-6 flex max-w-sm gap-2">
						<label htmlFor="footer-email" className="sr-only">
							Email address
						</label>
						<input
							id="footer-email"
							type="email"
							required
							placeholder="Email address"
							className="w-full rounded-full bg-secondary px-5 py-2.5 text-sm text-primary placeholder:text-primary/50 outline-none focus:ring-2 focus:ring-accent"
						/>
						<button
							type="submit"
							className="shrink-0 rounded-full bg-accent px-5 py-2.5 font-montserrat text-xs font-medium uppercase tracking-[0.15em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
						>
							Subscribe
						</button>
					</form>
				</div>

				<div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
					{footerColumns.map((column) => (
						<FooterColumnList key={column.heading} {...column} />
					))}
				</div>
			</div>

			<div className="mx-auto flex max-w-7xl flex-col gap-4 pt-8 text-xs text-secondary/50 sm:flex-row sm:items-center sm:justify-between">
				<p>&copy; {new Date().getFullYear()} Sora Wear. All rights reserved.</p>
				<div className="flex gap-6">
					<Link href="#" className="transition-colors hover:text-secondary/80">
						Privacy Policy
					</Link>
					<Link href="#" className="transition-colors hover:text-secondary/80">
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	);
}
