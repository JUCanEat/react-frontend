import { DishListComponent } from "~/dishlist/dish_list";
import { useRestaurantStore } from "~/store/restaurant_store";

export default function Dishes() {
  const selectedRestaurant = useRestaurantStore((state) => state.selectedRestaurant);

  if (!selectedRestaurant) return <p>No restaurant selected</p>;

  return <DishListComponent restaurantId={selectedRestaurant.id} />;
}
