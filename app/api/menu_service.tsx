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