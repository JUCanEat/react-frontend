import { useQuery, useMutation } from "@tanstack/react-query";
import { rootQueryUrl, menusEndpoint } from "~/root";
import { apiGet } from "~/api/api";
import type { DailyMenu } from "~/interfaces";
import { getAccessToken } from "~/api/user_service";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// React Query hooks
export const useGetDailyMenu = (restaurantId: string) =>
    apiGet<DailyMenu>("dailyMenu", `${rootQueryUrl}/${menusEndpoint}/${restaurantId}`);

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

// Direct API calls for menu management (for staff features)
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