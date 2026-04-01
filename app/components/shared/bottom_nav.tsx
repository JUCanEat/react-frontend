import { ItemActions } from '~/shadcn/components/ui/item';
import { Button } from '~/shadcn/components/ui/button';
import { Home, Map, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BottomNav({ page }: { page?: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-center">
      <nav className="flex items-center gap-8 p-3 mb-10 rounded-xl bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-zinc-800">
        <Button
          variant={page === 'overview' ? 'highlight' : 'ghost'}
          border="none"
          aria-label={t('nav.home')}
          onClick={() => (window.location.href = '/')}
        >
          <Home className="" />
        </Button>
        <Button
          variant={page === 'map' ? 'highlight' : 'ghost'}
          border="none"
          aria-label={t('nav.map')}
          onClick={() => (window.location.href = '/map')}
        >
          <Map className="" />
        </Button>
        <Button
          variant={page === 'profile' ? 'highlight' : 'ghost'}
          border="none"
          aria-label={t('nav.profile')}
          onClick={() => (window.location.href = '/profile')}
        >
          <User className="" />
        </Button>
      </nav>
    </div>
  );
}
