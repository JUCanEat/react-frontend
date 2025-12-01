import { FilterBar } from "~/components/overview/filter_bar"
import { TopBar } from "~/components/overview/top_bar"
import { SearchBar } from "~/components/overview/search_bar"
import { ServiceSectionStripe } from "~/components/overview/service_section_stripe"
import { ServiceSection } from "~/components/overview/service_section"
import { BottomNav } from "~/components/overview/bottom_nav"

export function OverviewComponent() {
  return (
    <>
      <TopBar isLoginPage={false}></TopBar>
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