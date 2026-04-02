export const menuRoutes = {
  view: '/menu',
  viewForRestaurant: (restaurantId: string) =>
    `/menu?restaurantId=${encodeURIComponent(restaurantId)}`,

  staffBase: (restaurantId: string) => `/staff/menu/${encodeURIComponent(restaurantId)}`,
  staffPhoto: (restaurantId: string) => `/staff/menu/${encodeURIComponent(restaurantId)}/photo`,
  staffForm: (restaurantId: string) => `/staff/menu/${encodeURIComponent(restaurantId)}/form`,
  staffDrafts: (restaurantId: string) => `/staff/menu/${encodeURIComponent(restaurantId)}/drafts`,
  staffPublished: (restaurantId: string) =>
    `/staff/menu/${encodeURIComponent(restaurantId)}/published`,
};
