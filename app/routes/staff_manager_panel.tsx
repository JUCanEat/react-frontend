import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import RestaurantManagerPanel from '~/components/staff/restaurant_manager_panel';
import { RequireAuth } from '~/auth/RequireAuth';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';

export default function ManagerRoute() {
  return (
    <RequireAuth>
      <ManagerRouteInner />
    </RequireAuth>
  );
}

function ManagerRouteInner() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();

  if (!initialized) {
    return <div>{t('common.loading')}</div>;
  }

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isOwner = roles.includes('restaurant_owner');

  if (!isOwner) {
    return (
      <div className="relative min-h-screen bg-transparent dark:bg-transparent">
        <TopBar isLoginPage={false} />
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('auth.accessDenied')}
          </p>
        </div>
        <BottomNav page={'profile'} />
      </div>
    );
  }

  return <RestaurantManagerPanel />;
}
