import { MealCategoryCard } from '~/components/staff/menu/menu_from_photo/meal_category_card';
import MainIcon from '~/assets/food_category_icons/main.svg';
import SoupsIcon from '~/assets/food_category_icons/soups.svg';
import PizzaIcon from '~/assets/food_category_icons/pizza.svg';
import DessertsIcon from '~/assets/food_category_icons/desserts.svg';
import DrinksIcon from '~/assets/food_category_icons/drinks.svg';
import BreakfastIcon from '~/assets/food_category_icons/breakfast.svg';
import BurgerIcon from '~/assets/food_category_icons/burger.svg';
import SnackIcon from '~/assets/food_category_icons/snack.svg';
import { useTranslation } from 'react-i18next';

const categories = [
  { id: 'breakfast', labelKey: 'staff.categoryBreakfast', icon: BreakfastIcon, color: '#7E4B4C' },
  { id: 'burger', labelKey: 'staff.categoryBurger', icon: BurgerIcon, color: '#313C53' },
  { id: 'main', labelKey: 'staff.categoryMain', icon: MainIcon, color: '#445142' },
  { id: 'soups', labelKey: 'staff.categorySoups', icon: SoupsIcon, color: '#7592A1' },
  { id: 'pizza', labelKey: 'staff.categoryPizza', icon: PizzaIcon, color: '#503E62' },
  { id: 'snack', labelKey: 'staff.categorySnack', icon: SnackIcon, color: '#927D5A' },
  { id: 'desserts', labelKey: 'staff.categoryDesserts', icon: DessertsIcon, color: '#AEA572' },
  { id: 'drinks', labelKey: 'staff.categoryDrinks', icon: DrinksIcon, color: '#325C55' },
];

interface CategoryGridProps {
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { t } = useTranslation();
  const rows = [];
  for (let i = 0; i < categories.length; i += 2) {
    rows.push(categories.slice(i, i + 2));
  }

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-[20px] font-medium text-[#009DE0]">{t('staff.changeManually')}</p>
      </div>

      <div className="flex flex-col items-center gap-y-[30px]">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-[30px]"
          >
            {row.map(category => (
              <MealCategoryCard
                key={category.id}
                icon={category.icon}
                label={t(category.labelKey)}
                color={category.color}
                onClick={() => onCategoryClick(category.id)}
              />
            ))}

            {row.length === 1 && <div className="h-[150px] w-[150px] invisible" />}
          </div>
        ))}
      </div>
    </>
  );
}
