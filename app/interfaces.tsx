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

export type Facility = Restaurant | VendingMachine;

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

export interface DishDTO {
  id?: string;
  name: string;
  category: string;
  price: number;
  allergens: string[];
}

export interface DailyMenuDTO {
  id?: string;
  date: string;
  dishes: DishDTO[];
}
