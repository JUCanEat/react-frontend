import { DishInfo } from "~/components/dish/dish_info_box";
import { Dish } from "~/interfaces";
import { mockDishes } from "~/dishlist/mock_dishes";
import { TopBar } from "~/components/overview/top_bar";
import { BottomNav } from "~/components/overview/bottom_nav";
import { FilterBar } from "~/components/overview/filter_bar"

export function DishListComponent() {
  return (
    <>
        <div className="flex flex-col h-screen w-full">
            <TopBar />
            <FilterBar />

            <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
                    <div className="flex flex-col gap-4">
                      {mockDishes.map((dish) => (
                        <DishInfo key={dish.id} dish={dish} />
                      ))}
                    </div>
            </div>

            <BottomNav />
        </div>
    </>
  );
}
