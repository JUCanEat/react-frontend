import type { DailyMenu, Dish } from "~/interfaces"

function isVeganDish(dish: Dish): boolean {
    if (!dish.allergens || dish.allergens.length === 0) return true
    return !dish.allergens.includes("MEAT") &&
        !dish.allergens.includes("LACTOSE")
}

function isVegetarianDish(dish: Dish): boolean {
    if (!dish.allergens || dish.allergens.length === 0) return true
    return !dish.allergens.includes("MEAT")
}

function isLactoseFreeDish(dish: Dish): boolean {
    if (!dish.allergens || dish.allergens.length === 0) return true
    return !dish.allergens.includes("LACTOSE")
}

function isGlutenFreeDish(dish: Dish): boolean {
    if (!dish.allergens || dish.allergens.length === 0) return true
    return !dish.allergens.includes("GLUTEN")
}

export function hasVeganOption(menu: DailyMenu | null): boolean {
    if (!menu?.dishes) return false
    return menu.dishes.some(isVeganDish)
}

export function hasVegetarianOption(menu: DailyMenu | null): boolean {
    if (!menu?.dishes) return false
    return menu.dishes.some(isVegetarianDish)
}

export function hasLactoseFreeOption(menu: DailyMenu | null): boolean {
    if (!menu?.dishes) return false
    return menu.dishes.some(isLactoseFreeDish)
}

export function hasGlutenFreeOption(menu: DailyMenu | null): boolean {
    if (!menu?.dishes) return false
    return menu.dishes.some(isGlutenFreeDish)
}
