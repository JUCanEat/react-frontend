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

import type { Restaurant } from "~/interfaces"


export function ServiceSection({carouselItemSource} : {carouselItemSource: () => any} ) {
    const { isPending, error, data } = carouselItemSource()

    let carouselArray: Array<string>;
    if (isPending) carouselArray = Array.from({ length: 3 }, () => 'Loading...')
    else if (error || data === undefined) carouselArray = Array.from({ length: 3 }, () => 'Error')
    else carouselArray = data.map((retrievedObj: any) => retrievedObj.name)

    return (
        <div className="flex px-14 justify-center">
        <Carousel className="w-full max-w-xs" opts={{ align: "start", loop: true}}>
          <CarouselContent>
            {carouselArray.map((value, index) => (
              <CarouselItem key={index} className="basis-3/5">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-xl font-semibold">{value}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        </div>
  )
}