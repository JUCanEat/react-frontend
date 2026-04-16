import type { Restaurant } from '~/interfaces';

interface RestaurantCardProps {
  restaurant: Restaurant;
  labels: {
    addMenuFromPhoto: string;
    addManually: string;
    editRestaurant: string;
    manageDrafts: string;
    managePublishedMenu: string;
  };
  onAddPhoto: (restaurantId: string) => void;
  onAddManual: (restaurantId: string) => void;
  onEdit: (restaurant: Restaurant) => void;
  onManageDrafts: (restaurantId: string) => void;
  onManagePublished: (restaurantId: string) => void;
}

export function RestaurantCard({
  restaurant,
  labels,
  onAddPhoto,
  onAddManual,
  onEdit,
  onManageDrafts,
  onManagePublished,
}: RestaurantCardProps) {
  return (
    <div className="p-4 border rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col h-full">
      <div className="mb-3">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{restaurant.name}</p>
        {restaurant.description && (
          <p className="text-sm opacity-60 mt-1 text-gray-700 dark:text-gray-400">
            {restaurant.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          className="px-3 py-2 rounded text-sm font-medium text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
          onClick={() => onAddPhoto(restaurant.id)}
        >
          {labels.addMenuFromPhoto}
        </button>
        <button
          className="px-3 py-2 rounded text-sm font-medium text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
          onClick={() => onAddManual(restaurant.id)}
        >
          {labels.addManually}
        </button>
        <button
          className="px-3 py-2 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
          onClick={() => onEdit(restaurant)}
        >
          {labels.editRestaurant}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button
          className="w-full px-3 py-2 rounded text-sm font-medium text-[#009DE0] bg-white border border-[#009DE0] hover:bg-sky-50 transition-colors"
          onClick={() => onManageDrafts(restaurant.id)}
        >
          {labels.manageDrafts}
        </button>
        <button
          className="w-full px-3 py-2 rounded text-sm font-medium text-[#009DE0] bg-white border border-[#009DE0] hover:bg-sky-50 transition-colors"
          onClick={() => onManagePublished(restaurant.id)}
        >
          {labels.managePublishedMenu}
        </button>
      </div>
    </div>
  );
}
