import * as React from 'react';
import { Marker } from '@react-google-maps/api';

import { type Facility } from '~/interfaces';

export function FacilityMarker({
  facility,
  onSelect,
  isHighlighted = false,
}: {
  facility: Facility;
  onSelect: () => void;
  isHighlighted?: boolean;
}) {
  const [pulseOn, setPulseOn] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const isAnimating = isHighlighted || isHovered;

  React.useEffect(() => {
    if (!isAnimating) {
      setPulseOn(false);
      return;
    }

    setPulseOn(true);

    if (isHovered) {
      const interval = window.setInterval(() => {
        setPulseOn(prev => !prev);
      }, 260);

      return () => {
        window.clearInterval(interval);
      };
    }

    const timeouts = [
      window.setTimeout(() => setPulseOn(false), 320),
      window.setTimeout(() => setPulseOn(true), 640),
      window.setTimeout(() => setPulseOn(false), 960),
    ];

    return () => {
      timeouts.forEach(timeout => window.clearTimeout(timeout));
    };
  }, [isAnimating, isHovered]);

  const isRestaurant = 'name' in facility;
  const title = isRestaurant ? facility.name : 'Vending Machine';

  const icon: google.maps.Symbol = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: isRestaurant ? '#009DE0' : '#6B7280',
    fillOpacity: 1,
    strokeColor: isRestaurant ? '#FFFFFF' : '#E5E7EB',
    strokeWeight: 2,
    scale: isRestaurant
      ? pulseOn && isAnimating
        ? 18
        : isHovered
          ? 15
          : 13
      : pulseOn && isAnimating
        ? 14
        : isHovered
          ? 11
          : 9,
  };

  const label: google.maps.MarkerLabel = {
    text: isRestaurant ? 'R' : 'V',
    color: '#FFFFFF',
    fontSize: pulseOn && isAnimating ? '12px' : isHovered ? '11px' : '10px',
    fontWeight: '700',
  };

  return (
    <Marker
      position={{ lat: facility.location.latitude.value, lng: facility.location.longitude.value }}
      title={title}
      onClick={onSelect}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      icon={icon}
      label={label}
      zIndex={isHighlighted || isHovered ? 999 : undefined}
    />
  );
}
