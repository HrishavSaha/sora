import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowCounterClockwise, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { createStripeClient } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Checkout Not Completed",
	description: "Your Sora Wear checkout was not completed. You can try again when you are ready.",
};

const checkoutReferencePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function markOrderFailed(checkoutReference: string | undefined) {
	if (!checkoutReference || !checkoutReferencePattern.test(checkoutReference)) return;

	const supabase = createServiceClient();
	const { data: order, error: lookupError } = await supabase
		.from("orders")
		.select("stripe_order_id, status")
		.eq("checkout_reference", checkoutReference)
		.single();

	if (lookupError || !order || order.status !== "pending") return;

	const session = await createStripeClient().checkout.sessions.retrieve(order.stripe_order_id);
	if (session.client_reference_id !== checkoutReference || session.payment_status === "paid") return;

	const { error: updateError } = await supabase
		.from("orders")
		.update({ status: "failed", updated_at: new Date().toISOString() })
		.eq("checkout_reference", checkoutReference)
		.eq("status", "pending");

	if (updateError) {
		throw new Error(`Failed to mark order as failed: ${updateError.message}`);
	}
}

export default async function PaymentFailedPage({
	searchParams,
}: {
	searchParams: Promise<{ checkout_reference?: string | string[] }>;
}) {
	const { checkout_reference: checkoutReference } = await searchParams;
	await markOrderFailed(typeof checkoutReference === "string" ? checkoutReference : undefined);

	return (
		<div className="flex min-h-[100dvh] flex-col bg-secondary text-primary">
			<Navbar variant="solid" />

			<main className="flex flex-1 items-center px-6 py-12 md:px-12 md:py-16 lg:py-20">
				<section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-primary/15 bg-white/45 lg:grid-cols-[0.95fr_1.05fr]">
					<div className="relative order-last min-h-[23rem] bg-primary sm:min-h-[30rem] lg:order-first lg:min-h-full">
						<Image
							src="/images/payment-recovery.png"
							alt="Yoga mat and folded activewear waiting in a sunlit studio"
							fill
							priority
							sizes="(min-width: 1024px) 45vw, 100vw"
							className="object-cover object-[65%_center]"
						/>
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent px-8 pb-9 pt-20 sm:px-12 lg:px-10">
							<p className="max-w-xs font-serif text-2xl leading-tight text-secondary sm:text-3xl">
								Take the next step when it feels right.
							</p>
						</div>
					</div>

					<div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
						<div>
							<div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-accent">
								<WarningCircle aria-hidden="true" size={27} weight="regular" />
							</div>

							<p className="mt-8 font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-accent">
								Checkout not completed
							</p>
							<h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
								Your pieces are still waiting.
							</h1>
							<p className="mt-6 max-w-md text-base leading-7 text-primary/70 sm:text-lg">
								We could not complete your checkout. Your cart is unchanged, so you can return whenever you are ready.
							</p>

							<div className="mt-9 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/checkout"
									className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
								>
									<ArrowCounterClockwise aria-hidden="true" size={18} weight="bold" />
									Try checkout again
								</Link>
								<Link
									href="/shop"
									className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/25 px-7 font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
								>
									Return to shop
								</Link>
							</div>
						</div>

						<div className="mt-12 border-t border-primary/15 pt-8 lg:mt-16">
							<p className="max-w-md text-sm leading-6 text-primary/60">
								If the issue continues, check your payment details or contact your bank before trying again.
							</p>
							<Link
								href="/contact"
								className="mt-4 inline-flex rounded-sm font-montserrat text-sm font-semibold uppercase tracking-[0.12em] text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
							>
								Contact support
							</Link>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
