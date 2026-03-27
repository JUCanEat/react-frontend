import { useKeycloak } from '@react-keycloak/web';
import { Button } from '~/shadcn/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function LoginRoute() {
  const { keycloak } = useKeycloak();
  const { t, i18n } = useTranslation();

  const loginLocale = i18n.language.startsWith('pl') ? 'pl' : 'en';

  return (
    <div className="h-screen flex items-center justify-center">
      <Button
        size="lg"
        onClick={() =>
          keycloak.login({
            redirectUri: window.location.origin + '/profile',
            locale: loginLocale,
          })
        }
      >
        {t('login.logIn')}
      </Button>
    </div>
  );
}
