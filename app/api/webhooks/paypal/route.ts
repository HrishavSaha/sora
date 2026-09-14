import { NextResponse } from "next/server";
import { verifyPayPalWebhookSignature, type PayPalWebhookHeaders } from "@/lib/paypal";
import { createServiceClient } from "@/lib/supabase/server";

type PayPalWebhookEvent = {
	event_type: string;
	resource: {
		id?: string;
		supplementary_data?: { related_ids?: { order_id?: string } };
	};
};

// Maps the capture-status events we act on to our own order status. Other
// event types (refunds, disputes, pending review, etc.) are acknowledged but
// otherwise ignored for now.
const STATUS_BY_EVENT: Record<string, "completed" | "failed"> = {
	"PAYMENT.CAPTURE.COMPLETED": "completed",
	"PAYMENT.CAPTURE.DENIED": "failed",
};

function getWebhookHeaders(request: Request): PayPalWebhookHeaders | null {
	const headers: PayPalWebhookHeaders = {
		authAlgo: request.headers.get("paypal-auth-algo") ?? "",
		certUrl: request.headers.get("paypal-cert-url") ?? "",
		transmissionId: request.headers.get("paypal-transmission-id") ?? "",
		transmissionSig: request.headers.get("paypal-transmission-sig") ?? "",
		transmissionTime: request.headers.get("paypal-transmission-time") ?? "",
	};

	return Object.values(headers).every((value) => value.length > 0) ? headers : null;
}

export async function POST(request: Request) {
	const body = (await request.json().catch(() => null)) as PayPalWebhookEvent | null;
	if (!body || typeof body.event_type !== "string") {
		return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
	}

	const headers = getWebhookHeaders(request);
	if (!headers) {
		return NextResponse.json({ error: "Missing PayPal signature headers" }, { status: 400 });
	}

	try {
		const verified = await verifyPayPalWebhookSignature(headers, body);
		if (!verified) {
			return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
		}

		// This is a server-to-server confirmation independent of the buyer's
		// browser completing the capture-order round trip — it can arrive even
		// if that request never happened (closed tab, network drop, etc.).
		const status = STATUS_BY_EVENT[body.event_type];
		const orderId = body.resource.supplementary_data?.related_ids?.order_id;

		if (!status || !orderId) {
			return NextResponse.json({ received: true });
		}

		const supabase = createServiceClient();
		const { error } = await supabase
			.from("orders")
			.update({ status, updated_at: new Date().toISOString() })
			.eq("paypal_order_id", orderId)
			// Never clobber a status the primary capture-order flow already set.
			.eq("status", "pending");

		if (error) {
			return NextResponse.json({ error: `Failed to update order: ${error.message}` }, { status: 500 });
		}

		return NextResponse.json({ received: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Webhook processing failed";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
