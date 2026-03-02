import React, { useState, useEffect } from 'react';
import {
  useGetRestaurantDetails,
  useUpdateRestaurant,
  useGetRestaurantOwners,
} from '~/api/restaurant_service';
import type { UpdateRestaurantRequest, RestaurantDetailsDTO } from '~/interfaces';

interface RestaurantEditFormProps {
  restaurantId: string;
  onSave?: (updatedRestaurant: RestaurantDetailsDTO) => void;
  onCancel?: () => void;
}

export function RestaurantEditForm({ restaurantId, onSave, onCancel }: RestaurantEditFormProps) {
  const {
    data: restaurant,
    isLoading: loadingRestaurant,
    error: restaurantError,
  } = useGetRestaurantDetails(restaurantId);
  const { data: owners, isLoading: loadingOwners } = useGetRestaurantOwners(restaurantId);
  const updateMutation = useUpdateRestaurant(restaurantId);

  const [formData, setFormData] = useState<UpdateRestaurantRequest>({
    name: '',
    description: '',
    photoPath: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        description: restaurant.description,
        photoPath: restaurant.photoPath,
        location: {
          latitude: restaurant.location.latitude.value,
          longitude: restaurant.location.longitude.value,
        },
      });
    }
  }, [restaurant]);

  const handleInputChange = (field: keyof UpdateRestaurantRequest, value: string | number) => {
    if (field === 'location') {
      return; // Handle location separately
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: 'latitude' | 'longitude', value: number) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: UpdateRestaurantRequest = {};
    if (restaurant) {
      if (formData.name !== restaurant.name) updates.name = formData.name;
      if (formData.description !== restaurant.description)
        updates.description = formData.description;
      if (formData.photoPath !== restaurant.photoPath) updates.photoPath = formData.photoPath;
      if (
        formData.location?.latitude !== restaurant.location.latitude.value ||
        formData.location?.longitude !== restaurant.location.longitude.value
      ) {
        updates.location = formData.location;
      }
    }

    if (Object.keys(updates).length === 0) {
      alert('No changes detected');
      return;
    }

    try {
      const updatedRestaurant = await updateMutation.mutateAsync(updates);
      setIsEditing(false);
      onSave?.(updatedRestaurant);
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      alert(
        `Failed to update restaurant: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleCancel = () => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        description: restaurant.description,
        photoPath: restaurant.photoPath,
        location: {
          latitude: restaurant.location.latitude.value,
          longitude: restaurant.location.longitude.value,
        },
      });
    }
    setIsEditing(false);
    onCancel?.();
  };

  if (loadingRestaurant) {
    return <div className="flex justify-center p-8">Loading restaurant details...</div>;
  }

  if (restaurantError) {
    return (
      <div className="text-red-600 p-4">Error loading restaurant: {restaurantError.message}</div>
    );
  }

  if (!restaurant) {
    return <div className="text-gray-600 p-4">Restaurant not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="photoPath"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Photo Path
          </label>
          <input
            type="text"
            id="photoPath"
            value={formData.photoPath}
            onChange={e => handleInputChange('photoPath', e.target.value)}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              value={formData.location?.latitude || 0}
              onChange={e => handleLocationChange('latitude', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              value={formData.location?.longitude || 0}
              onChange={e => handleLocationChange('longitude', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {loadingOwners ? (
          <div>Loading owners...</div>
        ) : (
          owners && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Owners
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {owners.length > 0 ? (
                  <ul className="space-y-1">
                    {owners.map((ownerId, index) => (
                      <li
                        key={index}
                        className="text-gray-700"
                      >
                        {ownerId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No owners found</p>
                )}
              </div>
            </div>
          )
        )}

        {isEditing && (
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {updateMutation.error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error updating restaurant: {updateMutation.error.message}
        </div>
      )}
    </div>
  );
}
