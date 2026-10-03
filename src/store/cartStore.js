import { create } from "zustand";

// Helper to load initial cart state from local storage
function readCart() {
  try {
    return JSON.parse(localStorage.getItem("addis-eats-cart")) || [];
  } catch {
    return [];
  }
}

// Zustand store for the Shopping Cart
export const useCartStore = create((set, get) => ({
  // State
  items: readCart(),

  // Actions
  addItem: (dish) => {
    set((state) => {
      const existing = state.items.find((item) => item.dish.id === dish.id);
      const next = existing
        ? state.items.map((item) =>
            item.dish.id === dish.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...state.items, { dish, quantity: 1 }];
      
      localStorage.setItem("addis-eats-cart", JSON.stringify(next));
      return { items: next };
    });
  },

  increase: (id) => {
    set((state) => {
      const next = state.items.map((item) =>
        item.dish.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      localStorage.setItem("addis-eats-cart", JSON.stringify(next));
      return { items: next };
    });
  },

  decrease: (id) => {
    set((state) => {
      const next = state.items
        .map((item) =>
          item.dish.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem("addis-eats-cart", JSON.stringify(next));
      return { items: next };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const next = state.items.filter((item) => item.dish.id !== id);
      localStorage.setItem("addis-eats-cart", JSON.stringify(next));
      return { items: next };
    });
  },

  clearCart: () => {
    localStorage.setItem("addis-eats-cart", JSON.stringify([]));
    set({ items: [] });
  },

  // Derived state getters
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  }
}));
