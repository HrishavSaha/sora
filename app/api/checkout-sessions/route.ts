import Stripe from "stripe";
import { NextResponse } from "next/server";
import { parseCheckoutSessionRequest } from "@/lib/checkout";
import { getActiveProductsByIds } from "@/lib/products";
import { createServiceClient } from "@/lib/supabase/server";
import { getShippingFee } from "@/lib/pricing";

function createStripeClient() {
	const secretKey = process.env.STRIPE_SECRET_KEY;
	if (!secretKey) {
		throw new Error("Missing STRIPE_SECRET_KEY environment variable");
	}

	return new Stripe(secretKey);
}

export async function POST(request: Request) {
	const checkout = parseCheckoutSessionRequest(await request.json().catch(() => null));
	if (!checkout) {
		return NextResponse.json({ error: "Invalid checkout details" }, { status: 400 });
	}

	const { items: cart, contact, shipping } = checkout;

	try {
		const products = await getActiveProductsByIds(cart.map((line) => line.id));
		const productById = new Map(products.map((product) => [product.id, product]));

		const origin = new URL(request.url).origin;

		const missingId = cart.find((line) => !productById.has(line.id));
		if (missingId) {
			return NextResponse.json({ error: `Unknown or inactive product: ${missingId.id}` }, { status: 400 });
		}

		const orderItems = cart.map((line) => {
			const product = productById.get(line.id)!;
			return { id: product.id, name: product.name, unitPrice: product.price, quantity: line.quantity };
		});

		const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
		const shippingFee = await getShippingFee();
		const total = subtotal + shippingFee;

		// Implement stripe logic
		const line_items = orderItems.map((line) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: line.name
				},
				unit_amount: Math.round(line.unitPrice * 100),
			},
			quantity: line.quantity
		}));

		const session = await createStripeClient().checkout.sessions.create({
			line_items,
			mode: 'payment',
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: origin
		})

		if (!session.url) {
			throw new Error("Stripe did not return a checkout URL");
		}

		const supabase = createServiceClient();
		const { data: order, error: orderError } = await supabase
			.from("orders")
			.insert({
				stripe_order_id: session.id,
				status: "pending",
				subtotal,
				shipping: shippingFee,
				total,
				customer_name: contact.name,
				customer_email: contact.email,
				shipping_street: shipping.street,
				shipping_place: shipping.place,
				shipping_number: shipping.number,
				shipping_postcode: shipping.postcode,
				shipping_country: shipping.country,
			})
			.select("id")
			.single();
	
		if (orderError) {
			return NextResponse.json({ error: `Failed to record order: ${orderError.message}` }, { status: 500 });
		}

		const { error: itemsError } = await supabase.from("order_items").insert(
			orderItems.map((item) => ({
				order_id: order.id,
				product_id: item.id,
				name: item.name,
				unit_price: item.unitPrice,
				quantity: item.quantity,
			}))
		);

		if (itemsError) {
			return NextResponse.json({ error: `Failed to record order items: ${itemsError.message}` }, { status: 500 });
		}

		return NextResponse.json({ url: session.url });
	}catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create order";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
