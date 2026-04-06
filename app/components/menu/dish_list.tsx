/**
 Dishes in the menu section can be filtered with allergen-based filters.
 A dish is filtered out when it contains allergen that conflicts with the filter (like for "GLUTEN" allergen and "gluten-free" filter).
 */

import { type FilterValue } from '~/components/overview/filter_bar';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { DishInfo } from '~/components/menu/dish/dish_info_box';
import { SearchBar } from '~/components/overview/search_bar';
import type { Dish } from '~/interfaces';
import { useState, type ReactNode } from 'react';
import { useGetDailyMenu } from '~/api/menu_service';
import { filterDishes } from '~/shadcn/lib/dish_filters';
import { useTranslation } from 'react-i18next';
import { MapPin, MilkOff, Sprout, Vegan, WheatOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '~/lib/app_routes';

export function DishListComponent({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDailyMenu(restaurantId);

  const dishes = data?.dishes ?? [];

  const toggleFilter = (filter: FilterValue) => {
    setFilters(prev =>
      prev.includes(filter) ? prev.filter(value => value !== filter) : [...prev, filter]
    );
  };

  const filterOptions: Array<{ value: FilterValue; label: string; icon: ReactNode }> = [
    { value: 'vegan', label: t('filters.vegan'), icon: <Vegan size={16} /> },
    { value: 'vegetarian', label: t('filters.vegetarian'), icon: <Sprout size={16} /> },
    { value: 'lactoseFree', label: t('filters.lactoseFree'), icon: <MilkOff size={16} /> },
    { value: 'glutenFree', label: t('filters.glutenFree'), icon: <WheatOff size={16} /> },
  ];

  // map UI filter values to the dish_filters expected strings
  const filterValueMap: Record<FilterValue, string> = {
    vegan: 'vegan',
    vegetarian: 'vegetarian',
    lactoseFree: 'lactose-free',
    glutenFree: 'gluten-free',
  };

  const dishFilterStrings = filters.map(f => filterValueMap[f]);
  const filteredByAllergens: Dish[] = filterDishes(dishes, dishFilterStrings);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredDishes = filteredByAllergens.filter(dish => {
    if (!normalizedQuery) return true;
    const name = (dish.name ?? '').toLowerCase();
    const description = (dish.description ?? '').toLowerCase();
    return name.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
  const soupDishes = filteredDishes.filter(dish => (dish.category ?? '').toUpperCase() === 'SOUP');
  const mainCourseDishes = filteredDishes.filter(
    dish => (dish.category ?? 'MAIN_COURSE').toUpperCase() !== 'SOUP'
  );
  const isMenuNotFound = !!error && /API Error:\s*404\b/.test(error.message);

  return (
    <div className="flex justify-center dark:bg-zinc-950 min-h-screen overflow-hidden">
      <div className="dark:bg-zinc-950 max-w-3xl w-full flex flex-col">
        <TopBar isLoginPage={false} />
        <div className="pt-0 pl-5 pr-5 dark:bg-zinc-950 flex-1 flex flex-col">
          <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 shadow-sm p-4 sm:p-5 mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {t('menu.dishesTitle', { name: restaurantName })}
                </h1>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`${appRoutes.map}?restaurantId=${encodeURIComponent(restaurantId)}`)
                  }
                  aria-label={t('map.goToMap')}
                  title={t('map.goToMap')}
                  className="inline-flex items-center justify-center rounded-md p-1 text-[#009DE0] transition-all duration-200 ease-out hover:bg-sky-50 hover:scale-105 dark:hover:bg-sky-900/20"
                >
                  <MapPin size={15} />
                </button>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                {t('menu.dishesSubtitle')}
              </p>
            </div>

            <div className="mt-2 space-y-2">
              <SearchBar
                value={query}
                onChange={setQuery}
                className="!bg-white dark:!bg-black border-gray-300 dark:border-zinc-700 shadow-sm"
              />

              <div>
                <div className="overflow-x-auto overflow-y-hidden">
                  <div className="flex gap-2 min-w-max pr-1">
                    {filterOptions.map(option => {
                      const active = filters.includes(option.value);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleFilter(option.value)}
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                            active
                              ? 'border-[#009DE0] bg-sky-50 dark:bg-sky-900/20 text-[#009DE0]'
                              : 'border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="shrink-0">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex-1">
            {isLoading && (
              <div
                className="w-full dark:bg-zinc-950 flex items-center justify-center"
                style={{ height: 'calc(100vh - 230px)' }}
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="dark:text-white">{t('menu.loadingMenu')}</p>
                </div>
              </div>
            )}

            {!isLoading && error && !isMenuNotFound && (
              <div
                className="w-full dark:bg-zinc-950 flex items-center justify-center"
                style={{ height: 'calc(100vh - 230px)' }}
              >
                <div className="text-center text-red-500 dark:text-red-400">
                  <p>{t('menu.errorLoadingMenu')}</p>
                  <p className="text-sm mt-2">{error.message}</p>
                  <p className="text-xs mt-2 dark:text-gray-400">
                    {t('menu.restaurantName', { name: restaurantName })}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && (isMenuNotFound || !dishes || dishes.length === 0) && (
              <div
                className="w-full dark:bg-zinc-950 flex items-center justify-center"
                style={{ height: 'calc(100vh - 230px)' }}
              >
                <div className="text-center dark:text-white">
                  <p>{t('menu.noMenuYet')}</p>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    {t('menu.restaurantName', { name: restaurantName })}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && dishes.length > 0 && (
              <>
                <div className="flex-1 overflow-y-auto pb-24 pt-2 dark:bg-zinc-950">
                  <div className="space-y-4">
                    <section className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t('menuForm.categorySoup')}
                        </h3>
                        <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {soupDishes.length}
                        </span>
                      </div>

                      {soupDishes.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t('menu.noDishes')}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {soupDishes.map(dish => (
                            <DishInfo
                              key={dish.id}
                              dish={dish}
                            />
                          ))}
                        </div>
                      )}
                    </section>

                    <section className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t('menuForm.categoryMainCourse')}
                        </h3>
                        <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {mainCourseDishes.length}
                        </span>
                      </div>

                      {mainCourseDishes.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t('menu.noDishes')}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {mainCourseDishes.map(dish => (
                            <DishInfo
                              key={dish.id}
                              dish={dish}
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </>
            )}
          </div>
          <BottomNav page={'menu'} />
        </div>
      </div>
    </div>
  );
}
