/**
 The main page filtering filters the restaurants by whether they serve gluter-free/vegen/vegetarian/lactose-free dishes today.
 */

import { FilterBar } from '~/components/overview/filter_bar';
import { TopBar } from '~/components/shared/top_bar';
import { SearchBar } from '~/components/overview/search_bar';
import { ServiceSectionStripe } from '~/components/overview/service_section_stripe';
import { ServiceSection } from '~/components/overview/service_section/service_section';
import { BottomNav } from '~/components/shared/bottom_nav';

import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';
import * as React from 'react';
import type { FilterValue } from '~/components/overview/filter_bar';

import { useTranslation } from 'react-i18next';
export function OverviewComponent() {
  const [filters, setFilters] = React.useState<FilterValue[]>([]);
  const { t } = useTranslation();
  return (
    <div className={'flex justify-center dark:bg-zinc-950 min-h-screen overflow-hidden'}>
      <div className={'dark:bg-zinc-950 max-w-3xl w-full flex flex-col'}>
        <TopBar isLoginPage={false} />
        <div className={'pt-5 pl-5 pr-5 dark:bg-zinc-950 flex-1 flex flex-col'}>
          <div className="flex-1">
            <div className={'pt-5'}>
              <ServiceSectionStripe stripeTitle={t('overview.restaurants')} />
              <ServiceSection
                carouselItemSource={useGetAllRestaurants}
                variant="restaurant"
                filters={filters}
              />
            </div>

            <div className={'pt-5'}>
              <ServiceSectionStripe stripeTitle={t('overview.vendingMachines')} />
              <ServiceSection
                carouselItemSource={useGetAllVendingMachines}
                variant="vending"
              />
            </div>
          </div>
          <BottomNav page={'overview'}></BottomNav>
        </div>
      </div>
    </div>
  );
}
