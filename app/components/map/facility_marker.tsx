import { Marker } from '@react-google-maps/api';

import { restaurantIcon, vendingMachineIcon, facilityIconSize } from '~/components/map/map_config';

import { type Facility } from '~/interfaces';

export function FacilityMarker({
  facility,
  onSelect,
}: {
  facility: Facility;
  onSelect: () => void;
}) {
  const isRestaurant = 'name' in facility;
  const title = isRestaurant ? facility.name : 'Vending Machine';
  const icon = isRestaurant ? restaurantIcon : vendingMachineIcon;

  return (
    <Marker
      position={{ lat: facility.location.latitude.value, lng: facility.location.longitude.value }}
      title={title}
      onClick={onSelect}
      icon={{
        url: icon,
        scaledSize: new window.google.maps.Size(facilityIconSize, facilityIconSize),
      }}
    />
  );
}
