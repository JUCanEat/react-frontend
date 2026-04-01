// glues a "service_section_infostripe" atop a sequence of "service_vendors"
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import type { FilterValue } from '~/components/overview/filter_bar';
import { SectionSkeleton } from '~/components/overview/service_section/section_skeleton';
import {
  SectionCarousel,
  type ServiceVariant,
} from '~/components/overview/service_section/section_carousel';
import { useRestaurantItemsWithFilters } from '~/components/overview/service_section/use_restaurant_items_with_filters';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/shadcn/components/ui/carousel';

interface ServiceSectionProps {
  carouselItemSource: () => any;
  variant: ServiceVariant;
  filters?: FilterValue[];
  query?: string;
}

export function ServiceSection({
  carouselItemSource,
  variant,
  filters = [],
  query = '',
}: ServiceSectionProps) {
  const { t } = useTranslation();
  const normalizedQuery = query.trim().toLowerCase();

  const matchesQuery = React.useCallback(
    (item: { name?: string; description?: string }) => {
      if (!normalizedQuery) return true;

      const name = (item.name ?? '').toLowerCase();
      const description = (item.description ?? '').toLowerCase();

      return name.includes(normalizedQuery) || description.includes(normalizedQuery);
    },
    [normalizedQuery]
  );

  if (variant === 'restaurant') {
    const { isPending, error, items } = useRestaurantItemsWithFilters({
      carouselItemSource,
      filters,
    });

    if (isPending) {
      return (
        <div className="flex justify-center px-14">
          <LoadingCarousel />
        </div>
      );
    }

    if (error) {
      return <ErrorState message={t('overview.loadingRestaurantsError')} />;
    }

    return (
      <SectionCarousel
        items={items.filter(matchesQuery)}
        variant="restaurant"
      />
    );
  }

  const { isPending, error, data } = carouselItemSource();

  if (isPending) {
    return (
      <div className="flex justify-center px-14">
        <LoadingCarousel />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState message={t('overview.loadingVendingMachinesError')} />;
  }

  const items = Array.isArray(data) ? data : [];
  return (
    <SectionCarousel
      items={items.filter(matchesQuery)}
      variant="vending"
    />
  );
}

function LoadingCarousel() {
  const placeholders = Array.from({ length: 3 });

  return (
    <Carousel
      className="w-full max-w-[227px]"
      opts={{ align: 'start', loop: true }}
    >
      <CarouselContent>
        {placeholders.map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1 flex justify-center">
              <SectionSkeleton />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex justify-center px-14">
      <div className="w-[227px] rounded-2xl bg-[#1B1B1B] text-white px-4 py-3 text-center text-[10px]">
        {message}
      </div>
    </div>
  );
}
