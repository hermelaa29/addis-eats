import { create } from "zustand";

// Helper to read initial orders from local storage
function readOrders() {
  try {
    return JSON.parse(localStorage.getItem("addis-eats-orders")) || [];
  } catch {
    return [];
  }
}

// Zustand store for Order History
export const useOrdersStore = create((set) => ({
  // State
  orders: readOrders(),

  // Actions
  addOrder: (orderDetails) => {
    const order = {
      ...orderDetails,
      id: `AE-${Date.now().toString().slice(-6)}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    
    set((state) => {
      const next = [order, ...state.orders];
      localStorage.setItem("addis-eats-orders", JSON.stringify(next));
      return { orders: next };
    });
    
    return order;
  },

  updateOrderStatus: (id, status) => {
    set((state) => {
      const next = state.orders.map((order) =>
        order.id === id ? { ...order, status } : order,
      );
      localStorage.setItem("addis-eats-orders", JSON.stringify(next));
      return { orders: next };
    });
  },

  removeOrder: (id) => {
    set((state) => {
      const next = state.orders.filter((order) => order.id !== id);
      localStorage.setItem("addis-eats-orders", JSON.stringify(next));
      return { orders: next };
    });
  },
}));
