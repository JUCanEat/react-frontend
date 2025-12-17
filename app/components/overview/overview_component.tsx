import { FilterBar } from "~/components/overview/filter_bar"
import { TopBar } from "~/components/shared/top_bar"
import { SearchBar } from "~/components/overview/search_bar"
import { ServiceSectionStripe } from "~/components/overview/service_section_stripe"
import { ServiceSection } from "~/components/overview/service_section/service_section"
import { BottomNav } from "~/components/shared/bottom_nav"

import { useGetAllRestaurants } from "~/api/restaurant_service"
import { useGetAllVendingMachines } from "~/api/vending_machine_service"
import * as React from "react"
import type { FilterValue } from "~/components/overview/filter_bar"

export function OverviewComponent() {
    const [filters, setFilters] = React.useState<FilterValue[]>([])

    return (
        <>
            <TopBar isLoginPage={false} />
            <div className="w-full" style={{ height: "calc(100vh - 150px)" }}>
                <SearchBar />

                <FilterBar value={filters} onChange={setFilters} />

                <ServiceSectionStripe stripeTitle={"Restaurants"} />
                <ServiceSection
                    carouselItemSource={useGetAllRestaurants}
                    variant="restaurant"
                    filters={filters}
                />

                <ServiceSectionStripe stripeTitle={"Vending Machines"} />
                <ServiceSection
                    carouselItemSource={useGetAllVendingMachines}
                    variant="vending"
                />
            </div>
            <BottomNav />
        </>
    )
}
