import { useEffect, useRef } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { keycloak, initialized } = useKeycloak();
  const { t, i18n } = useTranslation();
  const loginTriggered = useRef(false);

  useEffect(() => {
    if (!initialized) return;

    if (!keycloak.authenticated && !loginTriggered.current) {
      loginTriggered.current = true;
      const loginLocale = i18n.language.startsWith('pl') ? 'pl' : 'en';
      keycloak.login({ locale: loginLocale });
    }
  }, [initialized, keycloak, i18n.language]);

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        {t('auth.loading')}
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        {t('auth.redirectingToLogin')}
      </div>
    );
  }

  return <>{children}</>;
}
