import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
	id: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
	variant?: string;
};

type CartState = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
	updateQuantity: (id: string, delta: number) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
};

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			items: [],
			addItem: (item, quantity = 1) =>
				set((state) => {
					const existing = state.items.find((cartItem) => cartItem.id === item.id);
					if (existing) {
						return {
							items: state.items.map((cartItem) =>
								cartItem.id === item.id
									? { ...cartItem, quantity: cartItem.quantity + quantity }
									: cartItem
							),
						};
					}
					return { items: [...state.items, { ...item, quantity }] };
				}),
			updateQuantity: (id, delta) =>
				set((state) => ({
					items: state.items
						.map((cartItem) =>
							cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + delta } : cartItem
						)
						.filter((cartItem) => cartItem.quantity > 0),
				})),
			removeItem: (id) =>
				set((state) => ({ items: state.items.filter((cartItem) => cartItem.id !== id) })),
			clearCart: () => set({ items: [] }),
		}),
		{ name: "sora-cart" }
	)
);

export const useCartCount = () =>
	useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
