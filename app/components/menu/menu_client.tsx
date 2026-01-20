'use client';

import { DishListComponent } from '~/components/menu/dish_list';
import { useRestaurantStore } from '~/store/restaurant_store';
import { useEffect } from 'react';

export default function MenuClient() {
  const selectedRestaurant = useRestaurantStore(state => state.selectedRestaurant);

  useEffect(() => {
    if (!selectedRestaurant) {
      // eslint-disable-next-line no-console
      console.debug('MenuClient: no restaurant selected — redirecting to /map');
      // Use window.location.replace to avoid calling router hooks during SSR/SSR-hydration edge cases
      if (typeof window !== 'undefined') window.location.replace('/map');
    }
  }, [selectedRestaurant]);

  // eslint-disable-next-line no-console
  console.debug('MenuClient selectedRestaurant:', selectedRestaurant);

  if (!selectedRestaurant) return null; // redirecting

  return <DishListComponent restaurantId={selectedRestaurant.id} />;
}
