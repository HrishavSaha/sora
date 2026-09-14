export type PayPalOrderItem = {
	id: string;
	name: string;
	unitPrice: number;
	quantity: number;
};

function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing ${name} environment variable`);
	return value;
}

function getApiBase(): string {
	// https://api-m.sandbox.paypal.com for testing, https://api-m.paypal.com in production.
	return process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
}

async function getAccessToken(): Promise<string> {
	const clientId = getEnv("PAYPAL_CLIENT_ID");
	const clientSecret = getEnv("PAYPAL_CLIENT_SECRET");
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

	const response = await fetch(`${getApiBase()}/v1/oauth2/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	if (!response.ok) {
		throw new Error(`PayPal auth failed: ${response.status} ${await response.text()}`);
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

function money(amount: number): string {
	return amount.toFixed(2);
}

export async function createPayPalOrder(items: PayPalOrderItem[], shipping: number) {
	const accessToken = await getAccessToken();

	const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
	const total = subtotal + shipping;

	const response = await fetch(`${getApiBase()}/v2/checkout/orders`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: "USD",
						value: money(total),
						breakdown: {
							item_total: { currency_code: "USD", value: money(subtotal) },
							shipping: { currency_code: "USD", value: money(shipping) },
						},
					},
					items: items.map((item) => ({
						name: item.name,
						unit_amount: { currency_code: "USD", value: money(item.unitPrice) },
						quantity: String(item.quantity),
					})),
				},
			],
		}),
	});

	if (!response.ok) {
		throw new Error(`PayPal create order failed: ${response.status} ${await response.text()}`);
	}

	return (await response.json()) as { id: string; status: string };
}

export type PayPalWebhookHeaders = {
	authAlgo: string;
	certUrl: string;
	transmissionId: string;
	transmissionSig: string;
	transmissionTime: string;
};

/**
 * Asks PayPal to verify a webhook delivery's signature. PayPal does the
 * actual cryptographic verification server-side — we just forward the
 * signing headers and the parsed event body, authenticated with our own
 * OAuth token, so there's nothing to get wrong implementing RSA/cert
 * verification by hand.
 */
export async function verifyPayPalWebhookSignature(
	headers: PayPalWebhookHeaders,
	webhookEvent: unknown
): Promise<boolean> {
	const webhookId = getEnv("PAYPAL_WEBHOOK_ID");
	const accessToken = await getAccessToken();

	const response = await fetch(`${getApiBase()}/v1/notifications/verify-webhook-signature`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			auth_algo: headers.authAlgo,
			cert_url: headers.certUrl,
			transmission_id: headers.transmissionId,
			transmission_sig: headers.transmissionSig,
			transmission_time: headers.transmissionTime,
			webhook_id: webhookId,
			webhook_event: webhookEvent,
		}),
	});

	if (!response.ok) {
		throw new Error(`PayPal webhook verification request failed: ${response.status} ${await response.text()}`);
	}

	const data = (await response.json()) as { verification_status: string };
	return data.verification_status === "SUCCESS";
}

export async function capturePayPalOrder(paypalOrderId: string) {
	const accessToken = await getAccessToken();

	const response = await fetch(`${getApiBase()}/v2/checkout/orders/${paypalOrderId}/capture`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`PayPal capture failed: ${response.status} ${await response.text()}`);
	}

	return (await response.json()) as {
		id: string;
		status: string;
		payer?: { email_address?: string };
	};
}
