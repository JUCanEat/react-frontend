import { useState, type CSSProperties } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
    lat,
    lng,
    zoom,
    places,
    mapStyles,
    bounds,
    type Place
} from "~/components/map/map_config";

import { DiningPointInfo } from "~/components/map/dining_point_info_box";
import { DiningPointMarker } from "~/components/map/dining_point_marker";

export function Map() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
  };

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
            {places.map((p) => (
              <DiningPointMarker key={p.name} place={p} onSelect={() => setSelectedPlace(p)} />
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