import { create } from "zustand";
import type { Restaurant } from "~/interfaces";

interface RestaurantStore {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
}));
