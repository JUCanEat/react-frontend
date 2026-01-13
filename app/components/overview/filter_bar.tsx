// contains 'filter_options' (eg. "Vegan", "Vegetarian") in one stripe
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { 
    Vegan,
    Sprout,
    MilkOff,
    WheatOff 
} from 'lucide-react';

import {
  ToggleGroup,
  ToggleGroupItem
} from '~/shadcn/components/ui/toggle-group'

export type FilterValue = "vegan" | "vegetarian" | "lactoseFree" | "glutenFree"

export interface FilterBarProps {
    value: FilterValue[]
    onChange: (value: FilterValue[]) => void
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
      <ToggleGroup
          type="multiple"
          variant="outline"
          className={"pt-5"}
          spacing={0}
          size="sm"
          value={value}
          onValueChange={(val) => onChange(val as FilterValue[])}>
          <ToggleGroupItem
              value="vegan"
              aria-label="Toggle vegan"
              className="flex-1 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:stroke-jcablue"
          >
              <Vegan />
              <div className={"hidden osm1:block"}>
                  Vegan
              </div>
          </ToggleGroupItem>
          <ToggleGroupItem
              value="vegetarian"
              aria-label="Toggle vegetarian"
              className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-jcablue"
          >
              <Sprout />
              <div className={"hidden osm1:block"}>
                  Vegetarian
              </div>
          </ToggleGroupItem>
          <ToggleGroupItem
              value="lactoseFree"
              aria-label="Toggle lactose free"
              className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-jcablue"
          >
              <MilkOff />
              <div className={"hidden osm1:block"}>
                  Lactose-free
              </div>
          </ToggleGroupItem>
          <ToggleGroupItem
              value="glutenFree"
              aria-label="Toggle gluten free"
              className="flex-1 osm1:justify-center data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-jcablue"
          >
              <WheatOff />
              <div className={"hidden osm1:block"}>
                  Gluten-free
              </div>
          </ToggleGroupItem>
      </ToggleGroup>
  )
}