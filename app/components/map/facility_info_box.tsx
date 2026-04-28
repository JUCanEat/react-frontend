'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantStore } from '~/store/restaurant_store';
import type { FacilityInfoProps, Restaurant, Facility } from '~/interfaces';
import { useTranslation } from 'react-i18next';
import { allRestaurantsEndpoint, rootQueryUrl } from '~/root';
import { appRoutes } from '~/lib/app_routes';

import { Clock3, MapPin } from 'lucide-react';

export function FacilityInfo({
  selectedPoint,
  onClose,
  showGoToMapButton = true,
  onNavigateTo,
  navigateDisabled = false,
}: FacilityInfoProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setSelectedRestaurant = useRestaurantStore(s => s.setSelectedRestaurant);
  const [restaurantDetails, setRestaurantDetails] = React.useState<Restaurant | null>(null);
  const [isLoadingRestaurantDetails, setIsLoadingRestaurantDetails] = React.useState(false);

  const isRestaurant = Boolean(selectedPoint && 'name' in selectedPoint);
  const selectedRestaurant = isRestaurant ? (selectedPoint as Restaurant) : null;
  const hoursSourceRestaurant = restaurantDetails ?? selectedRestaurant;

  React.useEffect(() => {
    let isActive = true;

    if (!selectedRestaurant?.id) {
      setRestaurantDetails(null);
      setIsLoadingRestaurantDetails(false);
      return () => {
        isActive = false;
      };
    }

    setIsLoadingRestaurantDetails(true);

    void fetch(`${rootQueryUrl}/${allRestaurantsEndpoint}/${selectedRestaurant.id}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Failed to load restaurant details (${response.status})`);
        }
        return (await response.json()) as Restaurant;
      })
      .then(details => {
        if (isActive) {
          setRestaurantDetails(details);
        }
      })
      .catch(() => {
        if (isActive) {
          setRestaurantDetails(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingRestaurantDetails(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedRestaurant?.id]);

  const toDisplayTime = (time?: string) => {
    if (!time) return '';
    return time.length >= 5 ? time.slice(0, 5) : time;
  };

  const getTodayOpeningHours = (restaurant: Restaurant) => {
    if (!restaurant.openingHours?.length) return null;

    const dayMap: Record<number, string> = {
      0: 'SUNDAY',
      1: 'MONDAY',
      2: 'TUESDAY',
      3: 'WEDNESDAY',
      4: 'THURSDAY',
      5: 'FRIDAY',
      6: 'SATURDAY',
    };

    const today = dayMap[new Date().getDay()];
    return restaurant.openingHours.find(hours => hours.dayOfWeek === today) ?? null;
  };

  const openingHoursText = React.useMemo(() => {
    if (!hoursSourceRestaurant) return '';

    if (isLoadingRestaurantDetails) {
      return t('map.loading');
    }

    const todayHours = getTodayOpeningHours(hoursSourceRestaurant);
    if (todayHours?.openTime && todayHours?.closeTime) {
      return `${toDisplayTime(todayHours.openTime)} - ${toDisplayTime(todayHours.closeTime)}`;
    }

    if (hoursSourceRestaurant.openingTime && hoursSourceRestaurant.closingTime) {
      return `${toDisplayTime(hoursSourceRestaurant.openingTime)} - ${toDisplayTime(hoursSourceRestaurant.closingTime)}`;
    }

    return t('map.openingHoursUnavailable');
  }, [hoursSourceRestaurant, isLoadingRestaurantDetails, t]);

  if (!selectedPoint) return null;

  const handleGoToDishes = () => {
    if (!isRestaurant) return;
    setSelectedRestaurant((restaurantDetails as Restaurant) ?? (selectedPoint as Restaurant));
    navigate('/menu');
  };

  const handleGoToMap = () => {
    if (selectedRestaurant?.id) {
      navigate(`${appRoutes.map}?restaurantId=${encodeURIComponent(selectedRestaurant.id)}`);
    } else {
      navigate(appRoutes.map);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full max-w-sm items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">
            {isRestaurant ? (selectedPoint as Restaurant).name : t('map.vendingMachine')}
          </h3>
          {showGoToMapButton && (
            <button
              type="button"
              onClick={handleGoToMap}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[#009DE0] hover:bg-sky-50 dark:hover:bg-sky-900/20"
            >
              <MapPin
                className="text-current"
                size={13}
              />
              <span>{t('map.goToMap')}</span>
            </button>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-2">{selectedPoint.description}</p>

        {isRestaurant && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock3 size={14} />
            <span className="font-medium">{t('map.openingHours')}:</span>
            <span>{openingHoursText}</span>
          </div>
        )}

        <div className="flex gap-2 mt-8 justify-end">
          {onNavigateTo && (
            <button
              type="button"
              disabled={navigateDisabled}
              onClick={() => {
                if (navigateDisabled) return;
                onNavigateTo(selectedPoint);
                onClose();
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                navigateDisabled
                  ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-zinc-700 dark:text-zinc-500'
                  : 'border-[#009DE0] text-[#009DE0] hover:bg-sky-50 dark:hover:bg-sky-900/20'
              }`}
            >
              {t('map.navigate')}
            </button>
          )}
          {isRestaurant && (
            <button
              type="button"
              onClick={handleGoToDishes}
              className="relative z-10 rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {t('map.goToTodayMenu')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
