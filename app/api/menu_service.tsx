import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, menusEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenu } from "~/interfaces";

export const useGetDailyMenu = (restaurantId: string) =>
  useQuery<DailyMenu>({
    queryKey: ["dailyMenu", restaurantId],
    queryFn: () => apiGet<DailyMenu>(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`),
  });