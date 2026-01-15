import { useQuery } from "@tanstack/react-query";
import { rootQueryUrl } from "~/root";

export interface RestaurantListDTO {
  id: string;
  name: string;
  description: string;
  openNow: boolean;
}

export interface UserProfileDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  favourites: any[];
  ownedRestaurants: RestaurantListDTO[];
}

import { getKeycloak } from "~/auth/keycloak";

// Helper to safely access localStorage (for SSR compatibility)
function getStoredToken(): string {
  if (typeof window === 'undefined') return "";
  return localStorage.getItem("access_token") || "";
}

// Get access token from Keycloak
export function getAccessToken(): string {
  const keycloak = getKeycloak();
  if (!keycloak) return getStoredToken();
  return keycloak.token || getStoredToken() || "";
}

export const useGetCurrentUser = () => {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? getAccessToken() : null;
  
  return useQuery<UserProfileDTO>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = getAccessToken();
      const response = await fetch(`${rootQueryUrl}/api/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }
      
      return response.json() as Promise<UserProfileDTO>;
    },
    enabled: isBrowser && !!token, // Only fetch on browser and if token exists
  });
};

export const useGetCurrentUserWithToken = (token: string | undefined) => {
  const isBrowser = typeof window !== 'undefined';

  return useQuery<UserProfileDTO>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch(`${rootQueryUrl}/api/users/me`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      return response.json() as Promise<UserProfileDTO>;
    },
    enabled: isBrowser && !!token,
  });
};

// get just the first owned restaurant for the current user - for menu_form backend integration
export const useGetFirstOwnedRestaurant = (token: string | undefined) => {
  const isBrowser = typeof window !== 'undefined';

  return useQuery<string>({
    queryKey: ["firstOwnedRestaurant"],
    queryFn: async () => {
      const response = await fetch(`${rootQueryUrl}/api/users/me/restaurant`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch restaurant: ${response.statusText}`);
      }

      return response.json() as Promise<string>;
    },
    enabled: isBrowser && !!token,
  });
};
