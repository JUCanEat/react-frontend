import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  MilkOff,
  Sprout,
  UtensilsCrossed,
  Vegan,
  WheatOff,
  CalendarX2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { SearchBar } from '~/components/overview/search_bar';
import { type FilterValue } from '~/components/overview/filter_bar';
import { useRestaurantItemsWithFilters } from '~/components/overview/service_section/use_restaurant_items_with_filters';
import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';
import { appRoutes } from '~/lib/app_routes';
import { useRestaurantStore } from '~/store/restaurant_store';
import type { Facility, Restaurant, VendingMachine } from '~/interfaces';
import { FacilityInfo } from '~/components/map/facility_info_box';

function RestaurantCard({
  restaurant,
  onOpenDetails,
  onOpenMenu,
  onShowOnMap,
  t,
}: {
  restaurant: Restaurant;
  onOpenDetails: (restaurant: Restaurant) => void;
  onOpenMenu: (restaurant: Restaurant) => void;
  onShowOnMap: (restaurant: Restaurant) => void;
  t: (key: string) => string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(restaurant)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenDetails(restaurant);
        }
      }}
      className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white break-words">
            {restaurant.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {restaurant.description?.trim() || ' '}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            restaurant.openNow
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {restaurant.openNow ? t('overview.open') : t('overview.closed')}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label={t('overview.showOnMap')}
          title={t('overview.showOnMap')}
          className="inline-flex items-center justify-center rounded-md p-1.5 text-[#009DE0] hover:bg-sky-50 dark:hover:bg-sky-900/20"
          onClick={event => {
            event.stopPropagation();
            onShowOnMap(restaurant);
          }}
        >
          <MapPin size={16} />
        </button>

        <button
          type="button"
          className="rounded-lg px-2 py-1 text-sm font-semibold text-[#009DE0] hover:bg-sky-50 dark:hover:bg-sky-900/20"
          onClick={event => {
            event.stopPropagation();
            onOpenMenu(restaurant);
          }}
        >
          <span className="inline-flex items-center gap-1">
            <UtensilsCrossed size={14} />
            <span>{t('overview.viewMenuDirect')}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

function VendingMachineCard({
  vendingMachine,
  onShowOnMap,
  t,
}: {
  vendingMachine: VendingMachine;
  onShowOnMap: (vendingMachine: VendingMachine) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900 p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {vendingMachine.description?.trim() || ' '}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          className="rounded-lg px-2 py-1 text-sm font-semibold text-[#009DE0] hover:bg-sky-50 dark:hover:bg-sky-900/20"
          onClick={() => onShowOnMap(vendingMachine)}
        >
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            <span>{t('overview.showOnMap')}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

export function OverviewComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSelectedRestaurant = useRestaurantStore(state => state.setSelectedRestaurant);
  const [mode, setMode] = React.useState<'restaurants' | 'vending'>('restaurants');
  const [filters, setFilters] = React.useState<FilterValue[]>([]);
  const [query, setQuery] = React.useState('');
  const [selectedPoint, setSelectedPoint] = React.useState<Facility | null>(null);

  const { isPending, error, items } = useRestaurantItemsWithFilters({
    carouselItemSource: useGetAllRestaurants,
    filters,
  });
  const {
    isPending: vendingPending,
    error: vendingError,
    data: vendingMachines,
  } = useGetAllVendingMachines();

  React.useEffect(() => {
    setSelectedPoint(null);
  }, [mode]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = items.filter(item => {
    if (!normalizedQuery) return true;

    const name = (item.name ?? '').toLowerCase();
    const description = (item.description ?? '').toLowerCase();

    return name.includes(normalizedQuery) || description.includes(normalizedQuery);
  });

  const openItems = filteredItems.filter(item => item.openNow);
  const closedItems = filteredItems.filter(item => !item.openNow);
  const filteredVendingMachines = (vendingMachines ?? []).filter(vendingMachine => {
    if (!normalizedQuery) return true;

    const description = (vendingMachine.description ?? '').toLowerCase();
    return description.includes(normalizedQuery);
  });

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedPoint(restaurant);
  };

  const handleViewMenuDirect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate('/menu');
  };

  const handleShowRestaurantOnMap = (restaurant: Restaurant) => {
    navigate(`${appRoutes.map}?restaurantId=${encodeURIComponent(restaurant.id)}`);
  };

  const handleShowVendingOnMap = (vendingMachine: VendingMachine) => {
    navigate(`${appRoutes.map}?vendingMachineId=${encodeURIComponent(vendingMachine.id)}`);
  };

  const toggleFilter = (filter: FilterValue) => {
    setFilters(prev =>
      prev.includes(filter) ? prev.filter(value => value !== filter) : [...prev, filter]
    );
  };

  const filterOptions: Array<{ value: FilterValue; label: string; icon: React.ReactNode }> = [
    { value: 'vegan', label: t('filters.vegan'), icon: <Vegan size={16} /> },
    { value: 'vegetarian', label: t('filters.vegetarian'), icon: <Sprout size={16} /> },
    { value: 'lactoseFree', label: t('filters.lactoseFree'), icon: <MilkOff size={16} /> },
    { value: 'glutenFree', label: t('filters.glutenFree'), icon: <WheatOff size={16} /> },
    ...(mode === 'restaurants'
      ? [
          {
            value: 'hasMenuToday' as FilterValue,
            label: t('filters.hasMenuToday'),
            icon: <CalendarX2 size={16} />,
          },
        ]
      : []),
  ];

  const Section = ({
    title,
    items,
    emptyMessage,
  }: {
    title: string;
    items: Restaurant[];
    emptyMessage: string;
  }) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onOpenDetails={handleRestaurantClick}
              onOpenMenu={handleViewMenuDirect}
              onShowOnMap={handleShowRestaurantOnMap}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-sky-50 via-white to-white dark:from-zinc-800 dark:via-zinc-950 dark:to-black">
      <TopBar isLoginPage={false} />

      <div className="flex-1 overflow-y-auto pb-28 md:pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-1 pb-6 lg:pt-2 lg:pb-8 space-y-4">
          <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mode === 'restaurants'
                    ? t('overview.restaurantsTitle')
                    : t('overview.vendingMachinesTitle')}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                  {mode === 'restaurants'
                    ? t('overview.restaurantsSubtitle')
                    : t('overview.vendingMachinesSubtitle')}
                </p>
              </div>

              <button
                onClick={() => navigate(appRoutes.map)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#009DE0] bg-[#009DE0] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <MapPin size={16} />
                {t('nav.map')}
              </button>
            </div>

            <div className="mt-2 space-y-2">
              <SearchBar
                value={query}
                onChange={setQuery}
                className="!bg-white dark:!bg-black border-gray-300 dark:border-zinc-700 shadow-sm"
              />

              {mode === 'restaurants' && (
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
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="w-full">
              <div className="flex w-full rounded-lg border border-gray-200/80 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/70 p-1">
                <button
                  type="button"
                  onClick={() => setMode('restaurants')}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-center transition-colors ${
                    mode === 'restaurants'
                      ? 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {t('overview.restaurants')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('vending')}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-center transition-colors ${
                    mode === 'vending'
                      ? 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {t('overview.vendingMachines')}
                </button>
              </div>
            </div>

            {mode === 'restaurants' && filters.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {filters.length} {filters.length === 1 ? 'filter' : 'filters'}
              </p>
            )}

            {mode === 'restaurants' && isPending && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('map.loading')}</p>
            )}

            {mode === 'vending' && vendingPending && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('map.loading')}</p>
            )}

            {mode === 'restaurants' && Boolean(error) && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('overview.loadingRestaurantsError')}
              </p>
            )}

            {mode === 'vending' && Boolean(vendingError) && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('overview.loadingVendingMachinesError')}
              </p>
            )}

            {mode === 'restaurants' && !isPending && !error && filteredItems.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('map.noRestaurantsFound')}
              </p>
            )}

            {mode === 'vending' &&
              !vendingPending &&
              !vendingError &&
              filteredVendingMachines.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('map.noVendingMachinesFound')}
                </p>
              )}

            {mode === 'restaurants' && !isPending && !error && filteredItems.length > 0 && (
              <div className="space-y-4">
                <Section
                  title={t('overview.open')}
                  items={openItems}
                  emptyMessage={t('map.noRestaurantsFound')}
                />
                <Section
                  title={t('overview.closed')}
                  items={closedItems}
                  emptyMessage={t('map.noRestaurantsFound')}
                />
              </div>
            )}

            {mode === 'vending' &&
              !vendingPending &&
              !vendingError &&
              filteredVendingMachines.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredVendingMachines.map(vendingMachine => (
                      <VendingMachineCard
                        key={vendingMachine.id}
                        vendingMachine={vendingMachine}
                        onShowOnMap={handleShowVendingOnMap}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              )}
          </section>
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
