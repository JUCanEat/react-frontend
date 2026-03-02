import { rootQueryUrl, allRestaurantsEndpoint } from '~/root';
import { apiGet, useApiPut } from '~/api/api';
import type { Restaurant, RestaurantDetailsDTO, UpdateRestaurantRequest } from '~/interfaces';

export let useGetAllRestaurants = () =>
  apiGet<Restaurant[]>('restaurants', `${rootQueryUrl}/${allRestaurantsEndpoint}`);

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
