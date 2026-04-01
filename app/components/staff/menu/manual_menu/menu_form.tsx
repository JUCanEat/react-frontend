import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '~/shadcn/components/ui/card';
import { Button } from '~/shadcn/components/ui/button';
import { Input } from '~/shadcn/components/ui/input';
import { Label } from '~/shadcn/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/shadcn/components/ui/select';
import { Checkbox } from '~/shadcn/components/ui/checkbox';
import { Plus, Trash } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '~/shadcn/components/ui/alert';
import { MENU_ALLERGENS, type DishDTO } from '~/interfaces';
import {
  menuService,
  useSaveMenuDraftWithToken,
  useUpdateDailyMenuWithToken,
} from '~/api/menu_service';
import { useRestaurantStore } from '~/store/restaurant_store';
import { useTranslation } from 'react-i18next';
import { translateAllergen, translateCategory } from '~/components/menu/menu_translations';
import { menuRoutes } from '../menu_routes';

const CATEGORIES = ['SOUP', 'MAIN_COURSE'] as const;

function isPastDate(dateString: string) {
  const selected = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
}

export function DailyMenuForm({
  restaurantId,
  userId,
  token,
}: {
  restaurantId: string;
  userId: string;
  token: string;
}) {
  const { t } = useTranslation();
  const { menuFormSuccess, setMenuFormSuccess, setSelectedRestaurant } = useRestaurantStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (menuFormSuccess) {
      navigate(menuRoutes.viewForRestaurant(restaurantId));
      setMenuFormSuccess(false);
    }
  }, [menuFormSuccess, navigate, restaurantId, setMenuFormSuccess]);
  const [date, setDate] = useState('');
  const [dishes, setDishes] = useState<DishDTO[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [showEditExistingAction, setShowEditExistingAction] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const errorRef = React.useRef<HTMLDivElement>(null);
  const updateMenu = useUpdateDailyMenuWithToken(token);
  const saveMenuDraft = useSaveMenuDraftWithToken(token);

  useEffect(() => {
    const draftId = searchParams.get('draftId');
    if (!draftId) return;

    const draft = menuService.getLocalDraftById(draftId);
    if (!draft || draft.restaurantId !== restaurantId) return;

    setDate(draft.date || '');
    setDishes(draft.dishes || []);
    setCurrentDraftId(draft.id);
    setShowEditExistingAction(false);
  }, [searchParams, restaurantId]);

  const addDish = () => {
    setDishes([...dishes, { name: '', category: '', price: 0, allergens: [] }]);
  };

  const updateDish = (index: number, field: keyof DishDTO, value: any) => {
    const updated = [...dishes];
    (updated[index] as any)[field] = value;
    setDishes(updated);
  };

  const toggleAllergen = (index: number, allergen: string) => {
    const updated = [...dishes];
    const exists = updated[index].allergens.includes(allergen);
    updated[index].allergens = exists
      ? updated[index].allergens.filter(a => a !== allergen)
      : [...updated[index].allergens, allergen];
    setDishes(updated);
  };

  const removeDish = (index: number) => {
    const updated = dishes.filter((_, i) => i !== index);
    setDishes(updated);
  };

  const validateDishes = () => {
    if (!date) return t('menuForm.validationSelectDate');
    if (isPastDate(date)) return t('menuForm.validationDateNotInPast');
    if (dishes.length === 0) return t('menuForm.validationAddDish');

    for (let i = 0; i < dishes.length; i++) {
      const d = dishes[i];

      if (!d.name.trim()) return t('menuForm.validationNameRequired', { index: i + 1 });
      if (!d.category) return t('menuForm.validationCategoryRequired', { index: i + 1 });
      if (!d.price || d.price <= 0) return t('menuForm.validationPriceRequired', { index: i + 1 });
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateDishes();

    if (validationError) {
      setError(validationError);
      setTimeout(
        () =>
          errorRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          }),
        50
      );
      return;
    }

    setError(null);
    setWarning(null);
    setShowEditExistingAction(false);
    setInfo(null);
    setIsSubmitting(true);

    try {
      const alreadyPublished = await menuService.hasActiveMenuForDate(restaurantId, date);

      if (alreadyPublished) {
        setWarning(t('menuForm.activeMenuAlreadyPublished', { date }));
        setShowEditExistingAction(true);
        setIsSubmitting(false);
        return;
      }

      await updateMenu.mutateAsync({
        restaurantId,
        menu: {
          date,
          dishes,
        },
      });
      // Reset form
      setDishes([]);
      setDate('');
      setShowEditExistingAction(false);
      setSelectedRestaurant({ id: restaurantId } as any);
      setMenuFormSuccess(true);
    } catch (err: any) {
      setError(err.message || t('menuForm.failedToUpdateMenu'));
      setTimeout(
        () =>
          errorRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          }),
        50
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (dishes.length === 0) {
      setError(t('menuForm.validationAddDish'));
      return;
    }

    setError(null);
    setWarning(null);
    setShowEditExistingAction(false);
    setInfo(null);
    setIsSavingDraft(true);

    try {
      const saveResult = await saveMenuDraft.mutateAsync({
        restaurantId,
        menu: {
          date: date || new Date().toISOString().slice(0, 10),
          dishes,
        },
        source: 'manual',
        draftId: currentDraftId ?? undefined,
      });

      if (saveResult.draftId) {
        setCurrentDraftId(saveResult.draftId);
      }

      setInfo(t('menuForm.draftSaved'));
    } catch (err: any) {
      setError(err.message || t('menuForm.failedToSaveDraft'));
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto p-4">
        <Button
          variant="outline"
          className="mb-6 w-fit bg-white text-gray-900 hover:bg-zinc-100 dark:bg-white dark:text-white dark:hover:bg-blue-900/20"
          onClick={() => navigate(-1)}
        >
          ← {t('common.goBack')}
        </Button>
        {error && (
          <div
            ref={errorRef}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertTitle>{t('common.error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        {warning && (
          <Alert className="mb-6 border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            <AlertTitle>{t('menuForm.warningTitle')}</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{warning}</p>
              {showEditExistingAction && (
                <Link
                  to={menuRoutes.staffPublished(restaurantId)}
                  className="inline-flex items-center rounded-md border border-yellow-500 px-3 py-1.5 text-sm font-medium text-yellow-900 hover:bg-yellow-100 dark:border-yellow-300 dark:text-yellow-100 dark:hover:bg-yellow-900/40"
                >
                  {t('menuForm.openPublishedMenuPanel')}
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}
        {info && (
          <Alert className="mb-6 border-green-400 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200">
            <AlertTitle>{t('menuForm.draftSavedTitle')}</AlertTitle>
            <AlertDescription>{info}</AlertDescription>
          </Alert>
        )}
        <Card className="shadow-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              {t('menuForm.createDailyMenu')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-900 dark:text-white">{t('menuForm.date')}</Label>
              <Input
                type="date"
                value={date}
                onChange={e => {
                  const nextDate = e.target.value;
                  setDate(nextDate);
                  if (warning) {
                    setWarning(null);
                    setShowEditExistingAction(false);
                  }
                }}
                className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700"
              />
            </div>
            <div className="space-y-4">
              {dishes.map((dish, index) => (
                <Card
                  key={index}
                  className="p-4 border-2 border-[#009DE0] shadow-sm hover:shadow-md transition-shadow bg-gray-50 dark:bg-zinc-800"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('menuForm.dish', { index: index + 1 })}
                    </h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDish(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label className="text-gray-900 dark:text-white">{t('menuForm.name')}</Label>
                      <Input
                        value={dish.name}
                        onChange={e => updateDish(index, 'name', e.target.value)}
                        className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label className="text-gray-900 dark:text-white">
                        {t('menuForm.category')}
                      </Label>
                      <Select
                        onValueChange={v => updateDish(index, 'category', v)}
                        value={dish.category}
                      >
                        <SelectTrigger className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700">
                          <SelectValue placeholder={t('menuForm.selectCategory')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700">
                          {CATEGORIES.map(c => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="text-gray-900 dark:text-white focus:bg-blue-50 dark:focus:bg-blue-900/30"
                            >
                              {translateCategory(c, t)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label className="text-gray-900 dark:text-white">{t('menuForm.price')}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={dish.price}
                        onChange={e => updateDish(index, 'price', parseFloat(e.target.value))}
                        className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 dark:text-white">
                      {t('menuForm.allergens')}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {MENU_ALLERGENS.map(a => (
                        <label
                          key={a}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={dish.allergens.includes(a)}
                            onCheckedChange={() => toggleAllergen(index, a)}
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {translateAllergen(a, t)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              onClick={addDish}
              className="w-full flex items-center gap-2 bg-[#009DE0] hover:bg-[#007bb8] text-white dark:bg-[#009DE0] dark:hover:bg-[#007bb8]"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" /> {t('menuForm.addDish')}
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
              variant="default"
              disabled={isSubmitting || isSavingDraft}
            >
              {isSubmitting ? t('menuForm.submitting') : t('menuForm.submitMenu')}
            </Button>
            <Button
              onClick={handleSaveDraft}
              className="w-full mt-2 bg-white text-gray-900 border border-gray-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700"
              variant="outline"
              disabled={isSubmitting || isSavingDraft}
            >
              {isSavingDraft ? t('menuForm.savingDraft') : t('menuForm.submitDraftMenu')}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50">{/* Navigation bar here if needed */}</div>
    </div>
  );
}
