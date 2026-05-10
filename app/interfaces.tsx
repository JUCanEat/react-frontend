// backend
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export interface OpeningHoursDTO {
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  closed?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  photoPath: string;
  openingTime?: string;
  closingTime?: string;
  openingHours?: OpeningHoursDTO[];
  location: {
    id: string;
    latitude: { value: number };
    longitude: { value: number };
  };
  openNow: boolean;
}

export type TagType = 'CUISINE' | 'ALLERGEN' | 'DIETARY';
export type TagValue =
  | 'ITALIAN'
  | 'POLISH'
  | 'ASIAN'
  | 'FAST_FOOD'
  | 'NUTS'
  | 'GLUTEN'
  | 'LACTOSE'
  | 'VEGAN'
  | 'VEGETARIAN';

export interface Tag {
  id: string;
  value: TagValue;
  tagType: TagType;
  name: string;
}

export const MENU_ALLERGENS: TagValue[] = ['GLUTEN', 'LACTOSE', 'NUTS', 'VEGAN', 'VEGETARIAN'];
export const MENU_DIETARY_TAGS: TagValue[] = ['VEGAN', 'VEGETARIAN'];
export const MENU_ALLERGEN_TAGS: TagValue[] = ['GLUTEN', 'LACTOSE', 'NUTS'];
export const MENU_CUISINE_TAGS: TagValue[] = ['ITALIAN', 'POLISH', 'ASIAN', 'FAST_FOOD'];

export const TAG_ID_MAP: Record<TagValue, string> = {
  ITALIAN: 'a0000000-0000-0000-0000-000000000001',
  POLISH: 'a0000000-0000-0000-0000-000000000002',
  ASIAN: 'a0000000-0000-0000-0000-000000000003',
  FAST_FOOD: 'a0000000-0000-0000-0000-000000000004',
  NUTS: 'a0000000-0000-0000-0000-000000000005',
  GLUTEN: 'a0000000-0000-0000-0000-000000000006',
  LACTOSE: 'a0000000-0000-0000-0000-000000000007',
  VEGAN: 'a0000000-0000-0000-0000-000000000008',
  VEGETARIAN: 'a0000000-0000-0000-0000-000000000009',
};

export interface DailyMenu {
  id: string;
  date: string;
  dishes: Dish[] | null;
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

export interface RankedRestaurant {
  restaurant: Restaurant;
  score: number;
}

export interface FacilityInfoProps {
  selectedPoint: Facility | null;
  onClose: () => void;
  showGoToMapButton?: boolean;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  category?: string;
  price: string;
  image: string;
  tags: Tag[];
}

export interface DishDTO {
  id?: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
}

export interface DailyMenuDTO {
  id?: string;
  date: string;
  dishes: DishDTO[];
}

// Restaurant editing interfaces
export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  photoPath?: string;
  openingTime?: string;
  closingTime?: string;
  openingHours?: OpeningHoursDTO[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface RestaurantDetailsDTO {
  id: string;
  name: string;
  description: string;
  photoPath: string;
  openingTime?: string;
  closingTime?: string;
  openingHours?: OpeningHoursDTO[];
  location: {
    id: string;
    latitude: { value: number };
    longitude: { value: number };
  };
  openNow: boolean;
  owners?: string[];
}

// Restaurant manager panel interfaces
export interface RestaurantManagerUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  ownedRestaurants: Restaurant[];
}

export interface RestaurantCreateFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  photoPath: string;
  // flat fields used when same hours apply every day; openingHours takes precedence
  openingTime?: string;
  closingTime?: string;
  openingHours?: OpeningHoursDTO[];
  location?: {
    latitude: number;
    longitude: number;
  };
}
