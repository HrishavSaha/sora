import Image from "next/image";

export default function AboutIntro() {
	return (
		<section className="relative overflow-hidden bg-secondary pb-16 pt-20 md:pb-24 md:pt-28">
			<div
				aria-hidden="true"
				className="blend-mask-top pointer-events-none absolute left-1/2 top-0 aspect-square w-[160%] max-w-none -translate-x-1/2 rounded-full bg-accent sm:w-[125%] md:w-[1000px]"
			/>

			<div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-20 text-center md:px-12 md:pb-36 md:pt-28">
				<h1 className="font-serif text-5xl italic leading-[1.1] text-secondary md:text-6xl">
					About Sora
				</h1>
				<p className="mt-8 max-w-2xl text-base leading-relaxed text-secondary/85 md:text-lg">
					Established in 2026, Sora is a yoga wear brand created for those who find balance
					through movement. We believe what you wear should move with you effortlessly,
					combining comfort, functionality, and timeless design in every piece. Sora is made
					to accompany your practice and everyday moments, wherever your flow takes you.
				</p>
				<Image
					src="/vectors/sora-icon.png"
					alt=""
					aria-hidden="true"
					width={338}
					height={280}
					className="mt-10 h-12 w-auto brightness-0 invert md:mt-12 md:h-14"
				/>
			</div>
		</section>
	);
}
