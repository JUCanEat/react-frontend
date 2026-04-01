import { Map_proper } from '~/components/map/map_proper';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { SearchBar } from '~/components/overview/search_bar';
import { useState } from 'react';

export function MapComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-screen w-full dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div className="flex-1 relative">
        <Map_proper searchQuery={searchQuery} />
        <div className="absolute top-3 left-3 right-3 z-10">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            className="!bg-white dark:!bg-black border-gray-300 dark:border-zinc-700 shadow-md"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <BottomNav page={'map'}></BottomNav>
        </div>
      </div>
    </div>
  );
}
