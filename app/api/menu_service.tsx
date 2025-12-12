import { rootQueryUrl, menuEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenuDTO } from "~/interfaces";

export const useGetDailyMenu = (restaurantId: string) =>
  apiGet<DailyMenuDTO>(
    `dailyMenu-${restaurantId}`,
    `${rootQueryUrl}/${menuEndpoint}/${restaurantId}`
  );
