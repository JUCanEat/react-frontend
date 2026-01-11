import { Map_proper } from "~/components/map/map_proper"
import { TopBar } from "~/components/shared/top_bar";
import { BottomNav } from "~/components/shared/bottom_nav"

export function MapComponent() {
  return (
    <div className="flex flex-col h-screen w-full">
        <TopBar isLoginPage={false}></TopBar>
      <div className="flex-1">
        <Map_proper />
        <BottomNav page={"map"}></BottomNav>
      </div>
    </div>
  );
}
