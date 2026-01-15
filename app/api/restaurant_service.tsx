import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, allRestaurantsEndpoint } from "~/root";
import type { Restaurant } from "~/interfaces";
import { apiGet } from "~/api/api";

export let useGetAllRestaurants = () =>
    useQuery<Restaurant[]>({
        queryKey: ["restaurants"],
        queryFn: () => apiGet<Restaurant[]>(`${rootQueryUrl}/${allRestaurantsEndpoint}`),
    });