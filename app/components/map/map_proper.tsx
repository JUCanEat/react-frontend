import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { zoom, mapStyles } from '~/components/map/map_config';

import { type Restaurant, type VendingMachine, type Facility } from '~/interfaces';

import { FacilityInfo } from '~/components/map/facility_info_box';
import { FacilityMarker } from '~/components/map/facility_marker';

import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';

export function Map_proper() {
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

  if (restaurantsPending || vendingMachinesPending) return <p>{t('map.loading')}</p>;
  if (restaurantsError) return <p>{t('map.errorLoadingRestaurants')}</p>;
  if (!restaurants || restaurants.length === 0) return <p>{t('map.noRestaurantsFound')}</p>;
  if (vendingMachinesError) return <p>{t('map.errorLoadingVendingMachines')}</p>;
  if (!vendingMachines || vendingMachines.length === 0)
    return <p>{t('map.noVendingMachinesFound')}</p>;
  if (loadError) return <p>{t('common.error')}</p>;
  if (!isLoaded) return <p>{t('map.loading')}</p>;

  const lat = restaurants[0].location.latitude.value;
  const lng = restaurants[0].location.longitude.value;

  const bounds: google.maps.LatLngBoundsLiteral = {
    north: lat + 0.008,
    south: lat - 0.008,
    west: lng - 0.02,
    east: lng + 0.02,
  };

  return (
    <div className="w-full h-full">
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

      <FacilityInfo
        selectedPoint={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}
