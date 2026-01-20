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
      <Carousel
        className="w-full"
        opts={{ align: 'start', loop: true }}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem
              key={item.id ?? index}
              className={'basis-1/2 sm:basis-1/3'}
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
      {selectedPoint && (
        <FacilityInfo
          selectedPoint={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </div>
  );
}
