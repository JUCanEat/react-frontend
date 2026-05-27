import type { DailyMenu, Dish } from "~/interfaces";

function normalizeAllergens(dish: Dish): string[] {
  return (dish.allergens ?? []).map((a) => String(a).toLowerCase());
}

export function isVeganDish(dish: Dish): boolean {
  const allergens = normalizeAllergens(dish);
  if (allergens.length === 0) return true;
  return !allergens.includes("meat") && !allergens.includes("lactose");
}

export function isVegetarianDish(dish: Dish): boolean {
  const allergens = normalizeAllergens(dish);
  if (allergens.length === 0) return true;
  return !allergens.includes("meat");
}

export function isLactoseFreeDish(dish: Dish): boolean {
  const allergens = normalizeAllergens(dish);
  if (allergens.length === 0) return true;
  return !allergens.includes("lactose");
}

export function isGlutenFreeDish(dish: Dish): boolean {
  const allergens = normalizeAllergens(dish);
  if (allergens.length === 0) return true;
  return !allergens.includes("gluten");
}

export function matchesDishFilter(dish: Dish, filter: string): boolean {
  switch (filter) {
    case "vegan":
      return isVeganDish(dish);
    case "vegetarian":
      return isVegetarianDish(dish);
    case "lactose-free":
    case "lactoseFree":
      return isLactoseFreeDish(dish);
    case "gluten-free":
    case "glutenFree":
      return isGlutenFreeDish(dish);
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
  return dishes.filter((d) => filters.every((f) => matchesDishFilter(d, f)));
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