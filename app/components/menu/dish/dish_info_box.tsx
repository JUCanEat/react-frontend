import { ClickableHeart } from "~/components/menu/dish/clickable_heart"
import type { Dish } from "~/interfaces"

export function DishInfo({dish}:  {dish: Dish}) {
    return (
        <div className="flex w-full gap-4 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">

            <div className="flex flex-col justify-between flex-grow text-black dark:text-white">
                <div>
                    <p className="font-semibold">
                        {dish.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {dish.descrtion}
                    </p>
                </div>

                <span className="flex items-center text-xs font-semibold">
                    {dish.price} PLN {/* todo: fetch currency from db*/}
                </span>
            </div>

            <div>
                <ClickableHeart/>
            </div>

        </div>
    );
}