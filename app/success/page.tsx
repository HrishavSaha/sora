import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, EnvelopeSimple, Package, Truck } from "@phosphor-icons/react/dist/ssr";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { createStripeClient } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Order Confirmed",
	description: "Your Sora Wear order has been confirmed.",
};

const nextSteps = [
	{
		icon: EnvelopeSimple,
		title: "Check your inbox",
		body: "Your order confirmation is on its way.",
	},
	{
		icon: Package,
		title: "We prepare your pieces",
		body: "We will let you know when your order is ready to ship.",
	},
	{
		icon: Truck,
		title: "Follow the delivery",
		body: "Tracking details arrive as soon as your parcel leaves us.",
	},
] as const;

async function markOrderCompleted(sessionId: string | undefined) {
	if (!sessionId?.startsWith("cs_")) return;

	const session = await createStripeClient().checkout.sessions.retrieve(sessionId);
	if (session.payment_status !== "paid") return;

	const supabase = createServiceClient();
	const { error } = await supabase
		.from("orders")
		.update({ status: "completed", updated_at: new Date().toISOString() })
		.eq("stripe_order_id", session.id)
		.eq("status", "pending");

	if (error) {
		throw new Error(`Failed to mark order as completed: ${error.message}`);
	}
}

export default async function SuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string | string[] }>;
}) {
	const { session_id: sessionId } = await searchParams;
	await markOrderCompleted(typeof sessionId === "string" ? sessionId : undefined);

	return (
		<div className="flex min-h-[100dvh] flex-col bg-secondary text-primary">
			<Navbar variant="solid" />

			<main className="flex flex-1 items-center px-6 py-12 md:px-12 md:py-16 lg:py-20">
				<section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-primary/15 bg-white/45 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
						<div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary shadow-[0_12px_32px_rgba(45,56,100,0.16)]">
								<CheckCircle aria-hidden="true" size={27} weight="fill" />
							</div>

							<p className="mt-8 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-accent">
								Order confirmed
							</p>
							<h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
								Thank you for moving with us.
							</h1>
							<p className="mt-6 max-w-md text-base leading-7 text-primary/70 sm:text-lg">
								Your order is confirmed. We will send delivery updates to the email address you shared at checkout.
							</p>

							<div className="mt-9 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/shop"
									className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
								>
									Continue shopping
								</Link>
								<Link
									href="/contact"
									className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/25 px-7 font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
								>
									Contact support
								</Link>
							</div>
						</div>

						<div className="mt-12 grid gap-6 border-t border-primary/15 pt-8 sm:grid-cols-3 lg:mt-16 lg:gap-5">
							{nextSteps.map(({ icon: Icon, title, body }) => (
								<div key={title}>
									<Icon aria-hidden="true" size={22} weight="regular" className="text-accent" />
									<h2 className="mt-3 font-montserrat text-sm font-bold uppercase tracking-wide text-primary">{title}</h2>
									<p className="mt-2 text-sm leading-6 text-primary/60">{body}</p>
								</div>
							))}
						</div>
					</div>

					<div className="relative min-h-[27rem] bg-primary sm:min-h-[34rem] lg:min-h-full">
						<Image
							src="/images/success-yoga.png"
							alt="Person in navy Sora activewear resting after yoga"
							fill
							priority
							sizes="(min-width: 1024px) 45vw, 100vw"
							className="object-cover object-[58%_center]"
						/>
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent px-8 pb-9 pt-20 sm:px-12 lg:px-10">
							<p className="max-w-xs font-serif text-2xl leading-tight text-secondary sm:text-3xl">
								Made for the rhythm you create.
							</p>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
