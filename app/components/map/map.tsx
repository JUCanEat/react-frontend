import { useState, type CSSProperties } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
    zoom,
    mapStyles,
    bounds,
    type Place
} from "~/components/map/map_config";

import { type Restaurant } from "~/interfaces";

import { DiningPointInfo } from "~/components/map/dining_point_info_box";
import { DiningPointMarker } from "~/components/map/dining_point_marker";

import { useGetAllRestaurants } from "~/api/restaurant_service";

export function Map() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Restaurant | null>(null);

  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
  };

  const { isPending, error, data: restaurants } = useGetAllRestaurants();

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurants</p>;
  if (!restaurants || restaurants.length === 0) return <p>No restaurants found</p>;

  const lat = restaurants[0].location.latitude.value;
  const lng = restaurants[0].location.longitude.value;

  return (
    <div className = "w-full" style={{ height: "calc(100vh - 150px)" }}>
      <LoadScript googleMapsApiKey="" onLoad={() => setMapsLoaded(true)}>
        {mapsLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat, lng }}
            zoom={zoom}
            options={{
              styles: mapStyles,
              clickableIcons: false,
              restriction: { latLngBounds: bounds, strictBounds: true },
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {restaurants.map((p) => (
              <DiningPointMarker key={p.name} restaurant={p} onSelect={() => setSelectedPlace(p)} />
            ))}
          </GoogleMap>
        )}
      </LoadScript>

      <DiningPointInfo
        selectedPoint={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}