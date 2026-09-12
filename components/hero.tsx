import Image from "next/image";

export default function Hero() {
	return (
		<section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
			<Image
				src="/images/hero-bg.png"
				alt="Woman practicing yoga at sunset by the sea"
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			<div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24 text-center">
				<Image
					src="/sora-logo.png"
					alt="Sora Wear"
					width={460}
					height={280}
					priority
					className="h-auto w-[280px] brightness-0 invert sm:w-[360px] md:w-[440px]"
				/>
			</div>
			<p className="relative z-10 mx-auto max-w-2xl px-6 pb-16 text-center font-serif text-sm italic text-secondary sm:text-base">
				From your first stretch to your slowest morning, every piece is designed to bring
				comfort, confidence, and ease into your everyday movement.
			</p>
		</section>
	);
}
