import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { menuService } from '~/api/menu_service';
import type { DailyMenu, Dish, Allergen } from '~/interfaces';
import { LoadingSpinner } from '~/components/staff/common/loading_spinner';
import { ErrorState, EmptyState } from '~/components/staff/common/error_state';
import { StatusBanner } from '~/components/staff/common/status_banner';
import { DishEditor } from '~/components/staff/menu/common/dish_editor';
import { MenuActionButtons } from '~/components/staff/menu/common/menu_action_buttons';
import { Card } from '~/shadcn/components/ui/card';
import { useRestaurantStore } from '~/store/restaurant_store';
import { useTranslation } from 'react-i18next';
import { menuRoutes } from '~/components/staff/menu/menu_routes';

interface PublishedMenuPanelProps {
  restaurantId: string;
}

function isPastDate(dateString: string) {
  const selected = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
}

export function PublishedMenuPanel({ restaurantId }: PublishedMenuPanelProps) {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setMenuFormSuccess, setSelectedRestaurant } = useRestaurantStore();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [menu, setMenu] = React.useState<DailyMenu | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  useEffect(() => {
    const loadPublishedMenu = async () => {
      try {
        const activeMenu = await menuService.getActiveMenu(restaurantId);

        if (!activeMenu) {
          setMenu(null);
          return;
        }

        setMenu({
          ...activeMenu,
          dishes: (activeMenu.dishes ?? []).map((dish: any) => ({
            ...dish,
            category: dish.category ?? 'MAIN_COURSE',
            allergens: Array.isArray(dish.allergens) ? dish.allergens : [],
            price: typeof dish.price === 'string' ? dish.price : String(dish.price ?? ''),
          })),
        });
      } catch {
        setError(t('staff.failedToLoadPublishedMenu'));
      } finally {
        setLoading(false);
      }
    };

    loadPublishedMenu();
  }, [restaurantId, t]);

  const handleDishChange = (index: number, field: keyof Dish | 'category', value: any) => {
    if (!menu || !menu.dishes) return;

    const updatedDishes = [...menu.dishes];
    updatedDishes[index] = {
      ...updatedDishes[index],
      [field]: value,
    };

    setMenu({
      ...menu,
      dishes: updatedDishes,
    });
  };

  const handleAllergenToggle = (dishIndex: number, allergen: Allergen) => {
    if (!menu || !menu.dishes) return;

    const dish = menu.dishes[dishIndex];
    const allergens = dish.allergens || [];

    const updatedAllergens = allergens.includes(allergen)
      ? allergens.filter(a => a !== allergen)
      : [...allergens, allergen];

    handleDishChange(dishIndex, 'allergens', updatedAllergens);
  };

  const handleRemoveDish = (index: number) => {
    if (!menu || !menu.dishes) return;

    const updatedDishes = menu.dishes.filter((_, i) => i !== index);
    setMenu({
      ...menu,
      dishes: updatedDishes,
    });
  };

  const handleAddDish = () => {
    if (!menu) return;

    setMenu({
      ...menu,
      dishes: [
        ...(menu.dishes ?? []),
        {
          id: '',
          name: '',
          description: '',
          image: '',
          category: 'MAIN_COURSE',
          price: '0',
          allergens: [],
        } as any,
      ],
    });
  };

  const validateMenu = () => {
    if (!menu?.date) return t('menuForm.validationSelectDate');
    if (isPastDate(menu.date.slice(0, 10))) return t('menuForm.validationDateNotInPast');

    if (!menu.dishes || menu.dishes.length === 0) return t('menuForm.validationAddDish');

    for (let i = 0; i < menu.dishes.length; i++) {
      const dish: any = menu.dishes[i];
      if (!dish.name?.trim()) return t('menuForm.validationNameRequired', { index: i + 1 });
      if (!dish.category) return t('menuForm.validationCategoryRequired', { index: i + 1 });
      const price = typeof dish.price === 'number' ? dish.price : Number(dish.price ?? 0);
      if (!price || price <= 0) return t('menuForm.validationPriceRequired', { index: i + 1 });
    }

    return null;
  };

  const handleApprove = async () => {
    if (!menu || !keycloak.token) return;

    const validationError = validateMenu();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: DailyMenu = {
        ...menu,
        date: menu.date.slice(0, 10),
        dishes: (menu.dishes ?? []).map((dish: any) => ({
          ...dish,
          category: dish.category ?? 'MAIN_COURSE',
          price: String(typeof dish.price === 'number' ? dish.price : Number(dish.price ?? 0)),
          allergens: dish.allergens ?? [],
        })),
      };

      await menuService.approveMenu(restaurantId, payload, keycloak.token);
      setSuccess(t('staff.publishedMenuUpdated'));
      setSelectedRestaurant({ id: restaurantId } as any);
      setMenuFormSuccess(true);
      navigate(menuRoutes.viewForRestaurant(restaurantId));
    } catch {
      setError(t('staff.failedToApproveMenu'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message={t('staff.loadingPublishedMenu')} />;
  }

  if (error && !menu) {
    return <ErrorState message={error} />;
  }

  if (!menu || !menu.dishes) {
    return <EmptyState message={t('staff.noPublishedMenuFound')} />;
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 p-4">
      <div className="max-w-4xl mx-auto">
        {saving && (
          <StatusBanner
            type="success"
            message={t('staff.approvingMenu')}
            showSpinner
          />
        )}
        {error && menu && (
          <StatusBanner
            type="error"
            message={error}
          />
        )}
        {success && (
          <StatusBanner
            type="success"
            message={success}
          />
        )}

        <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md">
          <h1 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            {t('staff.reviewPublishedMenu')}
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
              {t('menuForm.date')}
            </label>
            <input
              type="date"
              value={menu.date.slice(0, 10)}
              onChange={e => setMenu({ ...menu, date: e.target.value })}
              className="w-full border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-4">
            {menu.dishes.map((dish, index) => (
              <DishEditor
                key={index}
                dish={dish as any}
                index={index}
                onDishChange={handleDishChange}
                onAllergenToggle={handleAllergenToggle}
                onRemove={handleRemoveDish}
              />
            ))}
          </div>

          <button
            onClick={handleAddDish}
            className="mt-4 w-full px-4 py-2 rounded-md border border-[#009DE0] text-[#009DE0] bg-white hover:bg-sky-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 flex items-center justify-center gap-2"
            disabled={saving}
          >
            <Plus className="h-4 w-4" /> {t('menuForm.addDish')}
          </button>

          <MenuActionButtons
            onApprove={handleApprove}
            onCancel={() => navigate(-1)}
            isApproving={saving}
            isDisabled={menu.dishes.length === 0}
          />
        </Card>
      </div>
    </div>
  );
}
