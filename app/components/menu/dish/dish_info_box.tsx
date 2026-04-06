import type { Dish } from '~/interfaces';
import { Beef, Milk, Nut, Wheat } from 'lucide-react';
import type { ComponentType } from 'react';

const ALLERGEN_ICON_MAP: Record<string, { icon: ComponentType<{ size?: number }>; label: string }> =
  {
    GLUTEN: { icon: Wheat, label: 'Gluten' },
    LACTOSE: { icon: Milk, label: 'Lactose' },
    MEAT: { icon: Beef, label: 'Meat' },
    NUTS: { icon: Nut, label: 'Nuts' },
  };

export function DishInfo({ dish }: { dish: Dish }) {
  const allergenIcons = (dish.allergens ?? [])
    .map(allergen => ALLERGEN_ICON_MAP[allergen])
    .filter(Boolean);

  return (
    <div className="flex w-full items-start justify-between gap-4 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all">
      <div className="flex min-w-0 flex-col justify-between flex-grow text-black dark:text-white">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{dish.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{dish.description}</p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[#009DE0] dark:text-[#28b9f7]">
          {allergenIcons.length > 0 ? (
            allergenIcons.map(({ icon: Icon, label }) => (
              <span
                key={`${dish.id}-${label}`}
                title={label}
                className="inline-flex items-center justify-center"
              >
                <Icon size={14} />
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
          )}
        </div>
      </div>

      <div className="shrink-0 pt-1 text-sm font-semibold text-gray-900 dark:text-white">
        {dish.price} PLN
      </div>
    </div>
  );
}
