import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '~/lib/app_routes';

export default function ProfileComponent() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!initialized) {
    return (
      <div className="relative min-h-screen bg-transparent dark:bg-transparent">
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
      <div className="flex flex-col h-screen w-full bg-transparent dark:bg-transparent">
        <TopBar isLoginPage={false} />
        <div className="flex-1 overflow-y-auto pb-28 md:pb-16">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 pt-0 pb-6 lg:pt-1 lg:pb-8 space-y-4">
            <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 shadow-sm p-4 sm:p-5">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('profile.pageTitle')}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                {t('profile.pageSubtitleSignedOut')}
              </p>
            </section>

            <div className="flex flex-col items-center justify-center gap-4 px-2 sm:px-6">
              <button
                className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#009DE0' }}
                onClick={() => keycloak.login({ redirectUri: window.location.origin + '/profile' })}
              >
                {t('profile.logIn')}
              </button>
              <button
                className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white bg-[#1B1B1B]"
                onClick={() =>
                  keycloak.register({ redirectUri: window.location.origin + '/profile' })
                }
              >
                {t('profile.signUp')}
              </button>
            </div>
          </div>
        </div>
        <BottomNav page={'profile'} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-transparent dark:bg-transparent">
      <TopBar isLoginPage={false} />
      <div className="flex-1 overflow-y-auto pb-28 md:pb-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 pt-0 pb-6 lg:pt-1 lg:pb-8 space-y-4">
          <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 shadow-sm p-4 sm:p-5">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('profile.pageTitle')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              {t('profile.pageSubtitleSignedIn')}
            </p>
          </section>

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-8 w-full max-w-sm px-2 sm:px-6">
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

              <div className="w-full border-t border-gray-300 dark:border-zinc-500 dark:opacity-70" />

              <div className="flex flex-col items-center gap-1">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: '#009DE0' }}
                >
                  {t('profile.usernameLabel')}
                </p>
                <p className="text-lg text-gray-800 dark:text-white">@{token.preferred_username}</p>
              </div>

              <div className="w-full border-t border-gray-300 dark:border-zinc-500 dark:opacity-70" />

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
                  onClick={() => navigate(appRoutes.staffManager)}
                >
                  {t('profile.openManagerPanel')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav page={'profile'} />
    </div>
  );
}
