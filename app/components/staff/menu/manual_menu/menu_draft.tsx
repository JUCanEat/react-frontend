import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { menuService, type StoredMenuDraft } from '~/api/menu_service';
import type { DailyMenu, DailyMenuDTO, Dish, Allergen } from '~/interfaces';
import { LoadingSpinner } from '~/components/staff/common/loading_spinner';
import { ErrorState, EmptyState } from '~/components/staff/common/error_state';
import { StatusBanner } from '~/components/staff/common/status_banner';
import { DishEditor } from '~/components/staff/menu/common/dish_editor';
import { MenuActionButtons } from '~/components/staff/menu/common/menu_action_buttons';
import { useRestaurantStore } from '~/store/restaurant_store';
import { Card } from '~/shadcn/components/ui/card';
import { useTranslation } from 'react-i18next';
import { menuRoutes } from '~/components/staff/menu/menu_routes';
import { appRoutes } from '~/lib/app_routes';

interface StaffMenuDraftProps {
  restaurantId: string;
}

function isPastDate(dateString: string) {
  const selected = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
}

export function StaffMenuDraft({ restaurantId }: StaffMenuDraftProps) {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { menuFormSuccess, setMenuFormSuccess, setSelectedRestaurant } = useRestaurantStore();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [savingDraft, setSavingDraft] = React.useState(false);
  const [menu, setMenu] = React.useState<DailyMenu | null>(null);
  const [localDrafts, setLocalDrafts] = React.useState<StoredMenuDraft[]>([]);
  const [selectedLocalDraftId, setSelectedLocalDraftId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [warning, setWarning] = React.useState<string | null>(null);

  const refreshLocalDrafts = React.useCallback(() => {
    const drafts = menuService.listLocalDrafts(restaurantId);
    setLocalDrafts(drafts);
    return drafts;
  }, [restaurantId]);

  const loadLocalDraftIntoEditor = React.useCallback((draft: StoredMenuDraft) => {
    setSelectedLocalDraftId(draft.id);
    setMenu({
      id: draft.id,
      date: draft.date,
      dishes: draft.dishes as any,
    });
  }, []);

  useEffect(() => {
    const fetchDraft = async () => {
      if (!keycloak.token) return;

      try {
        const drafts = refreshLocalDrafts();

        if (drafts.length > 0) {
          loadLocalDraftIntoEditor(drafts[0]);
        } else {
          const draft = await menuService.getManagedDraft(restaurantId, keycloak.token);
          if (draft) {
            setSelectedLocalDraftId(null);
            setMenu({
              id: draft.id ?? '',
              date: draft.date,
              dishes: draft.dishes as any,
            });
          } else {
            setMenu(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch draft:', error);
        setError(t('staff.failedToLoadDraft'));
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [keycloak.token, restaurantId, refreshLocalDrafts, loadLocalDraftIntoEditor, t]);

  useEffect(() => {
    if (menuFormSuccess) {
      navigate(appRoutes.staffManager);
      setMenuFormSuccess(false);
    }
  }, [menuFormSuccess, navigate, setMenuFormSuccess]);

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

  const handleApprove = async () => {
    if (!menu || !keycloak.token) return;

    setSaving(true);
    setError(null);
    setWarning(null);

    try {
      const publishDate = menu.date || new Date().toISOString().slice(0, 10);

      if (isPastDate(publishDate)) {
        setWarning(t('menuForm.validationDateNotInPast'));
        setSaving(false);
        return;
      }

      const alreadyPublished = await menuService.hasActiveMenuForDate(restaurantId, publishDate);

      if (alreadyPublished) {
        setWarning(t('menuForm.activeMenuAlreadyPublished', { date: publishDate }));
        setSaving(false);
        return;
      }

      await menuService.approveMenu(restaurantId, menu, keycloak.token);
      setSelectedRestaurant({ id: restaurantId } as any);
      setMenuFormSuccess(true);
    } catch (error) {
      console.error('Failed to approve menu:', error);
      setError(t('staff.failedToApproveMenu'));
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!menu || !keycloak.token) return;

    setSavingDraft(true);
    setError(null);

    const draftPayload: DailyMenuDTO = {
      date: menu.date || new Date().toISOString().slice(0, 10),
      dishes: (menu.dishes ?? []).map((dish: any) => ({
        id: dish.id,
        name: dish.name,
        category: dish.category ?? 'MAIN_COURSE',
        price: typeof dish.price === 'number' ? dish.price : Number(dish.price ?? 0),
        allergens: dish.allergens ?? [],
      })),
    };

    try {
      const saveResult = await menuService.saveMenuDraft(
        restaurantId,
        draftPayload,
        keycloak.token,
        selectedLocalDraftId ? 'manual' : 'photo',
        selectedLocalDraftId ?? undefined
      );

      const drafts = refreshLocalDrafts();
      if (saveResult.draftId) {
        const saved = drafts.find(d => d.id === saveResult.draftId);
        if (saved) {
          loadLocalDraftIntoEditor(saved);
        }
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      setError(t('staff.failedToSaveDraft'));
    } finally {
      setSavingDraft(false);
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    menuService.deleteLocalDraft(draftId);
    const drafts = refreshLocalDrafts();

    if (selectedLocalDraftId === draftId) {
      if (drafts.length > 0) {
        loadLocalDraftIntoEditor(drafts[0]);
      } else {
        setSelectedLocalDraftId(null);
        setMenu(null);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message={t('staff.loadingDraft')} />;
  }

  if (error && !menu) {
    return (
      <ErrorState
        message={error}
        backPath={appRoutes.staffManager}
        backLabel={t('common.goBack')}
      />
    );
  }

  if (!menu || !menu.dishes) {
    return (
      <EmptyState
        message={t('staff.noDraftFound')}
        backPath={appRoutes.staffManager}
        backLabel={t('common.goBack')}
      />
    );
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
        {warning && menu && (
          <StatusBanner
            type="warning"
            message={warning}
          />
        )}

        {localDrafts.length > 0 && (
          <Card className="mb-4 p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm font-medium mb-3 text-gray-900 dark:text-white">
              {t('manager.manageDrafts')}
            </p>
            <div className="space-y-2">
              {localDrafts.map(draft => {
                const active = selectedLocalDraftId === draft.id;

                return (
                  <div
                    key={draft.id}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                      active
                        ? 'border-[#009DE0] bg-sky-50 dark:bg-sky-900/20'
                        : 'border-gray-200 dark:border-zinc-700'
                    }`}
                  >
                    <button
                      className="text-left flex-1 text-sm text-gray-900 dark:text-white"
                      onClick={() => loadLocalDraftIntoEditor(draft)}
                    >
                      {draft.date} • {new Date(draft.updatedAt).toLocaleString()}
                    </button>
                    <button
                      className="ml-3 text-xs text-red-600 dark:text-red-400"
                      onClick={() => handleDeleteDraft(draft.id)}
                    >
                      {t('staff.remove')}
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {t('staff.reviewMenuDraft')}
          </h1>
          <div className="space-y-4">
            {menu.dishes.map((dish, index) => (
              <DishEditor
                key={index}
                dish={dish}
                index={index}
                onDishChange={handleDishChange}
                onAllergenToggle={handleAllergenToggle}
                onRemove={handleRemoveDish}
              />
            ))}
          </div>
          <MenuActionButtons
            onApprove={handleApprove}
            onSaveDraft={handleSaveDraft}
            onCancel={() => navigate(appRoutes.staffManager)}
            isApproving={saving}
            isSavingDraft={savingDraft}
            isDisabled={menu.dishes.length === 0}
          />
        </Card>
      </div>
    </div>
  );
}
