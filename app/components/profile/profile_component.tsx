import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

export default function ProfileComponent() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();

  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('profile.loadingProfile')}
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const token = keycloak.tokenParsed;

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('profile.notLoggedIn')}
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {token.given_name} {token.family_name}
        </p>
        <p className="text-sm opacity-80 text-gray-800 dark:text-gray-300">{token.email}</p>
        <p className="text-sm opacity-60 text-gray-700 dark:text-gray-400">
          @{token.preferred_username}
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
