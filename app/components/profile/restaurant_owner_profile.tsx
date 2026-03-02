import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Restaurant } from '~/interfaces';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  ownedRestaurants: Restaurant[];
}

interface CreateRestaurantData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  photoPath: string;
}

export default function RestaurantOwnerProfile() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateRestaurantData>({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    photoPath: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    latitude?: string;
    longitude?: string;
  }>({});
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editFormData, setEditFormData] = useState<CreateRestaurantData>({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    photoPath: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!keycloak.token) {
        console.log('No token available');
        return;
      }

      console.log('Fetching user data...');

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('User data:', data);
          setUserData(data);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch user data. Status:', response.status, 'Error:', errorText);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (initialized && keycloak.authenticated) {
      fetchUserData();
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
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">Loading profile…</p>
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
            Failed to load profile
          </p>
        </div>
        <div className="fixed bottom-0 left-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    );
  }

  const handleRestaurantSelect = (restaurantId: string) => {
    navigate(`/staff/menu-from-photo/${restaurantId}`);
  };

  const handleMenuFormSelect = (restaurantId: string) => {
    navigate(`/staff/menu-from-form/${restaurantId}`);
  };

  const validateCoordinates = () => {
    const errors: { latitude?: string; longitude?: string } = {};

    const formData = editingRestaurant ? editFormData : createFormData;
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be a number between -90 and 90';
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude must be a number between -180 and 180';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keycloak.token) return;

    if (!validateCoordinates()) {
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({
          ...createFormData,
          latitude: parseFloat(createFormData.latitude),
          longitude: parseFloat(createFormData.longitude),
        }),
      });

      if (response.ok) {
        const newRestaurant = await response.json();

        setUserData(prev =>
          prev
            ? {
                ...prev,
                ownedRestaurants: [...prev.ownedRestaurants, newRestaurant],
              }
            : null
        );

        setCreateFormData({
          name: '',
          description: '',
          latitude: '',
          longitude: '',
          photoPath: '',
        });
        setValidationErrors({});
        setShowCreateForm(false);
      } else {
        const errorText = await response.text();
        console.error('Failed to create restaurant:', response.status, errorText);
        alert('Failed to create restaurant. Please try again.');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert('An error occurred while creating the restaurant.');
    } finally {
      setCreating(false);
    }
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setEditFormData({
      name: restaurant.name,
      description: restaurant.description || '',
      latitude: restaurant.location.latitude.value.toString(),
      longitude: restaurant.location.longitude.value.toString(),
      photoPath: restaurant.photoPath || '',
    });
    setValidationErrors({});
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keycloak.token || !editingRestaurant) return;

    if (!validateCoordinates()) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${editingRestaurant.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({
            ...editFormData,
            latitude: parseFloat(editFormData.latitude),
            longitude: parseFloat(editFormData.longitude),
          }),
        }
      );

      if (response.ok) {
        const updatedRestaurant = await response.json();

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
        setEditFormData({
          name: '',
          description: '',
          latitude: '',
          longitude: '',
          photoPath: '',
        });
        setValidationErrors({});
      } else {
        const errorText = await response.text();
        console.error('Failed to update restaurant:', response.status, errorText);
        alert('Failed to update restaurant. Please try again.');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('An error occurred while updating the restaurant.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div
        className="w-full flex flex-col items-center px-4 py-6"
        style={{ minHeight: 'calc(100vh - 150px)' }}
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-sm opacity-80 mt-1 text-gray-800 dark:text-gray-300">
              {userData.email}
            </p>
            <p className="text-sm opacity-60 text-gray-700 dark:text-gray-400">
              @{userData.username}
            </p>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your restaurants
              </h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#009DE0] rounded hover:bg-[#007bb8] transition-colors"
              >
                + Add Restaurant
              </button>
            </div>
            {!userData.ownedRestaurants || userData.ownedRestaurants.length === 0 ? (
              <p className="text-center text-gray-900 dark:text-gray-300">
                You don't have any restaurants yet.
              </p>
            ) : (
              <div className="space-y-3">
                {userData.ownedRestaurants.map(restaurant => (
                  <div
                    key={restaurant.id}
                    className="p-4 border rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  >
                    <div className="mb-3">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {restaurant.name}
                      </p>
                      {restaurant.description && (
                        <p className="text-sm opacity-60 mt-1 text-gray-700 dark:text-gray-400">
                          {restaurant.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-3 py-2 rounded text-sm font-medium text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
                        onClick={() => handleRestaurantSelect(restaurant.id)}
                      >
                        Add menu from photo
                      </button>
                      <button
                        className="flex-1 px-3 py-2 rounded text-sm font-medium text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
                        onClick={() => handleMenuFormSelect(restaurant.id)}
                      >
                        Add manually
                      </button>
                      <button
                        className="px-3 py-2 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                        onClick={() => handleEditRestaurant(restaurant)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Create New Restaurant
                    </h3>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={handleCreateRestaurant}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={createFormData.name}
                        onChange={e =>
                          setCreateFormData(prev => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={createFormData.description}
                        onChange={e =>
                          setCreateFormData(prev => ({ ...prev, description: e.target.value }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Latitude * (-90 to 90)
                        </label>
                        <input
                          type="text"
                          required
                          value={createFormData.latitude}
                          onChange={e => {
                            setCreateFormData(prev => ({ ...prev, latitude: e.target.value }));
                            if (validationErrors.latitude) {
                              setValidationErrors(prev => ({ ...prev, latitude: undefined }));
                            }
                          }}
                          onBlur={validateCoordinates}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                            validationErrors.latitude
                              ? 'border-red-500 dark:border-red-400'
                              : 'border-gray-300 dark:border-zinc-600'
                          }`}
                          placeholder="e.g., 40.7128"
                        />
                        {validationErrors.latitude && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.latitude}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Longitude * (-180 to 180)
                        </label>
                        <input
                          type="text"
                          required
                          value={createFormData.longitude}
                          onChange={e => {
                            setCreateFormData(prev => ({ ...prev, longitude: e.target.value }));
                            if (validationErrors.longitude) {
                              setValidationErrors(prev => ({ ...prev, longitude: undefined }));
                            }
                          }}
                          onBlur={validateCoordinates}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                            validationErrors.longitude
                              ? 'border-red-500 dark:border-red-400'
                              : 'border-gray-300 dark:border-zinc-600'
                          }`}
                          placeholder="e.g., -74.0060"
                        />
                        {validationErrors.longitude && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.longitude}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Photo URL
                      </label>
                      <input
                        type="text"
                        value={createFormData.photoPath}
                        onChange={e =>
                          setCreateFormData(prev => ({ ...prev, photoPath: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 px-4 py-2 text-white bg-[#009DE0] rounded hover:bg-[#007bb8] disabled:bg-gray-400 transition-colors"
                      >
                        {creating ? 'Creating...' : 'Create Restaurant'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {editingRestaurant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edit Restaurant
                    </h3>
                    <button
                      onClick={() => setEditingRestaurant(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={handleUpdateRestaurant}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editFormData.name}
                        onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editFormData.description}
                        onChange={e =>
                          setEditFormData(prev => ({ ...prev, description: e.target.value }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Latitude * (-90 to 90)
                        </label>
                        <input
                          type="text"
                          required
                          value={editFormData.latitude}
                          onChange={e => {
                            setEditFormData(prev => ({ ...prev, latitude: e.target.value }));
                            if (validationErrors.latitude) {
                              setValidationErrors(prev => ({ ...prev, latitude: undefined }));
                            }
                          }}
                          onBlur={validateCoordinates}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                            validationErrors.latitude
                              ? 'border-red-500 dark:border-red-400'
                              : 'border-gray-300 dark:border-zinc-600'
                          }`}
                          placeholder="e.g., 40.7128"
                        />
                        {validationErrors.latitude && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.latitude}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Longitude * (-180 to 180)
                        </label>
                        <input
                          type="text"
                          required
                          value={editFormData.longitude}
                          onChange={e => {
                            setEditFormData(prev => ({ ...prev, longitude: e.target.value }));
                            if (validationErrors.longitude) {
                              setValidationErrors(prev => ({ ...prev, longitude: undefined }));
                            }
                          }}
                          onBlur={validateCoordinates}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                            validationErrors.longitude
                              ? 'border-red-500 dark:border-red-400'
                              : 'border-gray-300 dark:border-zinc-600'
                          }`}
                          placeholder="e.g., -74.0060"
                        />
                        {validationErrors.longitude && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.longitude}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Photo URL
                      </label>
                      <input
                        type="text"
                        value={editFormData.photoPath}
                        onChange={e =>
                          setEditFormData(prev => ({ ...prev, photoPath: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingRestaurant(null)}
                        className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 px-4 py-2 text-white bg-[#009DE0] rounded hover:bg-[#007bb8] disabled:bg-gray-400 transition-colors"
                      >
                        {updating ? 'Updating...' : 'Update Restaurant'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>
    </div>
  );
}
