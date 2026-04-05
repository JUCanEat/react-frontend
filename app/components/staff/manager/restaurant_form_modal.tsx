import type { FormEvent } from 'react';
import type { RestaurantCreateFormData } from '~/interfaces';

interface RestaurantFormModalProps {
  isOpen: boolean;
  title: string;
  formData: RestaurantCreateFormData;
  validationErrors: {
    latitude?: string;
    longitude?: string;
    openingTime?: string;
    closingTime?: string;
  };
  submitLabel: string;
  cancelLabel: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onValidateCoordinates: () => void;
  onChange: (next: RestaurantCreateFormData) => void;
  labels: {
    restaurantNameRequired: string;
    description: string;
    latitudeLabel: string;
    longitudeLabel: string;
    photoUrl: string;
    openingTimeLabel: string;
    closingTimeLabel: string;
    timeFormatHint: string;
  };
}

export function RestaurantFormModal({
  isOpen,
  title,
  formData,
  validationErrors,
  submitLabel,
  cancelLabel,
  isSubmitting,
  onClose,
  onSubmit,
  onValidateCoordinates,
  onChange,
  labels,
}: RestaurantFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {labels.restaurantNameRequired}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => onChange({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {labels.description}
              </label>
              <textarea
                value={formData.description}
                onChange={e => onChange({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.latitudeLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.latitude}
                  onChange={e => onChange({ ...formData, latitude: e.target.value })}
                  onBlur={onValidateCoordinates}
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
                  {labels.longitudeLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.longitude}
                  onChange={e => onChange({ ...formData, longitude: e.target.value })}
                  onBlur={onValidateCoordinates}
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
                {labels.photoUrl}
              </label>
              <input
                type="text"
                value={formData.photoPath}
                onChange={e => onChange({ ...formData, photoPath: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.openingTimeLabel}
                </label>
                <input
                  type="time"
                  required
                  value={formData.openingTime}
                  onChange={e => onChange({ ...formData, openingTime: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                    validationErrors.openingTime
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-zinc-600'
                  }`}
                />
                {validationErrors.openingTime && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.openingTime}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.closingTimeLabel}
                </label>
                <input
                  type="time"
                  required
                  value={formData.closingTime}
                  onChange={e => onChange({ ...formData, closingTime: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                    validationErrors.closingTime
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-zinc-600'
                  }`}
                />
                {validationErrors.closingTime && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.closingTime}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
              {labels.timeFormatHint}
            </p>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-white bg-[#009DE0] rounded hover:bg-[#007bb8] disabled:bg-gray-400 transition-colors"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
