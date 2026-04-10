import type { Restaurant, RestaurantCreateFormData, RestaurantManagerUserData } from '~/interfaces';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type RestaurantUpsertPayload = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  photoPath: string;
};

function toUpsertPayload(formData: RestaurantCreateFormData): RestaurantUpsertPayload {
  return {
    ...formData,
    latitude: parseFloat(formData.latitude),
    longitude: parseFloat(formData.longitude),
  };
}

export const restaurantManagerService = {
  getCurrentUserData: async (token: string): Promise<RestaurantManagerUserData> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Failed to fetch user data (${response.status}): ${errorText}`);
    }

    return response.json();
  },

  createRestaurant: async (
    token: string,
    formData: RestaurantCreateFormData
  ): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(toUpsertPayload(formData)),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Failed to create restaurant (${response.status}): ${errorText}`);
    }

    return response.json();
  },

  updateRestaurant: async (
    token: string,
    restaurantId: string,
    formData: RestaurantCreateFormData
  ): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(toUpsertPayload(formData)),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Failed to update restaurant (${response.status}): ${errorText}`);
    }

    return response.json();
  },
};
