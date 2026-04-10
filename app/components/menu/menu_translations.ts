type TranslateFn = (key: string) => string;

const ALLERGEN_KEY_MAP: Record<string, string> = {
  GLUTEN: 'menuForm.allergenGluten',
  LACTOSE: 'menuForm.allergenLactose',
  MEAT: 'menuForm.allergenMeat',
  NUTS: 'menuForm.allergenNuts',
};

const CATEGORY_KEY_MAP: Record<string, string> = {
  SOUP: 'menuForm.categorySoup',
  MAIN_COURSE: 'menuForm.categoryMainCourse',
  BREAKFAST: 'staff.categoryBreakfast',
  BURGER: 'staff.categoryBurger',
  MAIN: 'staff.categoryMain',
  SOUPS: 'staff.categorySoups',
  PIZZA: 'staff.categoryPizza',
  SNACK: 'staff.categorySnack',
  DESSERTS: 'staff.categoryDesserts',
  DRINKS: 'staff.categoryDrinks',
};

export function translateAllergen(code: string, t: TranslateFn): string {
  const key = ALLERGEN_KEY_MAP[code];
  return key ? t(key) : code;
}

export function translateCategory(code: string, t: TranslateFn): string {
  const key = CATEGORY_KEY_MAP[code];
  return key ? t(key) : code;
}
