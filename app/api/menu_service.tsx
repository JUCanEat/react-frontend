<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, menusEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenu } from "~/interfaces";

export const useGetDailyMenu = (restaurantId: string) =>
    useQuery<DailyMenu>({
        queryKey: ["dailyMenu", restaurantId],
        queryFn: () => apiGet<DailyMenu>(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`),
    });
=======
import { rootQueryUrl } from "~/root";
import { apiPut } from "~/api/api";
import type { DailyMenuDTO } from "~/interfaces";

export const useUpdateDailyMenu = (restaurantId: string, menu: DailyMenuDTO) =>
  apiPut<DailyMenuDTO>(
    `menu/add`,
    `http://localhost:8080/api/menus/${restaurantId}`,
  );

  //CZY SIE PRZESYLA??? IDK -mb cause i am not the restautant owner
  //todo: create a new restaurant and test!!!
>>>>>>> bbc7e76 (Add form for manual menu addition)
