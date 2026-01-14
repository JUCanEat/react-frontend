{ /* Information needed to properly initialize and display MapComponent */ }

export const zoom = 17;

export const mapStyles: google.maps.MapTypeStyle[] = [
    { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "poi.school", elementType: "all", stylers: [{ visibility: "on" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
];

export const restaurantIcon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
export const vendingMachineIcon = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
export const facilityIconSize = 36;

export type Place = {
  type: "restaurant" | "vending-machine";
};