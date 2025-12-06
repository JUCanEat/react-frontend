import { ClickableHeart } from "~/components/dish/clickable_heart"

export function DishInfo({dish}:  {dish: Dish}) {
    return (
        <div className="flex w-full gap-4 p-3 bg-black rounded-xl">

            <img
                className="w-20 h-20 rounded-lg object-cover"
                src={dish.image}
                alt={dish.name}
            />

            <div className="flex flex-col justify-between flex-grow text-white">
                <div>
                    <p className="font-semibold">
                        {dish.name}
                    </p>
                    <p className="text-sm text-gray-300">
                        {dish.description}
                    </p>
                </div>

                <span className="flex items-center text-xs font-semibold">
                    {dish.price}
                </span>
            </div>

            <div>
                <ClickableHeart/>
            </div>

        </div>
    );
}