import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, allRestaurantsEndpoint } from "~/root";
import type { Restaurant } from "~/interfaces";

export let useGetAllRestaurants = () =>
  useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await fetch(`${rootQueryUrl}/${allRestaurantsEndpoint}`);
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      return res.json();
    },
  });
