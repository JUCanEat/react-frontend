{ /* Information needed to properly initialize and display MapComponent */ }

//export const lat = 50.03029285010186; { /* Map center latitude coordinate */}
//export const lng = 19.90685900849373; { /* Map center length coordinate */}
export const zoom = 17;

export const lat = 52.2297; { /* Map center latitude coordinate */}
export const lng = 21.0122;

export const bounds: google.maps.LatLngBoundsLiteral = {
    north: lat + 0.008,
    south: lat - 0.008,
    west: lng - 0.02,
    east: lng + 0.02,
  };

export type Place = {
  name: string;
  lat: number;
  lng: number;
  description: string;
  type: "restaurant" | "vending-machine";
};

export const mapStyles: google.maps.MapTypeStyle[] = [
    { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "poi.school", elementType: "all", stylers: [{ visibility: "on" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
];

export const diningPointIcon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
export const diningPointIconSize = 36;