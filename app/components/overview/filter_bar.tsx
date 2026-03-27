import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { Vegan, Sprout, MilkOff, WheatOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ToggleGroup, ToggleGroupItem } from '~/shadcn/components/ui/toggle-group';

export type FilterValue = 'vegan' | 'vegetarian' | 'lactoseFree' | 'glutenFree';

export interface FilterBarProps {
  value: FilterValue[];
  onChange: (value: FilterValue[]) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  const { t } = useTranslation();

  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      spacing={0}
      size="sm"
      value={value}
      onValueChange={val => onChange(val as FilterValue[])}
    >
      <ToggleGroupItem
        value="vegan"
        aria-label={t('filters.toggleVegan')}
        className="flex-1 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:stroke-jcablue"
      >
        <Vegan />
        <div className={'hidden osm1:block'}>{t('filters.vegan')}</div>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="vegetarian"
        aria-label={t('filters.toggleVegetarian')}
        className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-jcablue"
      >
        <Sprout />
        <div className={'hidden osm1:block'}>{t('filters.vegetarian')}</div>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="lactoseFree"
        aria-label={t('filters.toggleLactoseFree')}
        className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-jcablue"
      >
        <MilkOff />
        <div className={'hidden osm1:block'}>{t('filters.lactoseFree')}</div>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="glutenFree"
        aria-label={t('filters.toggleGlutenFree')}
        className="flex-1 osm1:justify-center data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-jcablue"
      >
        <WheatOff />
        <div className={'hidden osm1:block'}>{t('filters.glutenFree')}</div>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
