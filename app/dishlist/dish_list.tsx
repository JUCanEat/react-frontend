import { FilterBar } from "~/components/overview/filter_bar"
import { TopBar } from "~/components/overview/top_bar"
import { BottomNav } from "~/components/overview/bottom_nav"
import { mockDishes } from "~/dishlist/mock_dishes"
import { DishInfo } from "~/components/dish/dish_info_box"
import { useState } from "react"

export function DishListComponent() {
  const [filters, setFilters] = useState<string[]>([]);

  const filteredDishes = mockDishes.filter(dish => {
    if (filters.length === 0) return true;

    const allergens = dish.allergens ?? [];

    return filters.every(filter => {
      switch (filter) {
        case "vegan":
           return !allergens.includes("lactose") && !allergens.includes("meat");

        case "vegetarian":
          return !allergens.includes("meat");

        case "lactose-free":
          return !allergens.includes("lactose");

        case "gluten-free":
          return !allergens.includes("gluten");

        default:
          return !allergens.includes("gluten");
      }
    });
  });

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