/**
 Dishes in the menu section can be filtered with allergen-based filters.
 A dish is filtered out when it contains allergen that conflicts with the filter (like for "GLUTEN" allergen and "gluten-free" filter).
 */

import { FilterBar, type FilterValue } from "~/components/overview/filter_bar"
import { TopBar } from "~/components/shared/top_bar"
import { BottomNav } from "~/components/shared/bottom_nav"
//import { mockDishes } from "~/dishlist/mock_dishes"
import { DishInfo } from "~/components/menu/dish/dish_info_box"
import type { Dish } from "~/interfaces";
import { useState } from "react";
import { useGetDailyMenu } from "~/api/menu_service";
import { filterDishes } from "~/shadcn/lib/dish_filters";

export function DishListComponent({ restaurantId }: { restaurantId: string }) {
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const { data, isLoading, error } = useGetDailyMenu(restaurantId);

  const dishes = data?.dishes ?? [];

  // map UI filter values to the dish_filters expected strings
  const filterValueMap: Record<FilterValue, string> = {
    vegan: "vegan",
    vegetarian: "vegetarian",
    lactoseFree: "lactose-free",
    glutenFree: "gluten-free",
  };

  const dishFilterStrings = filters.map((f) => filterValueMap[f]);

  const filteredDishes: Dish[] = filterDishes(dishes, dishFilterStrings);

  return (
    <>
      <TopBar isLoginPage={false} />
      <div className="w-full" style={{ height: "calc(100vh - 150px)" }}>

        <FilterBar value={filters} onChange={setFilters} />

        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
          <div className="flex flex-col gap-4">
            {filteredDishes.map(dish => (
              <DishInfo key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}