import type { DailyMenu, Dish } from '~/interfaces';

function hasTag(dish: Dish, value: string): boolean {
  return (dish.tags ?? []).some(t => t.value === value);
}

export function isVeganDish(dish: Dish): boolean {
  return hasTag(dish, 'VEGAN');
}

export function isVegetarianDish(dish: Dish): boolean {
  return hasTag(dish, 'VEGETARIAN');
}

export function isLactoseFreeDish(dish: Dish): boolean {
  return !hasTag(dish, 'LACTOSE');
}

export function isGlutenFreeDish(dish: Dish): boolean {
  return !hasTag(dish, 'GLUTEN');
}

export function isNutsFreeDish(dish: Dish): boolean {
  return !hasTag(dish, 'NUTS');
}

export function hasCuisineTag(dish: Dish, cuisine: string): boolean {
  return hasTag(dish, cuisine);
}

export function matchesDishFilter(dish: Dish, filter: string): boolean {
  switch (filter) {
    case 'vegan':
      return isVeganDish(dish);
    case 'vegetarian':
      return isVegetarianDish(dish);
    case 'lactose-free':
    case 'lactoseFree':
      return isLactoseFreeDish(dish);
    case 'gluten-free':
    case 'glutenFree':
      return isGlutenFreeDish(dish);
    case 'nuts-free':
    case 'nutsFree':
      return isNutsFreeDish(dish);
    case 'italian':
      return hasCuisineTag(dish, 'ITALIAN');
    case 'polish':
      return hasCuisineTag(dish, 'POLISH');
    case 'asian':
      return hasCuisineTag(dish, 'ASIAN');
    case 'fastFood':
      return hasCuisineTag(dish, 'FAST_FOOD');
    default:
      return true;
  }
}

export function filterDishes(
  dishes: Dish[] | null | undefined,
  filters: string[] | null | undefined
): Dish[] {
  if (!dishes) return [];
  if (!filters || filters.length === 0) return dishes;
  return dishes.filter(d => filters.every(f => matchesDishFilter(d, f)));
}

export function hasVeganOption(menu: DailyMenu | null): boolean {
  if (!menu?.dishes) return false;
  return menu.dishes.some(isVeganDish);
}

export function hasVegetarianOption(menu: DailyMenu | null): boolean {
  if (!menu?.dishes) return false;
  return menu.dishes.some(isVegetarianDish);
}

export function hasLactoseFreeOption(menu: DailyMenu | null): boolean {
  if (!menu?.dishes) return false;
  return menu.dishes.some(isLactoseFreeDish);
}

export function hasGlutenFreeOption(menu: DailyMenu | null): boolean {
  if (!menu?.dishes) return false;
  return menu.dishes.some(isGlutenFreeDish);
}

export function hasNutsFreeOption(menu: DailyMenu | null): boolean {
  if (!menu?.dishes) return false;
  return menu.dishes.some(isNutsFreeDish);
}

export function hasCuisineOption(menu: DailyMenu | null, cuisine: string): boolean {
  if (!menu?.dishes) return false;
  return menu.dishes.some(d => hasCuisineTag(d, cuisine));
}
