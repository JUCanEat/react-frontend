{ /* Information needed to properly initialize and display MapComponent */ }

export const lat = 50.03029285010186; { /* Map center latitude coordinate */}
export const lng = 19.90685900849373; { /* Map center length coordinate */}
export const zoom = 17;

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

export const places: Place[] = [
    {
      name: "Bistro Świetlica",
      lat: 50.03029285010186,
      lng: 19.90685900849373,
      description: "Favourite dining place of mathematicians and computer scientists",
      type: "restaurant"
    },
    {
      name: "WZiKS vending machine",
      lat: 50.03018464880309,
      lng: 19.908395982447058,
      description: "Best sweet treats between classes",
      type: "vending-machine"
    },
  ];

export const mapStyles: google.maps.MapTypeStyle[] = [
    { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "poi.school", elementType: "all", stylers: [{ visibility: "on" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
];

export const diningPointIcon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
export const diningPointIconSize = 36;