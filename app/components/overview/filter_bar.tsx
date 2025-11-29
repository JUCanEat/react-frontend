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

export function FilterBar() {
  return (
      <ToggleGroup type="multiple" variant="outline" spacing={0} size="sm" onValueChange={(value) => console.log("Changed:", value)}>
          <ToggleGroupItem
              value="vegan"
              aria-label="Toggle vegan"
              className="flex-1 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:stroke-blue-500"
          >
              <Vegan />
              Vegan
          </ToggleGroupItem>
          <ToggleGroupItem
              value="vegetarian"
              aria-label="Toggle vegetarian"
              className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-blue-500"
          >
              <Sprout />
              Vegetarian
          </ToggleGroupItem>
          <ToggleGroupItem
              value="lactose-free"
              aria-label="Toggle lactose free"
              className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-blue-500"
          >
              <MilkOff />
              Lactose-free
          </ToggleGroupItem>
          <ToggleGroupItem
              value="gluten-free"
              aria-label="Toggle gluten free"
              className="flex-1 data-[state=on]:bg-transparent  data-[state=on]:*:[svg]:stroke-blue-500"
          >
              <WheatOff />
              Gluten-free
          </ToggleGroupItem>
      </ToggleGroup>
  )
}