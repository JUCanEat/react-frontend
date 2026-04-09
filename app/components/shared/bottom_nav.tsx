import { Button } from '~/shadcn/components/ui/button';
import { Home, Map, User, BriefcaseBusiness } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '~/lib/app_routes';

export function BottomNav({ page }: { page?: string }) {
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isOwner = roles.includes('restaurant_owner');

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex w-full justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <nav className="flex items-center gap-8 p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-zinc-800">
        <Button
          variant={page === 'overview' ? 'highlight' : 'ghost'}
          border="none"
          aria-label={t('nav.home')}
          onClick={() => navigate(appRoutes.home)}
        >
          <Home className="" />
        </Button>
        <Button
          variant={page === 'map' ? 'highlight' : 'ghost'}
          border="none"
          aria-label={t('nav.map')}
          onClick={() => navigate(appRoutes.map)}
        >
          <Map className="" />
        </Button>
        <Button
          variant={page === 'profile' ? 'highlight' : 'ghost'}
          border="none"
          aria-label={t('nav.profile')}
          onClick={() => navigate(appRoutes.profile)}
        >
          <User className="" />
        </Button>
        {isOwner && (
          <Button
            variant={page === 'manager' ? 'highlight' : 'ghost'}
            border="none"
            aria-label={t('nav.manager')}
            onClick={() => navigate(appRoutes.staffManager)}
          >
            <BriefcaseBusiness className="" />
          </Button>
        )}
      </nav>
    </div>
  );
}
