import { Marker } from "@react-google-maps/api";

import {
    diningPointIcon,
    diningPointIconSize,
} from "~/components/map/map_config";

export function DiningPointMarker({ restaurant, onSelect }: { restaurant: Restaurant, onSelect: () => void }) {
    return (
        <Marker
            position={{ lat: restaurant.location.latitude.value, lng: restaurant.location.longitude.value }}
            title={restaurant.name}
            onClick={onSelect}
            icon={{
                url: diningPointIcon,
                scaledSize: new window.google.maps.Size(diningPointIconSize, diningPointIconSize),
            }}
        />
    );
}