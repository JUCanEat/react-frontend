import { useQuery } from '@tanstack/react-query';
import { rootQueryUrl, allRestaurantsEndpoint } from '~/root';
import { apiGet, useApiPut } from '~/api/api';
import type {
  Restaurant,
  RankedRestaurant,
  RestaurantDetailsDTO,
  UpdateRestaurantRequest,
} from '~/interfaces';

export let useGetAllRestaurants = () =>
  apiGet<Restaurant[]>('restaurants', `${rootQueryUrl}/${allRestaurantsEndpoint}`);

export let useGetRestaurantRecommendations = (token: string | undefined) =>
  useQuery<RankedRestaurant[]>({
    queryKey: ['restaurantRecommendations', token],
    queryFn: async () => {
      const response = await fetch(`${rootQueryUrl}/${allRestaurantsEndpoint}/recommendation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return response.json() as Promise<RankedRestaurant[]>;
    },
    enabled: !!token,
  });

export let useGetRestaurantDetails = (id: string) =>
  apiGet<RestaurantDetailsDTO>(
    `restaurant-${id}`,
    `${rootQueryUrl}/${allRestaurantsEndpoint}/${id}`
  );

export let useGetRestaurantOwners = (id: string) =>
  apiGet<string[]>(
    `restaurant-owners-${id}`,
    `${rootQueryUrl}/${allRestaurantsEndpoint}/${id}/owners`
  );

export let useUpdateRestaurant = (id: string) =>
  useApiPut<UpdateRestaurantRequest, RestaurantDetailsDTO>(
    `${rootQueryUrl}/${allRestaurantsEndpoint}/${id}`
  );
