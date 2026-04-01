import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, UtensilsCrossed } from 'lucide-react';

import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { SearchBar } from '~/components/overview/search_bar';
import { FilterBar, type FilterValue } from '~/components/overview/filter_bar';
import { useRestaurantItemsWithFilters } from '~/components/overview/service_section/use_restaurant_items_with_filters';
import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useTranslation } from 'react-i18next';
import { appRoutes } from '~/lib/app_routes';
import { useRestaurantStore } from '~/store/restaurant_store';
import type { Facility, Restaurant } from '~/interfaces';
import { FacilityInfo } from '~/components/map/facility_info_box';

export function OverviewAlternativeComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSelectedRestaurant = useRestaurantStore(state => state.setSelectedRestaurant);
  const [filters, setFilters] = React.useState<FilterValue[]>([]);
  const [query, setQuery] = React.useState('');
  const [selectedPoint, setSelectedPoint] = React.useState<Facility | null>(null);

  const { isPending, error, items } = useRestaurantItemsWithFilters({
    carouselItemSource: useGetAllRestaurants,
    filters,
  });

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter(item => {
    if (!normalizedQuery) return true;

    const name = (item.name ?? '').toLowerCase();
    const description = (item.description ?? '').toLowerCase();

    return name.includes(normalizedQuery) || description.includes(normalizedQuery);
  });

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedPoint(restaurant);
  };

  const handleViewMenuDirect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate('/menu');
  };

  return (
    <div className="dark:bg-zinc-950 h-screen w-full flex flex-col overflow-hidden">
      <TopBar isLoginPage={false} />

      <div
        className="w-full overflow-y-auto dark:bg-zinc-950"
        style={{ minHeight: 'calc(100vh - 150px)' }}
      >
        <div className="pt-5 px-4 sm:px-5 lg:px-8 pb-32 md:pb-14 dark:bg-zinc-950 flex flex-col gap-4">
          <div className="flex items-stretch gap-2">
            <div className="flex-1 min-w-0">
              <SearchBar
                value={query}
                onChange={setQuery}
                className="!bg-white dark:!bg-black border-gray-300 dark:border-zinc-700 shadow-md h-full"
              />
            </div>
            <button
              onClick={() => navigate(appRoutes.map)}
              className="shrink-0 rounded-xl border border-[#009DE0] bg-[#009DE0] text-white px-3 sm:px-4 py-2 shadow-md flex items-center justify-center gap-1.5 font-semibold text-sm whitespace-nowrap"
            >
              <MapPin size={16} />
              <span>{t('nav.map')}</span>
            </button>
          </div>

          <FilterBar
            value={filters}
            onChange={setFilters}
          />

          <div className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('overview.restaurants')}
            </h2>

            {isPending && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('map.loading')}</p>
            )}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('overview.loadingRestaurantsError')}
              </p>
            )}

            {!isPending && !error && filteredItems.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('map.noRestaurantsFound')}
              </p>
            )}

            <div className="space-y-3">
              {filteredItems.map(restaurant => (
                <div
                  key={restaurant.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRestaurantClick(restaurant)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleRestaurantClick(restaurant);
                    }
                  }}
                  className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white break-words min-w-0">
                      {restaurant.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold shrink-0 ${
                        restaurant.openNow
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {restaurant.openNow ? t('overview.open') : t('overview.closed')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words">
                    {restaurant.description}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      aria-label={t('overview.viewMenuDirect')}
                      title={t('overview.viewMenuDirect')}
                      onClick={event => {
                        event.stopPropagation();
                        handleViewMenuDirect(restaurant);
                      }}
                      className="rounded-md border border-[#009DE0] bg-[#009DE0] text-white p-2 hover:opacity-90"
                    >
                      <UtensilsCrossed size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FacilityInfo
        selectedPoint={selectedPoint}
        onClose={() => setSelectedPoint(null)}
      />

      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNav page="overview" />
      </div>
    </div>
  );
}
