import { type RouteConfig, layout, index, route } from '@react-router/dev/routes';

export default [
  layout('./routes/mainui.tsx', [
    index('routes/overview.tsx'),
    route('staff/menu/:restaurantId/photo', 'routes/staff_menu_from_photo.tsx'),
    route('staff/menu/:restaurantId/form', 'routes/staff_menu_form.tsx'),
    route('staff/menu/:restaurantId/drafts', 'routes/staff_menu_draft.tsx'),
    route('staff/menu/:restaurantId/published', 'routes/staff_published_menu.tsx'),
    route('*', 'routes/not-found.tsx'),
  ]),
  route('login', 'routes/login.tsx'),
  route('profile', 'routes/profile.tsx'),
  route('staff/manager', 'routes/staff_manager_panel.tsx'),
  route('map', 'routes/map.tsx'),
  route('menu', 'routes/menu.tsx'),
  route('dishes', 'routes/dishes.tsx'),
] satisfies RouteConfig;
