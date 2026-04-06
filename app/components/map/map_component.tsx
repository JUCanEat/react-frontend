import { Map_proper } from '~/components/map/map_proper';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { SearchBar } from '~/components/overview/search_bar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function MapComponent() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-screen w-full dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div className="flex-1 relative">
        <Map_proper searchQuery={searchQuery} />
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-1">
            <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-4 sm:p-5">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('map.pageTitle')}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                {t('map.pageSubtitle')}
              </p>

              <div className="mt-2">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="!bg-white dark:!bg-black border-gray-300 dark:border-zinc-700 shadow-sm"
                />
              </div>
            </section>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <BottomNav page={'map'}></BottomNav>
        </div>
      </div>
    </div>
  );
}
