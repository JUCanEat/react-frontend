import type { DailyMenu, Dish } from '~/interfaces';

function hasTag(dish: Dish, value: string): boolean {
  return (dish.tags ?? []).some(t => t.value === value);
}

function isVeganDish(dish: Dish): boolean {
  return hasTag(dish, 'VEGAN');
}

function isVegetarianDish(dish: Dish): boolean {
  return hasTag(dish, 'VEGETARIAN');
}

function isLactoseFreeDish(dish: Dish): boolean {
  return !hasTag(dish, 'LACTOSE');
}

function isGlutenFreeDish(dish: Dish): boolean {
  return !hasTag(dish, 'GLUTEN');
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
