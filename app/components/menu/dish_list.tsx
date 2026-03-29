/**
 Dishes in the menu section can be filtered with allergen-based filters.
 A dish is filtered out when it contains allergen that conflicts with the filter (like for "GLUTEN" allergen and "gluten-free" filter).
 */

import { FilterBar, type FilterValue } from '~/components/overview/filter_bar';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { DishInfo } from '~/components/menu/dish/dish_info_box';
import type { Dish } from '~/interfaces';
import { useState } from 'react';
import { useGetDailyMenu } from '~/api/menu_service';
import { filterDishes } from '~/shadcn/lib/dish_filters';
import { useTranslation } from 'react-i18next';

export function DishListComponent({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const { t } = useTranslation();

  const { data, isLoading, error } = useGetDailyMenu(restaurantId);

  const dishes = data?.dishes ?? [];

  // map UI filter values to the dish_filters expected strings
  const filterValueMap: Record<FilterValue, string> = {
    vegan: 'vegan',
    vegetarian: 'vegetarian',
    lactoseFree: 'lactose-free',
    glutenFree: 'gluten-free',
  };

  const dishFilterStrings = filters.map(f => filterValueMap[f]);

  const filteredDishes: Dish[] = filterDishes(dishes, dishFilterStrings);
  const isMenuNotFound = !!error && /API Error:\s*404\b/.test(error.message);

  if (isLoading) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div
          className="w-full dark:bg-zinc-950 flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="dark:text-white">{t('menu.loadingMenu')}</p>
          </div>
        </div>
        <BottomNav page={'menu'} />
      </div>
    );
  }

  if (error && !isMenuNotFound) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div
          className="w-full dark:bg-zinc-950 flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <div className="text-center text-red-500 dark:text-red-400">
            <p>{t('menu.errorLoadingMenu')}</p>
            <p className="text-sm mt-2">{error.message}</p>
            <p className="text-xs mt-2 dark:text-gray-400">
              {t('menu.restaurantName', { name: restaurantName })}
            </p>
          </div>
        </div>
        <BottomNav page={'menu'} />
      </div>
    );
  }

  if (isMenuNotFound || !dishes || dishes.length === 0) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div
          className="w-full dark:bg-zinc-950 flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <div className="text-center dark:text-white">
            <p>{t('menu.noMenuYet')}</p>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
              {t('menu.restaurantName', { name: restaurantName })}
            </p>
          </div>
        </div>
        <BottomNav page={'menu'} />
      </div>
    );
  }

  return (
    <div className="dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div
        className="w-full dark:bg-zinc-950"
        style={{ height: 'calc(100vh - 150px)' }}
      >
        <div className="px-4 pt-2">
          <FilterBar
            value={filters}
            onChange={setFilters}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 dark:bg-zinc-950">
          <div className="flex flex-col gap-4">
            {filteredDishes.map(dish => (
              <DishInfo
                key={dish.id}
                dish={dish}
              />
            ))}
          </div>
        </div>
      </div>
      <BottomNav page={'menu'} />
    </div>
  );
}
