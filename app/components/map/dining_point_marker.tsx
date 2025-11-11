import { Marker } from "@react-google-maps/api";

import {
    diningPointIcon,
    diningPointIconSize,
} from "~/components/map/map_config";

export function DiningPointMarker({ place, onSelect }: { place: Place, onSelect: () => void }) {
    return (
        <Marker
            position={{ lat: place.lat, lng: place.lng }}
            title={place.name}
            onClick={onSelect}
            icon={{
                url: diningPointIcon,
                scaledSize: new window.google.maps.Size(diningPointIconSize, diningPointIconSize),
            }}
        />
    );
}
