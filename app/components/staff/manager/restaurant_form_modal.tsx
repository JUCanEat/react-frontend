import { useState, useEffect, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { RestaurantCreateFormData, OpeningHoursDTO, DayOfWeek } from '~/interfaces';
import { DAYS_OF_WEEK } from '~/interfaces';

const DAY_I18N_KEY: Record<DayOfWeek, string> = {
  MONDAY: 'daysShort.monday',
  TUESDAY: 'daysShort.tuesday',
  WEDNESDAY: 'daysShort.wednesday',
  THURSDAY: 'daysShort.thursday',
  FRIDAY: 'daysShort.friday',
  SATURDAY: 'daysShort.saturday',
  SUNDAY: 'daysShort.sunday',
};

function makeDefaultPerDayHours(openTime: string, closeTime: string): OpeningHoursDTO[] {
  return DAYS_OF_WEEK.map(day => ({ dayOfWeek: day, openTime, closeTime }));
}

function allSameHours(hours: OpeningHoursDTO[]): boolean {
  if (!hours || hours.length === 0) return true;
  const { openTime, closeTime, closed } = hours[0];
  return hours.every(
    h => h.openTime === openTime && h.closeTime === closeTime && !!h.closed === !!closed
  );
}

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
  const { t } = useTranslation();
  const [sameHoursEveryDay, setSameHoursEveryDay] = useState(true);
  const [perDayHours, setPerDayHours] = useState<OpeningHoursDTO[]>(makeDefaultPerDayHours('', ''));

  useEffect(() => {
    if (isOpen) {
      const hasOpeningHours = (formData.openingHours?.length ?? 0) > 0;
      if (hasOpeningHours && !allSameHours(formData.openingHours!)) {
        setSameHoursEveryDay(false);
        setPerDayHours(
          DAYS_OF_WEEK.map(day => {
            const existing = formData.openingHours!.find(h => h.dayOfWeek === day);
            return existing ?? { dayOfWeek: day, openTime: '', closeTime: '' };
          })
        );
      } else {
        setSameHoursEveryDay(true);
        const openTime = hasOpeningHours
          ? formData.openingHours![0].openTime
          : (formData.openingTime ?? '');
        const closeTime = hasOpeningHours
          ? formData.openingHours![0].closeTime
          : (formData.closingTime ?? '');
        setPerDayHours(makeDefaultPerDayHours(openTime, closeTime));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSameHours = () => {
    if (sameHoursEveryDay) {
      // Switching to per-day mode: copy current same hours to all days
      const newPerDayHours = makeDefaultPerDayHours(
        formData.openingTime ?? '',
        formData.closingTime ?? ''
      ).map(h => ({ ...h, openTime: h.openTime || '', closeTime: h.closeTime || '' }));
      setPerDayHours(newPerDayHours);
      setSameHoursEveryDay(false);
      onChange({
        ...formData,
        openingHours: newPerDayHours,
        openingTime: undefined,
        closingTime: undefined,
      });
    } else {
      // Switching to same every day: use first non-closed or first day as template
      const firstOpen = perDayHours.find(h => h.openTime && h.closeTime) ?? perDayHours[0];
      setSameHoursEveryDay(true);
      onChange({
        ...formData,
        openingHours: undefined,
        openingTime: firstOpen?.openTime ?? '',
        closingTime: firstOpen?.closeTime ?? '',
      });
    }
  };

  const handlePerDayChange = (day: DayOfWeek, field: 'openTime' | 'closeTime', value: string) => {
    const updated = perDayHours.map(h =>
      h.dayOfWeek === day
        ? {
            dayOfWeek: day,
            openTime: field === 'openTime' ? value : h.openTime,
            closeTime: field === 'closeTime' ? value : h.closeTime,
          }
        : h
    );
    setPerDayHours(updated);
    onChange({
      ...formData,
      openingHours: updated,
      openingTime: undefined,
      closingTime: undefined,
    });
  };

  const renderTimeField = (
    label: string,
    value: string,
    error: string | undefined,
    onChangeField: (val: string) => void
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="time"
        required
        value={value}
        onChange={e => onChangeField(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
          error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-600'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const timeInputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white';

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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('manager.openingHoursLabel')}
                </label>
                <button
                  type="button"
                  onClick={handleToggleSameHours}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                >
                  <span
                    className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-sm border text-[10px] leading-none transition-colors ${
                      sameHoursEveryDay
                        ? 'bg-[#009DE0] border-[#009DE0] text-white'
                        : 'border-gray-400 dark:border-zinc-500 bg-transparent'
                    }`}
                  >
                    {sameHoursEveryDay && '✓'}
                  </span>
                  {t('manager.sameHoursEveryDay')}
                </button>
              </div>

              {sameHoursEveryDay ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {renderTimeField(
                      labels.openingTimeLabel,
                      formData.openingTime ?? '',
                      validationErrors.openingTime,
                      val => onChange({ ...formData, openingTime: val, openingHours: undefined })
                    )}
                    {renderTimeField(
                      labels.closingTimeLabel,
                      formData.closingTime ?? '',
                      validationErrors.closingTime,
                      val => onChange({ ...formData, closingTime: val, openingHours: undefined })
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {labels.timeFormatHint}
                  </p>
                </>
              ) : (
                <table className="w-full text-sm border-collapse table-fixed">
                  <thead>
                    <tr>
                      <th className="text-left py-1 pr-2 font-medium text-gray-700 dark:text-gray-300 text-xs w-8" />
                      <th className="text-left py-1 pr-3 font-medium text-gray-700 dark:text-gray-300 text-xs w-1/2">
                        {labels.openingTimeLabel}
                      </th>
                      <th className="text-left py-1 font-medium text-gray-700 dark:text-gray-300 text-xs w-1/2">
                        {labels.closingTimeLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {perDayHours.map(h => (
                      <tr
                        key={h.dayOfWeek}
                        className="border-t border-gray-100 dark:border-zinc-700"
                      >
                        <td className="py-1 pr-2 font-medium text-gray-700 dark:text-gray-300 text-xs align-middle whitespace-nowrap">
                          {t(DAY_I18N_KEY[h.dayOfWeek])}
                        </td>
                        <td className="py-1 pr-3 align-middle">
                          <input
                            type="time"
                            required
                            value={h.openTime}
                            onChange={e =>
                              handlePerDayChange(h.dayOfWeek, 'openTime', e.target.value)
                            }
                            className={timeInputClass}
                          />
                        </td>
                        <td className="py-1 align-middle">
                          <input
                            type="time"
                            required
                            value={h.closeTime}
                            onChange={e =>
                              handlePerDayChange(h.dayOfWeek, 'closeTime', e.target.value)
                            }
                            className={timeInputClass}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

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
