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
    <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm" onValueChange={(value) => console.log("Changed:", value)}>
      <ToggleGroupItem
        value="vegan"
        aria-label="Toggle vegan"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
      >
        <Vegan />
        Vegan
      </ToggleGroupItem>
      <ToggleGroupItem
        value="vegetarian"
        aria-label="Toggle vegetarian"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
      >
        <Sprout />
        Vegetarian
      </ToggleGroupItem>
      <ToggleGroupItem
        value="lactose-free"
        aria-label="Toggle lactose free"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
      >
        <MilkOff />
        Lactose-free
      </ToggleGroupItem>
      <ToggleGroupItem
        value="gluten-free"
        aria-label="Toggle gluten free"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
      >
        <WheatOff />
        Gluten-free
      </ToggleGroupItem>
    </ToggleGroup>
  )
}