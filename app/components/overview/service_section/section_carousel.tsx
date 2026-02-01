'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/shadcn/components/ui/carousel';

import { RestaurantTile } from '~/components/overview/service_section/restaurant_tile';
import { VendingMachineTile } from '~/components/overview/service_section/vending_machine_tile';
import { useRestaurantStore } from '~/store/restaurant_store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FacilityInfo } from '~/components/map/facility_info_box';
import type { Facility } from '~/interfaces';

export type ServiceVariant = 'restaurant' | 'vending';

interface SectionCarouselProps {
  items: any[];
  variant: ServiceVariant;
}

export function SectionCarousel({ items, variant }: SectionCarouselProps) {
  const navigate = useNavigate();
  const setSelectedRestaurant = useRestaurantStore.getState().setSelectedRestaurant;
  const [selectedPoint, setSelectedPoint] = useState<Facility | null>(null);

  return (
    <div className="flex justify-center">
      <div className="relative w-full">
        <Carousel
          className="w-full"
          opts={{ align: 'start', loop: false }}
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem
                key={item.id ?? index}
                className={'basis-64'}
              >
                <div className="py-1 flex justify-center">
                  {variant === 'restaurant' ? (
                    <RestaurantTile
                      name={item.name}
                      description={item.description}
                      openNow={item.openNow}
                      onClick={() => {
                        // show the FacilityInfo modal on top of the overview
                        setSelectedPoint(item);
                      }}
                    />
                  ) : (
                    <VendingMachineTile description={item.description} />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/*<CarouselPrevious />*/}
          {/*<CarouselNext />*/}
        </Carousel>
        <div className="absolute right-0 top-0 bottom-0 w-[50px] pointer-events-none gradientbp:bg-gradient-to-r gradientbp::from-transparent gradientbp:via-white/100 gradientbp:via-30% gradientbp:to-white dark:via-zinc-950/70 dark:to-zinc-950" />
      </div>
      {selectedPoint && (
        <FacilityInfo
          selectedPoint={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </div>
  );
}
