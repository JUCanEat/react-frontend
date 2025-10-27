import { type RouteConfig, layout, index, route } from "@react-router/dev/routes";

export default [
    layout("./routes/mainui.tsx", [
        index("routes/overview.tsx"),
        route("restaurants/:restaurantId","routes/restaurant.tsx")
    ]),
    route("profile","routes/profile.tsx"),    
    route("map","routes/map.tsx")
] satisfies RouteConfig;
