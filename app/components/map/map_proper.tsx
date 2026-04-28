import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useSearchParams } from 'react-router-dom';
import { zoom, mapStyles } from '~/components/map/map_config';

import { type Restaurant, type VendingMachine, type Facility } from '~/interfaces';

import { FacilityInfo } from '~/components/map/facility_info_box';
import { FacilityMarker } from '~/components/map/facility_marker';

import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';

interface MapProperProps {
  searchQuery: string;
  onLocationStateChange?: (state: 'inside' | 'outside' | 'unavailable') => void;
  onCenterUserActionChange?: (action: (() => void) | null) => void;
}

const MAPS_LOADER_OPTIONS = {
  id: 'jucaneat-google-maps-script',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
} as const;

export function Map_proper({
  searchQuery,
  onLocationStateChange,
  onCenterUserActionChange,
}: MapProperProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlace, setSelectedPlace] = useState<Facility | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [userMarkerPulseOn, setUserMarkerPulseOn] = useState(false);
  const [userMarkerPulseKey, setUserMarkerPulseKey] = useState(0);
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(
    null
  );

  const { isLoaded, loadError } = useJsApiLoader(MAPS_LOADER_OPTIONS);

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

  const restaurantsList = restaurants ?? [];
  const vendingMachinesList = vendingMachines ?? [];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (value?: string) =>
    !normalizedQuery || (value ?? '').toLowerCase().includes(normalizedQuery);

  const filteredRestaurants = restaurantsList.filter(
    restaurant => matchesQuery(restaurant.name) || matchesQuery(restaurant.description)
  );

  const filteredVendingMachines = vendingMachinesList.filter(vendingMachine =>
    matchesQuery(vendingMachine.description)
  );

  const targetRestaurantId = searchParams.get('restaurantId');
  const targetVendingMachineId = searchParams.get('vendingMachineId');

  const targetRestaurant = useMemo(() => {
    if (!targetRestaurantId) return null;
    return restaurantsList.find(restaurant => restaurant.id === targetRestaurantId) ?? null;
  }, [restaurantsList, targetRestaurantId]);

  const targetVendingMachine = useMemo(() => {
    if (!targetVendingMachineId) return null;
    return (
      vendingMachinesList.find(vendingMachine => vendingMachine.id === targetVendingMachineId) ??
      null
    );
  }, [vendingMachinesList, targetVendingMachineId]);

  const renderedRestaurants = useMemo(() => {
    if (!targetRestaurant) return filteredRestaurants;
    if (filteredRestaurants.some(restaurant => restaurant.id === targetRestaurant.id)) {
      return filteredRestaurants;
    }
    return [targetRestaurant, ...filteredRestaurants];
  }, [filteredRestaurants, targetRestaurant]);

  const renderedVendingMachines = useMemo(() => {
    if (!targetVendingMachine) return filteredVendingMachines;
    if (
      filteredVendingMachines.some(vendingMachine => vendingMachine.id === targetVendingMachine.id)
    ) {
      return filteredVendingMachines;
    }
    return [targetVendingMachine, ...filteredVendingMachines];
  }, [filteredVendingMachines, targetVendingMachine]);

  useEffect(() => {
    const targetFacility = targetRestaurant ?? targetVendingMachine;
    if (!targetFacility) return;

    setMapCenter({
      lat: targetFacility.location.latitude.value,
      lng: targetFacility.location.longitude.value,
    });
  }, [targetRestaurant, targetVendingMachine]);

  const primaryFacility =
    targetRestaurant ??
    targetVendingMachine ??
    filteredRestaurants[0] ??
    filteredVendingMachines[0] ??
    restaurantsList[0] ??
    vendingMachinesList[0];

  const lat = primaryFacility?.location.latitude.value ?? 0;
  const lng = primaryFacility?.location.longitude.value ?? 0;

  const bounds: google.maps.LatLngBoundsLiteral = {
    north: lat + 0.008,
    south: lat - 0.008,
    west: lng - 0.02,
    east: lng + 0.02,
  };

  const isUserWithinBounds = (location: { lat: number; lng: number } | null) => {
    if (!location) return false;
    return (
      location.lat >= bounds.south &&
      location.lat <= bounds.north &&
      location.lng >= bounds.west &&
      location.lng <= bounds.east
    );
  };

  const isUserOutsideCampus = Boolean(userPosition) && !isUserWithinBounds(userPosition);
  const displayedUserLocation = !isUserOutsideCampus ? userPosition : null;
  const isUserLocationUnavailable = !userPosition;

  useEffect(() => {
    if (isUserLocationUnavailable) {
      onLocationStateChange?.('unavailable');
      return;
    }

    if (isUserOutsideCampus) {
      onLocationStateChange?.('outside');
      return;
    }

    onLocationStateChange?.('inside');
  }, [isUserLocationUnavailable, isUserOutsideCampus, onLocationStateChange]);

  useEffect(() => {
    if (!userPosition || isUserOutsideCampus) {
      onCenterUserActionChange?.(null);
      return;
    }

    onCenterUserActionChange?.(() => () => {
      setMapCenter(userPosition);
      setUserMarkerPulseKey(prev => prev + 1);
    });
  }, [userPosition, isUserOutsideCampus, onCenterUserActionChange]);

  useEffect(() => {
    if (userMarkerPulseKey === 0) return;

    setUserMarkerPulseOn(true);

    const timeouts = [
      window.setTimeout(() => setUserMarkerPulseOn(false), 320),
      window.setTimeout(() => setUserMarkerPulseOn(true), 640),
      window.setTimeout(() => setUserMarkerPulseOn(false), 960),
    ];

    return () => {
      timeouts.forEach(timeout => window.clearTimeout(timeout));
    };
  }, [userMarkerPulseKey]);

  useEffect(() => {
    if (!primaryFacility || !navigator.geolocation) {
      setUserPosition(null);
      return;
    }

    // if (import.meta.env.DEV) {
    //   setUserPosition({
    //     lat: lat + 0.0015,
    //     lng: lng + 0.0015,
    //   });
    //   return;
    // }

    const watchId = navigator.geolocation.watchPosition(
      position => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserPosition(nextLocation);
      },
      () => {
        setUserPosition(null);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 10_000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [bounds.east, bounds.north, bounds.south, bounds.west, primaryFacility]);

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

  const handleNavigateToFacility = async (facility: Facility) => {
    if (!userPosition || isUserOutsideCampus) {
      return;
    }

    const destination = {
      lat: facility.location.latitude.value,
      lng: facility.location.longitude.value,
    };

    const origin = await new Promise<{ lat: number; lng: number } | null>(resolve => {
      if (userPosition) {
        resolve(userPosition);
        return;
      }

      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const nextPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPosition(nextPosition);
          resolve(nextPosition);
        },
        () => resolve(null),
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 10_000,
        }
      );
    });

    if (!origin || !window.google?.maps) {
      return;
    }

    const service = new window.google.maps.DirectionsService();

    const result = await new Promise<google.maps.DirectionsResult | null>(resolve => {
      service.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && response) {
            resolve(response);
            return;
          }
          resolve(null);
        }
      );
    });

    if (!result) {
      return;
    }

    setDirectionsResult(result);
  };

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter ?? { lat, lng }}
        zoom={zoom}
        options={{
          styles: mapStyles,
          clickableIcons: false,
          restriction: { latLngBounds: bounds, strictBounds: true },
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {renderedRestaurants.map(p => (
          <FacilityMarker
            key={p.id}
            facility={p}
            onSelect={() => setSelectedPlace(p)}
            isHighlighted={selectedPlace?.id === p.id || targetRestaurantId === p.id}
          />
        ))}

        {renderedVendingMachines.map(vm => (
          <FacilityMarker
            key={vm.id}
            facility={vm}
            onSelect={() => setSelectedPlace(vm)}
            isHighlighted={selectedPlace?.id === vm.id || targetVendingMachineId === vm.id}
          />
        ))}

        {directionsResult && (
          <DirectionsRenderer
            directions={directionsResult}
            options={{
              suppressMarkers: true,
              preserveViewport: false,
              polylineOptions: {
                strokeColor: '#009DE0',
                strokeOpacity: 0.9,
                strokeWeight: 5,
              },
            }}
          />
        )}

        {displayedUserLocation && (
          <Marker
            position={displayedUserLocation}
            clickable={false}
            zIndex={1000}
            icon={{
              url:
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2"/><circle cx="14" cy="10.2" r="3.1" fill="#FFFFFF"/><path d="M8.8 20.8c0-3.1 2.3-5.4 5.2-5.4s5.2 2.3 5.2 5.4v1.1H8.8z" fill="#FFFFFF"/></svg>'
                ),
              scaledSize: new window.google.maps.Size(
                userMarkerPulseOn ? 28 : 22,
                userMarkerPulseOn ? 28 : 22
              ),
              anchor: new window.google.maps.Point(
                userMarkerPulseOn ? 14 : 11,
                userMarkerPulseOn ? 14 : 11
              ),
            }}
          />
        )}
      </GoogleMap>

      <FacilityInfo
        selectedPoint={selectedPlace}
        showGoToMapButton={false}
        onNavigateTo={handleNavigateToFacility}
        navigateDisabled={!userPosition || isUserOutsideCampus}
        onClose={() => {
          setSelectedPlace(null);
          if (targetRestaurantId || targetVendingMachineId) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('restaurantId');
            nextParams.delete('vendingMachineId');
            setSearchParams(nextParams, { replace: true });
          }
        }}
      />
    </div>
  );
}

function MapLoadingScreen({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white dark:bg-gradient-to-b dark:from-zinc-800 dark:via-zinc-950 dark:to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#009DE0] border-t-transparent mx-auto mb-3" />
        <p className="text-sm text-gray-700 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
}
