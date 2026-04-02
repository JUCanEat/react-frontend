import { Map_proper } from '~/components/map/map_proper';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';

export function MapComponent() {
  return (
    <div className="flex flex-col h-screen w-full dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div className="flex-1 relative">
        <Map_proper />
        <div className="absolute bottom-0 left-0 right-0">
          <BottomNav page={'map'}></BottomNav>
        </div>
      </div>
    </div>
  );
}
