import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl, menusEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenu } from "~/interfaces";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const useGetDailyMenu = (restaurantId: string) =>
    useQuery<DailyMenu>({
        queryKey: ["dailyMenu", restaurantId],
        queryFn: () => apiGet<DailyMenu>(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`),
    });

export const menuService = {
    uploadMenuImage: async (
        restaurantId: string,
        imageFile: File,
        token: string
    ): Promise<void> => {
        const formData = new FormData();
        formData.append("restaurantId", restaurantId);
        formData.append("image", imageFile);

        const response = await fetch(`${API_BASE_URL}/menus`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Upload failed: ${error}`);
        }
    },

    getMenuDraft: async (
        restaurantId: string,
        token: string
    ): Promise<DailyMenu> => {
        const response = await fetch(
            `${API_BASE_URL}/menus/${restaurantId}/draft`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch menu draft");
        }

        return response.json();
    },

    approveMenu: async (
        restaurantId: string,
        menu: DailyMenu,
        token: string
    ): Promise<void> => {
        const response = await fetch(
            `${API_BASE_URL}/menus/${restaurantId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(menu),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to approve menu");
        }
    },
};