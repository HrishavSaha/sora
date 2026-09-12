"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToReducedMotion(callback: () => void) {
	const query = window.matchMedia("(prefers-reduced-motion: reduce)");
	query.addEventListener("change", callback);
	return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
	return false;
}

type Review = {
	quote: string;
	name: string;
	role: string;
};

const reviews: Review[] = [
	{
		quote:
			"I have tried a dozen yoga brands and nothing moves with me like Sora. The fabric breathes, and the fit holds through every pose.",
		name: "Meera Nair",
		role: "Yoga Instructor",
	},
	{
		quote:
			"My mornings feel different in these leggings. Soft, supportive, and somehow always in the right shape by the end of practice.",
		name: "Elena Cortez",
		role: "Marathon Runner",
	},
	{
		quote:
			"The comfort is real. I have worn my Ribbed Seamless Set to five classes in a row and it still looks brand new.",
		name: "Aiko Tanaka",
		role: "Pilates Coach",
	},
	{
		quote:
			"Finally, activewear that does not dig in or ride up mid-flow. Sora gets the small details right.",
		name: "Jordan Blake",
		role: "Studio Owner",
	},
];

const AUTO_ADVANCE_MS = 5000;

export default function TestimonialsCarousel() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const reducedMotion = useSyncExternalStore(
		subscribeToReducedMotion,
		getReducedMotionSnapshot,
		getReducedMotionServerSnapshot
	);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (isPaused || reducedMotion) return;

		intervalRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % reviews.length);
		}, AUTO_ADVANCE_MS);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isPaused, reducedMotion]);

	return (
		<section
			className="bg-secondary px-6 pb-24 md:px-16 md:pb-32"
			role="region"
			aria-label="Customer testimonials"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<div className="mx-auto max-w-3xl overflow-hidden">
				<div
					className={`flex ${reducedMotion ? "" : "transition-transform duration-700 ease-out"}`}
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
				>
					{reviews.map((review) => (
						<figure key={review.name} className="w-full shrink-0 px-2 text-center">
							<span className="text-accent" aria-hidden="true">
								★★★★★
							</span>
							<blockquote className="mt-6 font-serif text-xl italic leading-relaxed text-primary md:text-2xl">
								&ldquo;{review.quote}&rdquo;
							</blockquote>
							<figcaption className="mt-6 font-montserrat text-sm uppercase tracking-[0.15em] text-primary/70">
								{review.name}
								<span className="mx-2 text-primary/30">/</span>
								{review.role}
							</figcaption>
						</figure>
					))}
				</div>
			</div>

			<div className="mt-10 flex items-center justify-center gap-3">
				{reviews.map((review, index) => (
					<button
						key={review.name}
						type="button"
						onClick={() => setActiveIndex(index)}
						aria-label={`Go to testimonial from ${review.name}`}
						aria-current={index === activeIndex}
						className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
							index === activeIndex ? "w-8 bg-accent" : "w-2.5 bg-primary/20 hover:bg-primary/40"
						}`}
					/>
				))}
			</div>
		</section>
	);
}
