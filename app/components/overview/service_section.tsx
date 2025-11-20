// glues a "service_section_infostripe" atop a sequence of "service_vendors"
// into a stripe that we would identify as eg. "the Restaurant section" or "the Cafes"..
import * as React from "react"

import { Card, CardContent } from "~/shadcn/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "~/shadcn/components/ui/carousel"
import { useQuery } from '@tanstack/react-query'
import { allRestaurantsEndpoint, rootQueryUrl } from '~/root'

import type { Restaurant } from "~/interfaces"


export function ServiceSection() {
    const { isPending, error, data } = useQuery<Restaurant[]>({
        queryKey: ['allRestaurantData'], // quite arbitrary for our purposes now, read docs abt queryKey!
        queryFn: () =>
            fetch(`${rootQueryUrl}/${allRestaurantsEndpoint}`).then((res) =>
                res.json(),
            ),
    })

    let carouselArray: Array<string>;
    if (isPending) carouselArray = Array.from({ length: 3 }, () => 'Loading...')
    if (error || data === undefined) carouselArray = Array.from({ length: 3 }, () => 'Error')
    else carouselArray = data.map((restaurantObj: Restaurant) => restaurantObj.name)

    return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {carouselArray.map((value, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{value}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
