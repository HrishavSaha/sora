import Image from "next/image";

export default function TestimonialsIntro() {
	return (
		<section className="relative overflow-hidden bg-secondary">
			<div className="mx-auto grid items-stretch md:grid-cols-[1.3fr_1fr]">
				<div className="relative min-h-130 overflow-hidden md:min-h-190">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute left-[6%] top-[8%] h-64 w-64 rounded-full bg-neutral md:h-96 md:w-96"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute bottom-[6%] left-[26%] h-48 w-48 rounded-full bg-neutral-dark md:h-72 md:w-72"
					/>
					<Image
						src="/images/testimonial-bg.png"
						alt="Sora customer moving through a warrior yoga pose"
						fill
						sizes="(min-width: 768px) 55vw, 100vw"
						className="object-cover object-bottom"
					/>
				</div>

				<div className="flex flex-col justify-start px-6 py-14 md:px-16 md:py-20">
					<Image
						src="/sora-logo-navy.png"
						alt="Sora Wear"
						width={140}
						height={82}
						className="h-10 w-auto self-start md:h-12"
					/>
					<h2 className="mt-10 font-montserrat text-4xl font-bold leading-[1.05] text-accent md:mt-14 md:text-6xl">
						Client Reviews
					</h2>
					<p className="mt-6 max-w-md text-base leading-relaxed text-primary/70 md:text-lg">
						Every Sora piece is shaped by the people who wear it. Here is what our
						community has to say about moving, stretching, and living in comfort.
					</p>
				</div>
			</div>
		</section>
	);
}
