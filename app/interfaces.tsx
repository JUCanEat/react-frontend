// backend
export interface Restaurant {
    id: string;
    name: string;
    description: string;
    photoPath: string;
    location: {
        id: string;
        latitude: { value: number };
        longitude: { value: number };
    };
    openNow: boolean;
}

export interface VendingMachine {
    id: string;
    description: string;
    photoPath: string;
    location: {
        id: string;
        latitude: { value: number };
        longitude: { value: number };
    };
}

type Facility = Restaurant | VendingMachine;

export interface FacilityInfoProps {
    selectedPoint: Facility | null;
    onClose: () => void;
}