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

export type Allergen = "NUTS" | "GLUTEN" | "MEAT" | "LACTOSE"

export interface Dish {
    id: string
    name: string
    category: string
    price: number
    allergens: Allergen[] | null
}

export interface DailyMenu {
    id: string
    date: string
    dishes: Dish[] | null
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

export interface Dish {
    id: string,
    name: string,
    description: string,
    price: string,
    image: string,
    allergens: string[]
}