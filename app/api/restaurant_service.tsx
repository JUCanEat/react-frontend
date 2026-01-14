import { rootQueryUrl, allRestaurantsEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { Restaurant } from "~/interfaces";
import { apiGet } from "~/api/api";

export let useGetAllRestaurants = () =>
    apiGet<Restaurant[]>("restaurants", `${rootQueryUrl}/${allRestaurantsEndpoint}`);
