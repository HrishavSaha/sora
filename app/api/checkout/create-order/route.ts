import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { getActiveProductsByIds } from "@/lib/products";
import { createServiceClient } from "@/lib/supabase/server";
import { SHIPPING_FEE } from "@/lib/pricing";

type CartLine = { id: string; quantity: number };

type Contact = { name: string; email: string };

type ShippingAddress = {
	street: string;
	place: string;
	number: string;
	postcode: string;
	country: string;
};

function isValidCart(value: unknown): value is CartLine[] {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every(
			(line) =>
				typeof line === "object" &&
				line !== null &&
				typeof (line as CartLine).id === "string" &&
				Number.isInteger((line as CartLine).quantity) &&
				(line as CartLine).quantity > 0
		)
	);
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function isValidContact(value: unknown): value is Contact {
	const contact = value as Partial<Contact> | null;
	return (
		!!contact &&
		isNonEmptyString(contact.name) &&
		isNonEmptyString(contact.email) &&
		/^\S+@\S+\.\S+$/.test(contact.email)
	);
}

function isValidShipping(value: unknown): value is ShippingAddress {
	const shipping = value as Partial<ShippingAddress> | null;
	return (
		!!shipping &&
		isNonEmptyString(shipping.street) &&
		isNonEmptyString(shipping.place) &&
		isNonEmptyString(shipping.number) &&
		isNonEmptyString(shipping.postcode) &&
		isNonEmptyString(shipping.country)
	);
}

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	const cart = body?.items;
	const contact = body?.contact;
	const shipping = body?.shipping;

	if (!isValidCart(cart)) {
		return NextResponse.json({ error: "Cart must be a non-empty list of { id, quantity }" }, { status: 400 });
	}
	if (!isValidContact(contact)) {
		return NextResponse.json({ error: "A valid name and email are required" }, { status: 400 });
	}
	if (!isValidShipping(shipping)) {
		return NextResponse.json({ error: "A complete shipping address is required" }, { status: 400 });
	}

	// Prices are always looked up server-side; the client only tells us
	// which product ids and quantities are in the cart.
	const products = await getActiveProductsByIds(cart.map((line) => line.id));
	const productById = new Map(products.map((product) => [product.id, product]));

	const missingId = cart.find((line) => !productById.has(line.id));
	if (missingId) {
		return NextResponse.json({ error: `Unknown or inactive product: ${missingId.id}` }, { status: 400 });
	}

	const orderItems = cart.map((line) => {
		const product = productById.get(line.id)!;
		return { id: product.id, name: product.name, unitPrice: product.price, quantity: line.quantity };
	});

	const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	const total = subtotal + SHIPPING_FEE;

	const paypalOrder = await createPayPalOrder(orderItems, SHIPPING_FEE);

	const supabase = createServiceClient();
	const { data: order, error: orderError } = await supabase
		.from("orders")
		.insert({
			paypal_order_id: paypalOrder.id,
			status: "pending",
			subtotal,
			shipping: SHIPPING_FEE,
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

	return NextResponse.json({ id: paypalOrder.id });
}
