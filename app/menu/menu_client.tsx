"use client";

import { DishListComponent } from "~/menu/dish_list";
import { useRestaurantStore } from "~/store/restaurant_store";

export default function MenuClient() {
  const selectedRestaurant = useRestaurantStore((state) => state.selectedRestaurant);

  // eslint-disable-next-line no-console
  console.debug("MenuClient selectedRestaurant:", selectedRestaurant);

  if (!selectedRestaurant) return <p>No restaurant selected</p>;

  return <DishListComponent restaurantId={selectedRestaurant.id} />;
}
