import type {
  DayOfWeek,
  Restaurant,
  RestaurantCreateFormData,
  RestaurantManagerUserData,
} from '~/interfaces';
import { DAYS_OF_WEEK } from '~/interfaces';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type RestaurantUpsertPayload = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  photoPath: string;
  openingHours?: {
    dayOfWeek: DayOfWeek;
    openTime: string;
    closeTime: string;
  }[];
};

function toBackendTime(value: string) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

function toUpsertPayload(formData: RestaurantCreateFormData): RestaurantUpsertPayload {
  const payload: RestaurantUpsertPayload = {
    name: formData.name,
    description: formData.description,
    latitude: parseFloat(formData.latitude),
    longitude: parseFloat(formData.longitude),
    photoPath: formData.photoPath,
  };

  if (formData.openingHours && formData.openingHours.length > 0) {
    payload.openingHours = formData.openingHours
      .filter(h => !h.closed)
      .map(h => ({
        dayOfWeek: h.dayOfWeek,
        openTime: toBackendTime(h.openTime),
        closeTime: toBackendTime(h.closeTime),
      }));
  } else if (formData.openingTime && formData.closingTime) {
    payload.openingHours = DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day,
      openTime: toBackendTime(formData.openingTime!),
      closeTime: toBackendTime(formData.closingTime!),
    }));
  }

  return payload;
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

  getRestaurantDetails: async (token: string, restaurantId: string): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Failed to fetch restaurant details (${response.status}): ${errorText}`);
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
    update: import('~/interfaces').UpdateRestaurantRequest
  ): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Failed to update restaurant (${response.status}): ${errorText}`);
    }

    return response.json();
  },
};
