export type CheckoutCartLine = {
	id: string;
	size: string;
	quantity: number;
};

export type CheckoutContact = {
	name: string;
	email: string;
};

export type CheckoutShippingAddress = {
	street: string;
	place: string;
	number: string;
	postcode: string;
	country: string;
};

export type CheckoutSessionRequest = {
	items: CheckoutCartLine[];
	contact: CheckoutContact;
	shipping: CheckoutShippingAddress;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function isCartLine(value: unknown): value is CheckoutCartLine {
	return (
		isRecord(value) &&
		isNonEmptyString(value.id) &&
		isNonEmptyString(value.size) &&
		typeof value.quantity === "number" &&
		Number.isInteger(value.quantity) &&
		value.quantity > 0
	);
}

function isContact(value: unknown): value is CheckoutContact {
	return (
		isRecord(value) &&
		isNonEmptyString(value.name) &&
		isNonEmptyString(value.email) &&
		/^\S+@\S+\.\S+$/.test(value.email)
	);
}

function isShippingAddress(value: unknown): value is CheckoutShippingAddress {
	return (
		isRecord(value) &&
		isNonEmptyString(value.street) &&
		isNonEmptyString(value.place) &&
		isNonEmptyString(value.number) &&
		isNonEmptyString(value.postcode) &&
		isNonEmptyString(value.country)
	);
}

export function parseCheckoutSessionRequest(value: unknown): CheckoutSessionRequest | null {
	if (!isRecord(value) || !Array.isArray(value.items) || value.items.length === 0) {
		return null;
	}

	if (!value.items.every(isCartLine) || !isContact(value.contact) || !isShippingAddress(value.shipping)) {
		return null;
	}

	return {
		items: value.items,
		contact: value.contact,
		shipping: value.shipping,
	};
}

export function getCheckoutSessionUrl(value: unknown): string | null {
	if (!isRecord(value) || !isNonEmptyString(value.url)) return null;

	try {
		return new URL(value.url).protocol === "https:" ? value.url : null;
	} catch {
		return null;
	}
}

export function getApiErrorMessage(value: unknown): string | null {
	return isRecord(value) && isNonEmptyString(value.error) ? value.error : null;
}
