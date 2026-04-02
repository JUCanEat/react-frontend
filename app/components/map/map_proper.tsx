import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { zoom, mapStyles } from '~/components/map/map_config';

import { type Restaurant, type VendingMachine, type Facility } from '~/interfaces';

import { FacilityInfo } from '~/components/map/facility_info_box';
import { FacilityMarker } from '~/components/map/facility_marker';

import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';

interface MapProperProps {
  searchQuery: string;
}

const latCtr = 50.028405;
const lngCtr = 19.905503;

export const mapBounds: google.maps.LatLngBoundsLiteral = {
  north: latCtr + 0.008,
  south: latCtr - 0.008,
  west: lngCtr - 0.02,
  east: lngCtr + 0.02,
};

export function Map_proper({ searchQuery }: MapProperProps) {
  const { t, i18n } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState<Facility | null>(null);

  const mapsLanguage = i18n.language.startsWith('pl') ? 'pl' : 'en';
  const mapsRegion = mapsLanguage === 'pl' ? 'PL' : 'US';
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'jucaneat-google-maps-script',
    googleMapsApiKey: mapsApiKey,
    language: mapsLanguage,
    region: mapsRegion,
  });

  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
  };

  const {
    isPending: vendingMachinesPending,
    error: vendingMachinesError,
    data: vendingMachines,
  } = useGetAllVendingMachines();
  const {
    isPending: restaurantsPending,
    error: restaurantsError,
    data: restaurants,
  } = useGetAllRestaurants();

  if (restaurantsPending || vendingMachinesPending) {
    return <MapLoadingScreen message={t('map.loading')} />;
  }
  if (restaurantsError) return <p>{t('map.errorLoadingRestaurants')}</p>;
  if (!restaurants || restaurants.length === 0) return <p>{t('map.noRestaurantsFound')}</p>;
  if (vendingMachinesError) return <p>{t('map.errorLoadingVendingMachines')}</p>;
  if (!vendingMachines || vendingMachines.length === 0)
    return <p>{t('map.noVendingMachinesFound')}</p>;
  if (loadError) return <p>{t('common.error')}</p>;
  if (!isLoaded) {
    return <MapLoadingScreen message={t('map.loading')} />;
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (value?: string) =>
    !normalizedQuery || (value ?? '').toLowerCase().includes(normalizedQuery);

  const filteredRestaurants = restaurants.filter(
    restaurant => matchesQuery(restaurant.name) || matchesQuery(restaurant.description)
  );

  const filteredVendingMachines = vendingMachines.filter(vendingMachine =>
    matchesQuery(vendingMachine.description)
  );

  const primaryFacility =
    filteredRestaurants[0] ?? filteredVendingMachines[0] ?? restaurants[0] ?? vendingMachines[0];

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: latCtr, lng: lngCtr }}
        zoom={zoom}
        options={{
          styles: mapStyles,
          clickableIcons: false,
          restriction: { latLngBounds: mapBounds, strictBounds: true },
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {filteredRestaurants.map(p => (
          <FacilityMarker
            key={p.name}
            facility={p}
            onSelect={() => setSelectedPlace(p)}
          />
        ))}

        {filteredVendingMachines.map(vm => (
          <FacilityMarker
            key={vm.id}
            facility={vm}
            onSelect={() => setSelectedPlace(vm)}
          />
        ))}
      </GoogleMap>

      <FacilityInfo
        selectedPoint={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}

function MapLoadingScreen({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#009DE0] border-t-transparent mx-auto mb-3" />
        <p className="text-sm text-gray-700 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
}
