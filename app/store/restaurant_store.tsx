import { create } from "zustand";
import type { Restaurant } from "~/interfaces";

interface RestaurantStore {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  menuFormSuccess: boolean;
  setMenuFormSuccess: (success: boolean) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  menuFormSuccess: false,
  setMenuFormSuccess: (success) => set({ menuFormSuccess: success }),
}));