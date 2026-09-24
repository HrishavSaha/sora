import "server-only";
import Stripe from "stripe";

export function createStripeClient() {
	const secretKey = process.env.STRIPE_SECRET_KEY;
	if (!secretKey) {
		throw new Error("Missing STRIPE_SECRET_KEY environment variable");
	}

	return new Stripe(secretKey);
}
