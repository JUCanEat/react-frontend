import { useQuery, useMutation } from "@tanstack/react-query";
import { rootQueryUrl, menusEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenu } from "~/interfaces";
import { getAccessToken } from "~/api/user_service";

export const useGetDailyMenu = (restaurantId: string) =>
<<<<<<< HEAD
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
=======
  useQuery<DailyMenu>({
    queryKey: ["dailyMenu", restaurantId],
    queryFn: () => apiGet<DailyMenu>(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`),
  });

export const useUpdateDailyMenu = () =>
  useMutation({
    mutationFn: async ({ restaurantId, menu }: { restaurantId: string; menu: any }) => {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error("No authentication token available. Please login first.");
      }

      const response = await fetch(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(menu)
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to update menu (${response.status}): ${text}`);
      }

      return await response.json();
    }
  });

// Version that accepts token directly from Keycloak hook
export const useUpdateDailyMenuWithToken = (token: string) =>
  useMutation({
    mutationFn: async ({ restaurantId, menu }: { restaurantId: string; menu: any }) => {
      if (!token) {
        throw new Error("No authentication token available. Please login first.");
      }

      const response = await fetch(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(menu)
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to update menu (${response.status}): ${text}`);
      }

      // Response is empty (Void), just return success
      return { success: true };
    }
  });
>>>>>>> 0ef298b (Connect form with backend)
