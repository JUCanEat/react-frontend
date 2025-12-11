import { type RouteConfig, layout, index, route } from "@react-router/dev/routes";

export default [
    layout("./routes/mainui.tsx", [
        index("routes/overview.tsx"),
        route("restaurants/:restaurantId","routes/restaurant.tsx"),
        route("staff/menu-from-photo", "routes/staff_menu_from_photo.tsx"),
    ]),
    route("login","routes/login.tsx"),
    route("profile","routes/profile.tsx"),
    route("map","routes/map.tsx"),
<<<<<<< HEAD
    route("menu", "routes/menu.tsx"),
    route("dishes","routes/dishes.tsx")
=======
    route("dishes","routes/dishes.tsx"),
    route("menu/add", "routes/menu_form.tsx")
>>>>>>> bbc7e76 (Add form for manual menu addition)
] satisfies RouteConfig;
