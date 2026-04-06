import { useQuery, useMutation } from '@tanstack/react-query';
import { rootQueryUrl, menusEndpoint } from '~/root';
import type { DailyMenu, DailyMenuDTO } from '~/interfaces';
import { getAccessToken } from '~/api/user_service';
import i18n from '~/i18n';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
const MENU_DRAFTS_STORAGE_KEY = 'jucaneat.menu.drafts.v1';

export type MenuDraftSource = 'photo' | 'manual';
export type MenuStatus = 'ACTIVE' | 'SCHEDULED' | string;
export type PublishedMenu = DailyMenu & { status?: MenuStatus };

export type StoredMenuDraft = {
  id: string;
  restaurantId: string;
  date: string;
  dishes: DailyMenuDTO['dishes'];
  updatedAt: string;
  source: MenuDraftSource;
};

function readLocalDrafts(): StoredMenuDraft[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(MENU_DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredMenuDraft[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalDrafts(drafts: StoredMenuDraft[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MENU_DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
}

function createDraftId() {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toStoredDraft(
  restaurantId: string,
  menu: DailyMenuDTO,
  source: MenuDraftSource,
  id?: string
): StoredMenuDraft {
  return {
    id: id ?? createDraftId(),
    restaurantId,
    date: menu.date,
    dishes: menu.dishes,
    updatedAt: new Date().toISOString(),
    source,
  };
}

function upsertLocalDraft(
  restaurantId: string,
  menu: DailyMenuDTO,
  source: MenuDraftSource,
  draftId?: string
) {
  const drafts = readLocalDrafts();
  const stored = toStoredDraft(restaurantId, menu, source, draftId);
  const nextDrafts = drafts.filter(d => d.id !== stored.id);
  nextDrafts.push(stored);
  writeLocalDrafts(nextDrafts);
  return stored;
}

function getUiLanguageCode() {
  return (i18n.language || 'en').split('-')[0].toLowerCase();
}

function mapLocalizedDishes(rawDishes: any[]): DailyMenu['dishes'] {
  return (rawDishes || []).map((item: any) => {
    const dishData = item?.dish ?? item;
    return {
      id: dishData?.id ?? '',
      name: item?.displayName || dishData?.name || '',
      description: dishData?.description || '',
      image: dishData?.image || '',
      category: dishData?.category || 'MAIN_COURSE',
      price: String(item?.price ?? dishData?.price ?? '0'),
      allergens: Array.isArray(dishData?.allergens) ? dishData.allergens : [],
    } as any;
  });
}

function mapMenuResponse(raw: any): DailyMenu {
  return {
    id: raw?.id ?? '',
    date: raw?.date ?? '',
    dishes: mapLocalizedDishes(raw?.dishes || []),
  } as DailyMenu;
}

function normalizeMenuStatus(rawStatus?: string, date?: string): 'ACTIVE' | 'SCHEDULED' {
  const normalized = (rawStatus || '').toUpperCase();
  if (normalized === 'SCHEDULED') return 'SCHEDULED';
  if (normalized === 'ACTIVE' || normalized === 'PUBLISHED') return 'ACTIVE';

  if (date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const menuDate = new Date(`${date.slice(0, 10)}T00:00:00`);
    if (!Number.isNaN(menuDate.getTime()) && menuDate > today) {
      return 'SCHEDULED';
    }
  }

  return 'ACTIVE';
}

// React Query hooks
export const useGetDailyMenu = (restaurantId: string) =>
  useQuery<DailyMenu | null>({
    queryKey: ['dailyMenu', restaurantId, i18n.language],
    queryFn: async () => {
      const currentLanguage = getUiLanguageCode();
      const response = await fetch(
        `${rootQueryUrl}/${menusEndpoint}/${restaurantId}/localized?language=${currentLanguage}`
      );
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const data = await response.json();

      return mapMenuResponse(data);
    },
  });

export const useUpdateDailyMenu = () =>
  useMutation({
    mutationFn: async ({ restaurantId, menu }: { restaurantId: string; menu: any }) => {
      const token = getAccessToken();
      const currentLanguage = getUiLanguageCode();

      if (!token) {
        throw new Error('No authentication token available. Please login first.');
      }

      const response = await fetch(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': currentLanguage,
        },
        body: JSON.stringify(menu),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to update menu (${response.status}): ${text}`);
      }

      return await response.json();
    },
  });

// Version that accepts token directly from Keycloak hook
export const useUpdateDailyMenuWithToken = (token: string) =>
  useMutation({
    mutationFn: async ({ restaurantId, menu }: { restaurantId: string; menu: any }) => {
      if (!token) {
        throw new Error('No authentication token available. Please login first.');
      }

      const currentLanguage = getUiLanguageCode();

      const response = await fetch(`${rootQueryUrl}/${menusEndpoint}/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': currentLanguage,
        },
        body: JSON.stringify(menu),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to update menu (${response.status}): ${text}`);
      }

      // Response is empty (Void), just return success
      return { success: true };
    },
  });

export const useSaveMenuDraftWithToken = (token: string) =>
  useMutation({
    mutationFn: async ({
      restaurantId,
      menu,
      source = 'manual',
      draftId,
    }: {
      restaurantId: string;
      menu: DailyMenuDTO;
      source?: MenuDraftSource;
      draftId?: string;
    }) => {
      if (!token) {
        throw new Error('No authentication token available. Please login first.');
      }

      return menuService.saveMenuDraft(restaurantId, menu, token, source, draftId);
    },
  });

// Direct API calls for menu management (for staff features)
export const menuService = {
  getActiveMenu: async (restaurantId: string): Promise<DailyMenu | null> => {
    const response = await fetch(`${API_BASE_URL}/menus/${restaurantId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.text().catch(() => '');
      throw new Error(`Failed to fetch active menu (${response.status}): ${error}`);
    }

    return response.json();
  },

  hasActiveMenuForDate: async (restaurantId: string, date: string): Promise<boolean> => {
    const menus = await menuService.getPublishedMenus(restaurantId);
    const normalizedDate = date.slice(0, 10);

    return menus.some(menu => {
      if (!menu?.date) return false;
      const status = (menu.status ?? 'ACTIVE').toString().toUpperCase();
      const isBlockingStatus =
        status === 'ACTIVE' || status === 'SCHEDULED' || status === 'PUBLISHED';
      return isBlockingStatus && menu.date.slice(0, 10) === normalizedDate;
    });
  },

  getPublishedMenus: async (restaurantId: string): Promise<PublishedMenu[]> => {
    try {
      const token = getAccessToken();
      const currentLanguage = getUiLanguageCode();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept-Language': currentLanguage,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const parsePublishedMenuList = (data: any): PublishedMenu[] => {
        const list = Array.isArray(data) ? data : data?.menus;

        if (!Array.isArray(list)) {
          return [];
        }

        return list.map((item: any) => ({
          ...mapMenuResponse(item),
          status: normalizeMenuStatus(item?.status, item?.date),
        })) as PublishedMenu[];
      };

      // Prefer planned/localized because it includes SCHEDULED menus used in edit-published panel.
      const plannedResponse = await fetch(
        `${API_BASE_URL}/menus/${restaurantId}/planned/localized?language=${currentLanguage}`,
        {
          headers,
        }
      );

      if (plannedResponse.ok) {
        const plannedData = await plannedResponse.json();
        return parsePublishedMenuList(plannedData);
      }

      // Fallback to /published for backends exposing this route only.
      if (plannedResponse.status === 404) {
        const publishedResponse = await fetch(`${API_BASE_URL}/menus/${restaurantId}/published`, {
          headers,
        });

        if (publishedResponse.status === 404) {
          return [];
        }

        if (publishedResponse.ok) {
          const publishedData = await publishedResponse.json();
          return parsePublishedMenuList(publishedData);
        }
      }

      const errorText = await plannedResponse.text().catch(() => '');
      throw new Error(`Failed to fetch planned menus (${plannedResponse.status}): ${errorText}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching published menus:', err);
      // Fallback below.
    }

    const activeMenu = await menuService.getActiveMenu(restaurantId);
    if (!activeMenu) return [];

    return [{ ...activeMenu, status: 'ACTIVE' }];
  },

  uploadMenuImage: async (restaurantId: string, imageFile: File, token: string): Promise<void> => {
    const formData = new FormData();
    formData.append('restaurantId', restaurantId);
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
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

  getMenuDraft: async (restaurantId: string, token: string): Promise<any> => {
    const currentLanguage = getUiLanguageCode();
    const response = await fetch(
      `${API_BASE_URL}/menus/${restaurantId}/draft?language=${currentLanguage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': currentLanguage,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch menu draft');
    }

    return response.json();
  },

  getManagedDraft: async (restaurantId: string, token: string): Promise<DailyMenuDTO | null> => {
    try {
      const serverDraft = await menuService.getMenuDraft(restaurantId, token);
      const normalizedDraft = mapMenuResponse(serverDraft);
      return {
        id: normalizedDraft.id,
        date: normalizedDraft.date,
        dishes: (normalizedDraft.dishes ?? []).map((dish: any) => ({
          id: dish.id,
          name: dish.name,
          category: dish.category ?? 'MAIN_COURSE',
          price: typeof dish.price === 'number' ? dish.price : Number(dish.price ?? 0),
          allergens: dish.allergens ?? [],
        })),
      };
    } catch {
      const local = menuService.listLocalDrafts(restaurantId)[0];
      if (!local) return null;

      return {
        id: local.id,
        date: local.date,
        dishes: local.dishes,
      };
    }
  },

  saveMenuDraft: async (
    restaurantId: string,
    menu: DailyMenuDTO,
    token: string,
    source: MenuDraftSource,
    draftId?: string
  ): Promise<{ savedTo: 'backend' | 'local'; draftId?: string }> => {
    const stored = upsertLocalDraft(restaurantId, menu, source, draftId);

    try {
      const currentLanguage = getUiLanguageCode();
      const response = await fetch(`${API_BASE_URL}/menus/${restaurantId}/draft`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept-Language': currentLanguage,
        },
        body: JSON.stringify(menu),
      });

      if (response.ok) {
        return { savedTo: 'backend', draftId: stored.id };
      }
    } catch {
      // Fall back to local storage when backend is unavailable / CORS / network fails.
    }

    return { savedTo: 'local', draftId: stored.id };
  },

  getLocalDraftById: (draftId: string): StoredMenuDraft | null => {
    const draft = readLocalDrafts().find(d => d.id === draftId);
    return draft ?? null;
  },

  deleteLocalDraft: (draftId: string) => {
    const drafts = readLocalDrafts().filter(d => d.id !== draftId);
    writeLocalDrafts(drafts);
  },

  listLocalDrafts: (restaurantId?: string): StoredMenuDraft[] => {
    const drafts = readLocalDrafts();
    const filtered = restaurantId ? drafts.filter(d => d.restaurantId === restaurantId) : drafts;

    return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  approveMenu: async (restaurantId: string, menu: DailyMenu, token: string): Promise<void> => {
    const currentLanguage = getUiLanguageCode();
    const response = await fetch(`${API_BASE_URL}/menus/${restaurantId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept-Language': currentLanguage,
      },
      body: JSON.stringify(menu),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to approve menu (${response.status}): ${text}`);
    }
  },
};
