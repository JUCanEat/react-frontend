import { Marker } from '@react-google-maps/api';

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

  const icon: google.maps.Symbol = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: isRestaurant ? '#009DE0' : '#6B7280',
    fillOpacity: 1,
    strokeColor: isRestaurant ? '#FFFFFF' : '#E5E7EB',
    strokeWeight: 2,
    scale: isRestaurant ? 13 : 9,
  };

  const label: google.maps.MarkerLabel = {
    text: isRestaurant ? 'R' : 'V',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '700',
  };

  return (
    <Marker
      position={{ lat: facility.location.latitude.value, lng: facility.location.longitude.value }}
      title={title}
      onClick={onSelect}
      icon={icon}
      label={label}
    />
  );
}
