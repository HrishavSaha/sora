import Image from "next/image";
import Link from "next/link";

export default function BrandStatement() {
	return (
		<section className="relative overflow-hidden bg-primary py-28 md:py-40">
			<Image
				src="/vectors/sora-icon.png"
				alt=""
				aria-hidden="true"
				width={338}
				height={280}
				className="pointer-events-none absolute right-0 top-1/2 hidden w-75 -translate-y-1/2 select-none opacity-10 brightness-0 invert sm:block md:right-12 md:w-100"
			/>
			<div className="reveal-on-scroll relative z-10 mx-auto max-w-7xl px-8 md:px-12">
				<div className="max-w-2xl">
					<h2 className="font-montserrat text-3xl font-semibold leading-[1.2] text-secondary sm:text-4xl md:text-5xl">
						Your body knows the way.
						<br />
						Just breathe, move, and trust it.
					</h2>
					<p className="mt-8 max-w-md text-base leading-relaxed text-secondary/70 md:mt-10 md:text-lg">
						Sora creates effortless yoga wear for mindful movement, everyday comfort, and a
						life lived in your own rhythm.
					</p>
					<Link
						href="/shop"
						className="mt-12 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] md:mt-14"
					>
						Shop the Collection
					</Link>
				</div>
			</div>
		</section>
	);
}
