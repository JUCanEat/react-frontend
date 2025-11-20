import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "~/shadcn/components/ui/item"

import { FilterBar } from "~/components/overview/filter_bar"
import { TopBar } from "~/components/overview/top_bar"
import { SearchBar } from "~/components/overview/search_bar"
import { ServiceSectionStripe } from "~/components/overview/service_section_stripe"
import { ServiceSection } from "~/components/overview/service_section"
import { BottomNav } from "~/components/overview/bottom_nav"

import jcaLogo from "~/assets/logo.svg"

export function OverviewComponent() {
  return (
    <>
      <TopBar></TopBar>
      <div className = "w-full" style={{ height: "calc(100vh - 150px)"}}>
          <SearchBar></SearchBar>
          <FilterBar></FilterBar>
          <ServiceSectionStripe></ServiceSectionStripe>
          <ServiceSection></ServiceSection>
      </div>
      <BottomNav />
    </>
  );
}