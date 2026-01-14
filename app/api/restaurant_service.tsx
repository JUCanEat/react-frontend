import { rootQueryUrl, allRestaurantsEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { Restaurant } from "~/interfaces";

export let useGetAllRestaurants = () =>
    apiGet<Restaurant[]>("restaurants", `${rootQueryUrl}/${allRestaurantsEndpoint}`);
