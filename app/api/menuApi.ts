const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export interface DishDTO {
    id?: string;
    name: string;
    category: string;
    price: number;
    allergens: string[];
}

export interface DailyMenuDTO {
    id: string;
    date: string;
    dishes: DishDTO[];
}

export const menuApi = {
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
    ): Promise<DailyMenuDTO> => {
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
        menu: DailyMenuDTO,
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