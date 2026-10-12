"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  date: string;
  label: string;
  price: number;
  quantity: number;
  productNames: string[];
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addDay: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
  ) => void;
  removeItem: (date: string) => void;
  updateQuantity: (date: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addDay: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.date === item.date,
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.date === item.date
                  ? {
                      ...cartItem,
                      ...item,
                      quantity: cartItem.quantity + quantity,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        });
      },
      removeItem: (date) => {
        set((state) => ({
          items: state.items.filter((item) => item.date !== date),
        }));
      },
      updateQuantity: (date, quantity) => {
        if (quantity <= 0) {
          get().removeItem(date);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.date === date ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "food-delivery-cart-v2",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useCartItemCount() {
  return useCartStore((state) =>
    state.hasHydrated
      ? state.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0,
  );
}

export function useCartTotalPrice() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
}
