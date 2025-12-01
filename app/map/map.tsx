import { Map } from "~/components/map/map"
import { TopBar } from "~/components/overview/top_bar";
import { BottomNav } from "~/components/overview/bottom_nav"

export function MapComponent() {
  return (
    <div className="flex flex-col h-screen w-full">
        <TopBar isLoginPage={false}></TopBar>
      <div className="flex-1">
        <Map />
        <BottomNav />
      </div>
    </div>
  );
}
