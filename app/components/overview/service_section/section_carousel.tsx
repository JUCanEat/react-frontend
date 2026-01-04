"use client"

import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/shadcn/components/ui/carousel"

import { RestaurantTile } from "~/components/overview/service_section/restaurant_tile"
import { VendingMachineTile } from "~/components/overview/service_section/vending_machine_tile"
import { useRestaurantStore } from "~/store/restaurant_store";
import { useNavigate } from "react-router-dom";

export type ServiceVariant = "restaurant" | "vending"

interface SectionCarouselProps {
    items: any[]
    variant: ServiceVariant
}

export function SectionCarousel({ items, variant }: SectionCarouselProps) {
    const navigate = useNavigate();
    const setSelectedRestaurant = useRestaurantStore.getState().setSelectedRestaurant;

    return (
        <div className="flex justify-center px-14">
            <Carousel className="w-full max-w-[227px]" opts={{ align: "start", loop: true }}>
                <CarouselContent>
                    {items.map((item, index) => (
                        <CarouselItem key={item.id ?? index}>
                            <div className="p-1 flex justify-center">
                                {variant === "restaurant" ? (
                                    <RestaurantTile
                                        name={item.name}
                                        description={item.description}
                                        openNow={item.openNow}
                                        onClick={() => {
                                            setSelectedRestaurant(item);
                                            navigate('/menu');
                                        }}
                                    />
                                ) : (
                                    <VendingMachineTile description={item.description} />
                                )}
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
