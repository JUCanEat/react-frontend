import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

export default function ProfileComponent() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();

  if (!initialized) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('profile.loadingProfile')}
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const token = keycloak.tokenParsed;
  const roles = token?.realm_access?.roles || [];
  const isOwner = roles.includes('restaurant_owner');

  if (!token) {
    return (
      <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-950">
        <TopBar isLoginPage={false} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('profile.yourProfile')}
          </p>
          <p className="text-sm text-gray-600 dark:text-white dark:opacity-50 mb-4">
            {t('profile.loginOrCreateToContinue')}
          </p>
          <button
            className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#009DE0' }}
            onClick={() => keycloak.login({ redirectUri: window.location.origin + '/profile' })}
          >
            {t('profile.logIn')}
          </button>
          <button
            className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white bg-[#1B1B1B]"
            onClick={() => keycloak.register({ redirectUri: window.location.origin + '/profile' })}
          >
            {t('profile.signUp')}
          </button>
        </div>
        <BottomNav page={'profile'} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-950">
      <TopBar isLoginPage={false} />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
          <div className="flex flex-col items-center gap-1">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: '#009DE0' }}
            >
              {t('profile.nameLabel')}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {token.given_name} {token.family_name}
            </p>
          </div>

          <div className="w-full border-t border-gray-300 dark:border-white dark:opacity-10" />

          <div className="flex flex-col items-center gap-1">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: '#009DE0' }}
            >
              {t('profile.usernameLabel')}
            </p>
            <p className="text-lg text-gray-800 dark:text-white">@{token.preferred_username}</p>
          </div>

          <div className="w-full border-t border-gray-300 dark:border-white dark:opacity-10" />

          <div className="flex flex-col items-center gap-1">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: '#009DE0' }}
            >
              {t('profile.emailLabel')}
            </p>
            <p className="text-lg text-gray-800 dark:text-white">{token.email}</p>
          </div>

          {isOwner && (
            <button
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#009DE0' }}
              onClick={() => (window.location.href = '/staff/manager')}
            >
              {t('profile.openManagerPanel')}
            </button>
          )}
        </div>
      </div>
      <BottomNav page={'profile'} />
    </div>
  );
}
