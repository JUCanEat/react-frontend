/**
 Filters in the main page (overview) allow to filter restaurants based on whether they have at least one
 dish satisfying the applied filters available today (in the active menu).
 Meaning, a dish is filtered out when it contains allergen that conflicts with the filter (like for "GLUTEN" allergen and "gluten-free" filter),
 and the restaurant is filtered out if it does not have any dishes left in active menu after this filtering.
 */

import { useQuery } from "@tanstack/react-query"
import { rootQueryUrl, menusEndpoint } from "~/root"

import type { Restaurant, DailyMenu } from "~/interfaces"
import type { FilterValue } from "~/components/overview/filter_bar"
import {
    hasVeganOption,
    hasVegetarianOption,
    hasLactoseFreeOption,
    hasGlutenFreeOption,
} from "~/shadcn/lib/dish_filters"

interface UseRestaurantItemsWithFiltersProps {
    carouselItemSource: () => {
        isPending: boolean
        error: unknown
        data?: Restaurant[]
    }
    filters: FilterValue[]
}

export function useRestaurantItemsWithFilters({
                                                  carouselItemSource,
                                                  filters,
                                              }: UseRestaurantItemsWithFiltersProps) {
    const {
        isPending,
        error,
        data,
    } = carouselItemSource()

    const { data: menusData } = useQuery<Record<string, DailyMenu | null>>({
        queryKey: ["allRestaurantMenus", data?.map((r) => r.id)],
        queryFn: async () => {
            if (!data) return {}

            const menuPromises = data.map(async (restaurant) => {
                try {
                    const response = await fetch(
                        `${rootQueryUrl}/${menusEndpoint}/${restaurant.id}`,
                    )
                    const menu = await response.json()
                    return { restaurantId: restaurant.id, menu }
                } catch {
                    return { restaurantId: restaurant.id, menu: null }
                }
            })

            const menuResults = await Promise.all(menuPromises)

            return menuResults.reduce((acc, { restaurantId, menu }) => {
                acc[restaurantId] = menu as DailyMenu | null
                return acc
            }, {} as Record<string, DailyMenu | null>)
        },
        enabled: !!data && data.length > 0,
    })

    if (isPending || error || !data) {
        return { isPending, error, items: [] as Restaurant[] }
    }

    const open = data.filter((r) => r.openNow)
    const closed = data.filter((r) => !r.openNow)
    let filtered: Restaurant[] = [...open, ...closed]

    if (filters.length > 0) {
        filtered = filtered.filter((r) => {
            const menu = menusData?.[r.id] || null

            return filters.every((f) => {
                switch (f) {
                    case "vegan":
                        return hasVeganOption(menu)
                    case "vegetarian":
                        return hasVegetarianOption(menu)
                    case "lactoseFree":
                        return hasLactoseFreeOption(menu)
                    case "glutenFree":
                        return hasGlutenFreeOption(menu)
                    default:
                        return true
                }
            })
        })
    }

    return { isPending, error, items: filtered }
}
