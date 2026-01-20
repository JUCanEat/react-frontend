import { useState, type CSSProperties } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { zoom, mapStyles, type Place } from '~/components/map/map_config';

import { type Restaurant, type VendingMachine, type Facility } from '~/interfaces';

import { FacilityInfo } from '~/components/map/facility_info_box';
import { FacilityMarker } from '~/components/map/facility_marker';

import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';

export function Map_proper() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Facility | null>(null);

  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
  };

  const {
    vendingMachinesPending,
    vendingMachinesError,
    data: vendingMachines,
  } = useGetAllVendingMachines();
  const { restaurantsPending, restaurantsError, data: restaurants } = useGetAllRestaurants();

  if (restaurantsPending || vendingMachinesPending) return <p>Loading...</p>;
  if (restaurantsError) return <p>Error loading restaurants</p>;
  if (!restaurants || restaurants.length === 0) return <p>No restaurants found</p>;
  if (vendingMachinesError) return <p>Error loading vending machines</p>;
  if (!vendingMachines || vendingMachines.length === 0) return <p>No vending machines found</p>;

  const lat = restaurants[0].location.latitude.value;
  const lng = restaurants[0].location.longitude.value;

  const vendingMachineTitle = 'Vending Machine';

  const bounds: google.maps.LatLngBoundsLiteral = {
    north: lat + 0.008,
    south: lat - 0.008,
    west: lng - 0.02,
    east: lng + 0.02,
  };

  return (
    <div className="w-full h-full">
      <LoadScript
        googleMapsApiKey=""
        onLoad={() => setMapsLoaded(true)}
      >
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
            {restaurants.map(p => (
              <FacilityMarker
                key={p.name}
                facility={p}
                onSelect={() => setSelectedPlace(p)}
              />
            ))}

            {vendingMachines.map(vm => (
              <FacilityMarker
                key={vm.id}
                facility={vm}
                onSelect={() => setSelectedPlace(vm)}
              />
            ))}
          </GoogleMap>
        )}
      </LoadScript>

      <FacilityInfo
        selectedPoint={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}
