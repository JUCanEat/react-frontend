import { Map } from "~/components/map/map"
import { TopBar } from "~/components/overview/top_bar";

export function MapComponent() {
  return (
    <div className="flex flex-col h-screen w-full">
      <TopBar />
      <div className="flex-1">
        <Map />
      </div>
    </div>
  );
}
