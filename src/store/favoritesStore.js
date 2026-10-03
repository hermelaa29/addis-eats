import { create } from "zustand";

// Helper to read initial favorites from local storage
function readFavoriteIds() {
  try {
    return JSON.parse(localStorage.getItem("addis-eats-favorites")) || [];
  } catch {
    return [];
  }
}

// Zustand store for Favorite dishes
export const useFavoritesStore = create((set, get) => ({
  // State
  favoriteIds: readFavoriteIds(),

  // Actions
  toggleFavorite: (id) => {
    set((state) => {
      const next = state.favoriteIds.includes(id)
        ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
        : [...state.favoriteIds, id];
      
      localStorage.setItem("addis-eats-favorites", JSON.stringify(next));
      return { favoriteIds: next };
    });
  },

  // Derived state getters
  isFavorite: (id) => get().favoriteIds.includes(id),
  
  getFavoriteCount: () => get().favoriteIds.length,
}));
