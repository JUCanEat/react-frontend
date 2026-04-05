import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import type { Restaurant, RestaurantCreateFormData, RestaurantManagerUserData } from '~/interfaces';
import { useTranslation } from 'react-i18next';
import { menuRoutes } from '~/components/staff/menu/menu_routes';
import { restaurantManagerService } from '~/api/restaurant_manager_service';
import { RestaurantSectionHeader } from '~/components/staff/manager/restaurant_section_header';
import { RestaurantCard } from '~/components/staff/manager/restaurant_card';
import { RestaurantFormModal } from '~/components/staff/manager/restaurant_form_modal';

const EMPTY_FORM_DATA: RestaurantCreateFormData = {
  name: '',
  description: '',
  latitude: '',
  longitude: '',
  photoPath: '',
  openingTime: '',
  closingTime: '',
};

function toTimeInputValue(value?: string) {
  if (!value) return '';
  return value.slice(0, 5);
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function getDefaultOpeningRange(restaurant: Restaurant) {
  const weeklyHours = restaurant.openingHours ?? [];
  const mondayRange = weeklyHours.find(hours => hours.dayOfWeek === 'MONDAY');
  const firstRange = mondayRange ?? weeklyHours[0];

  return {
    openingTime: toTimeInputValue(firstRange?.openTime ?? restaurant.openingTime),
    closingTime: toTimeInputValue(firstRange?.closeTime ?? restaurant.closingTime),
  };
}

export default function RestaurantOwnerProfile() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<RestaurantManagerUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState<RestaurantCreateFormData>(EMPTY_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState<{
    latitude?: string;
    longitude?: string;
    openingTime?: string;
    closingTime?: string;
  }>({});
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editFormData, setEditFormData] = useState<RestaurantCreateFormData>(EMPTY_FORM_DATA);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!keycloak.token) {
        setLoading(false);
        return;
      }

      try {
        const data = await restaurantManagerService.getCurrentUserData(keycloak.token);
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (initialized && keycloak.authenticated) {
      setLoading(true);
      fetchUserData();
    } else if (initialized && !keycloak.authenticated) {
      setLoading(false);
    }
  }, [initialized, keycloak.authenticated, keycloak.token]);

  if (!initialized || loading) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('manager.loadingProfile')}
          </p>
        </div>
        <div className="fixed bottom-0 left-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('manager.failedToLoadProfile')}
          </p>
        </div>
        <div className="fixed bottom-0 left-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    );
  }

  const handleRestaurantSelect = (restaurantId: string) => {
    navigate(menuRoutes.staffPhoto(restaurantId));
  };

  const handleMenuFormSelect = (restaurantId: string) => {
    navigate(menuRoutes.staffForm(restaurantId));
  };

  const handleManageDraftSelect = (restaurantId: string) => {
    navigate(menuRoutes.staffDrafts(restaurantId));
  };

  const handleManagePublishedMenuSelect = (restaurantId: string) => {
    navigate(menuRoutes.staffPublished(restaurantId));
  };

  const validateCoordinates = () => {
    const errors: {
      latitude?: string;
      longitude?: string;
      openingTime?: string;
      closingTime?: string;
    } = {};

    const formData = editingRestaurant ? editFormData : createFormData;
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = t('manager.validationLatitude');
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = t('manager.validationLongitude');
    }

    if (!formData.openingTime) {
      errors.openingTime = t('manager.validationOpeningTimeRequired');
    }

    if (!formData.closingTime) {
      errors.closingTime = t('manager.validationClosingTimeRequired');
    }

    if (formData.openingTime && formData.closingTime) {
      const openMinutes = toMinutes(formData.openingTime);
      const closeMinutes = toMinutes(formData.closingTime);

      if (openMinutes !== null && closeMinutes !== null && closeMinutes < openMinutes) {
        errors.closingTime = t('manager.validationClosingNotEarlierThanOpening');
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRestaurant = async (e: FormEvent) => {
    e.preventDefault();
    if (!keycloak.token) return;

    if (!validateCoordinates()) {
      return;
    }

    setCreating(true);
    try {
      const newRestaurant = await restaurantManagerService.createRestaurant(
        keycloak.token,
        createFormData
      );

      setUserData(prev =>
        prev
          ? {
              ...prev,
              ownedRestaurants: [...prev.ownedRestaurants, newRestaurant],
            }
          : null
      );

      setCreateFormData(EMPTY_FORM_DATA);
      setValidationErrors({});
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert(t('manager.errorCreatingRestaurant'));
    } finally {
      setCreating(false);
    }
  };

  const handleEditRestaurant = async (restaurant: Restaurant) => {
    const source = { ...restaurant };

    if (keycloak.token) {
      try {
        const details = await restaurantManagerService.getRestaurantDetails(
          keycloak.token,
          restaurant.id
        );
        Object.assign(source, details);
      } catch (error) {
        // Fallback to list data if details endpoint fails.
        console.error('Failed to fetch restaurant details for editing:', error);
      }
    }

    const openingRange = getDefaultOpeningRange(source);

    setEditingRestaurant(source);
    setEditFormData({
      name: source.name,
      description: source.description || '',
      latitude: source.location.latitude.value.toString(),
      longitude: source.location.longitude.value.toString(),
      photoPath: source.photoPath || '',
      openingTime: openingRange.openingTime,
      closingTime: openingRange.closingTime,
    });
    setValidationErrors({});
  };

  const handleCreateFormChange = (next: RestaurantCreateFormData) => {
    setCreateFormData(next);
    if (
      validationErrors.latitude ||
      validationErrors.longitude ||
      validationErrors.openingTime ||
      validationErrors.closingTime
    ) {
      setValidationErrors({});
    }
  };

  const handleEditFormChange = (next: RestaurantCreateFormData) => {
    setEditFormData(next);
    if (
      validationErrors.latitude ||
      validationErrors.longitude ||
      validationErrors.openingTime ||
      validationErrors.closingTime
    ) {
      setValidationErrors({});
    }
  };

  const handleUpdateRestaurant = async (e: FormEvent) => {
    e.preventDefault();
    if (!keycloak.token || !editingRestaurant) return;

    if (!validateCoordinates()) {
      return;
    }

    setUpdating(true);
    try {
      const updatedRestaurant = await restaurantManagerService.updateRestaurant(
        keycloak.token,
        editingRestaurant.id,
        editFormData
      );

      setUserData(prev =>
        prev
          ? {
              ...prev,
              ownedRestaurants: prev.ownedRestaurants.map(r =>
                r.id === editingRestaurant.id ? updatedRestaurant : r
              ),
            }
          : null
      );

      setEditingRestaurant(null);
      setEditFormData(EMPTY_FORM_DATA);
      setValidationErrors({});
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert(t('manager.errorUpdatingRestaurant'));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div
        className="w-full overflow-y-auto flex flex-col items-center px-4 pt-6 pb-28 md:pb-10"
        style={{ minHeight: 'calc(100vh - 150px)' }}
      >
        <div className="w-full max-w-6xl">
          <div>
            <RestaurantSectionHeader
              title={t('manager.yourRestaurants')}
              addLabel={t('manager.addRestaurant')}
              onAdd={() => setShowCreateForm(true)}
            />
            {!userData.ownedRestaurants || userData.ownedRestaurants.length === 0 ? (
              <p className="text-center text-gray-900 dark:text-gray-300">
                {t('manager.noRestaurantsYet')}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {userData.ownedRestaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    labels={{
                      addMenuFromPhoto: t('manager.addMenuFromPhoto'),
                      addManually: t('manager.addManually'),
                      editRestaurant: t('manager.editRestaurant'),
                      manageDrafts: t('manager.manageDrafts'),
                      managePublishedMenu: t('manager.managePublishedMenu'),
                    }}
                    onAddPhoto={handleRestaurantSelect}
                    onAddManual={handleMenuFormSelect}
                    onEdit={handleEditRestaurant}
                    onManageDrafts={handleManageDraftSelect}
                    onManagePublished={handleManagePublishedMenuSelect}
                  />
                ))}
              </div>
            )}
          </div>
          <RestaurantFormModal
            isOpen={showCreateForm}
            title={t('manager.createNewRestaurant')}
            formData={createFormData}
            validationErrors={validationErrors}
            submitLabel={creating ? t('manager.creating') : t('manager.createRestaurant')}
            cancelLabel={t('common.cancel')}
            isSubmitting={creating}
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateRestaurant}
            onValidateCoordinates={validateCoordinates}
            onChange={handleCreateFormChange}
            labels={{
              restaurantNameRequired: t('manager.restaurantNameRequired'),
              description: t('manager.description'),
              latitudeLabel: t('manager.latitudeLabel'),
              longitudeLabel: t('manager.longitudeLabel'),
              photoUrl: t('manager.photoUrl'),
              openingTimeLabel: t('manager.openingTimeLabel'),
              closingTimeLabel: t('manager.closingTimeLabel'),
              timeFormatHint: t('manager.timeFormatHint'),
            }}
          />

          <RestaurantFormModal
            isOpen={!!editingRestaurant}
            title={t('manager.editRestaurantTitle')}
            formData={editFormData}
            validationErrors={validationErrors}
            submitLabel={updating ? t('manager.updating') : t('manager.updateRestaurant')}
            cancelLabel={t('common.cancel')}
            isSubmitting={updating}
            onClose={() => setEditingRestaurant(null)}
            onSubmit={handleUpdateRestaurant}
            onValidateCoordinates={validateCoordinates}
            onChange={handleEditFormChange}
            labels={{
              restaurantNameRequired: t('manager.restaurantNameRequired'),
              description: t('manager.description'),
              latitudeLabel: t('manager.latitudeLabel'),
              longitudeLabel: t('manager.longitudeLabel'),
              photoUrl: t('manager.photoUrl'),
              openingTimeLabel: t('manager.openingTimeLabel'),
              closingTimeLabel: t('manager.closingTimeLabel'),
              timeFormatHint: t('manager.timeFormatHint'),
            }}
          />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNav page={'manager'} />
      </div>
    </div>
  );
}
