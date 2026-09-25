import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
	id: string;
	name: string;
	image: string;
	price: number;
	size: ProductSize;
	quantity: number;
};

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

type CartState = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
	buyNow: (item: Omit<CartItem, "quantity">) => void;
	updateQuantity: (id: string, size: ProductSize, delta: number) => void;
	removeItem: (id: string, size: ProductSize) => void;
	clearCart: () => void;
};

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			items: [],
			addItem: (item, quantity = 1) =>
				set((state) => {
					const existing = state.items.find(
						(cartItem) => cartItem.id === item.id && cartItem.size === item.size
					);
					if (existing) {
						return {
							items: state.items.map((cartItem) =>
								cartItem.id === item.id && cartItem.size === item.size
									? { ...cartItem, quantity: cartItem.quantity + quantity }
									: cartItem
							),
						};
					}
					return { items: [...state.items, { ...item, quantity }] };
				}),
			// Replaces the cart with just this item so checkout reflects only
			// this purchase, independent of anything already in the cart.
			buyNow: (item) => set({ items: [{ ...item, quantity: 1 }] }),
			updateQuantity: (id, size, delta) =>
				set((state) => ({
					items: state.items
						.map((cartItem) =>
							cartItem.id === id && cartItem.size === size
								? { ...cartItem, quantity: cartItem.quantity + delta }
								: cartItem
						)
						.filter((cartItem) => cartItem.quantity > 0),
				})),
			removeItem: (id, size) =>
				set((state) => ({
					items: state.items.filter((cartItem) => cartItem.id !== id || cartItem.size !== size),
				})),
			clearCart: () => set({ items: [] }),
		}),
		{ name: "sora-cart" }
	)
);

export const useCartCount = () =>
	useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
