import { ToggleGroup, ToggleGroupItem } from '~/shadcn/components/ui/toggle-group';
import { Store, Sandwich } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type MapFilterValue = 'restaurants' | 'vending';

interface MapFiltersProps {
  value: MapFilterValue[];
  onChange: (value: MapFilterValue[]) => void;
}

export function MapFilters({ value, onChange }: MapFiltersProps) {
  const { t } = useTranslation();

  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      spacing={0}
      size="sm"
      value={value}
      onValueChange={next => onChange(next as MapFilterValue[])}
      className="w-full bg-white dark:bg-black rounded-md"
    >
      <ToggleGroupItem
        value="restaurants"
        aria-label={t('overview.restaurants')}
        className="flex-1 data-[state=on]:bg-transparent data-[state=on]:text-[#009DE0]"
      >
        <Store />
        <span className="hidden sm:block">{t('overview.restaurants')}</span>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="vending"
        aria-label={t('overview.vendingMachines')}
        className="flex-1 data-[state=on]:bg-transparent data-[state=on]:text-[#009DE0]"
      >
        <Sandwich />
        <span className="hidden sm:block">{t('overview.vendingMachines')}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
