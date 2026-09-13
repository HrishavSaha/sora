import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	const orderID = body?.orderID;

	if (typeof orderID !== "string" || orderID.length === 0) {
		return NextResponse.json({ error: "orderID is required" }, { status: 400 });
	}

	try {
		const capture = await capturePayPalOrder(orderID);
		const completed = capture.status === "COMPLETED";

		const supabase = createServiceClient();
		const { error } = await supabase
			.from("orders")
			.update({
				status: completed ? "completed" : "failed",
				payer_email: capture.payer?.email_address ?? null,
				updated_at: new Date().toISOString(),
			})
			.eq("paypal_order_id", orderID);

		if (error) {
			return NextResponse.json({ error: `Failed to update order: ${error.message}` }, { status: 500 });
		}

		if (!completed) {
			return NextResponse.json({ error: `Payment not completed: ${capture.status}` }, { status: 402 });
		}

		return NextResponse.json({ status: capture.status, orderID: capture.id });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to capture order";
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
