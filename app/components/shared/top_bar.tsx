// contains the logo, the name and the "Log in" button.
import { Button } from '~/shadcn/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '~/shadcn/components/ui/item';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

export function TopBar({ isLoginPage }: { isLoginPage: boolean }) {
  const { keycloak, initialized } = useKeycloak();
  const { t, i18n } = useTranslation();
  const itemClassName = isLoginPage ? 'justify-center' : 'justify-between';

  const handleLogin = () => {
    if (!initialized) return;

    const loginLocale = i18n.language.startsWith('pl') ? 'pl' : 'en';
    keycloak.login({
      redirectUri: window.location.origin + '/profile',
      locale: loginLocale,
    });
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/',
    });
  };

  const switchLanguage = (language: 'en' | 'pl') => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  };

  return (
    <div className="flex w-full max-w-full flex-col gap-6">
      <Item
        variant="outline"
        border="no_outline"
        size="xsm"
        width="default"
        className={itemClassName}
      >
        <div className="flex items-center gap-2">
          <ItemMedia
            variant="logo"
            onClick={() => (window.location.href = '/')}
          >
            <img
              className={'dark:invert'}
              src="/logo.svg"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>JU Can Eat</ItemTitle>
          </ItemContent>
        </div>

        <ItemActions>
          {!isLoginPage && (
            <div className="flex items-center gap-1 mr-2">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {t('topBar.languageLabel')}:
              </span>
              <Button
                size="xsm"
                variant={i18n.language.startsWith('en') ? 'default' : 'outline'}
                onClick={() => switchLanguage('en')}
              >
                EN
              </Button>
              <Button
                size="xsm"
                variant={i18n.language.startsWith('pl') ? 'default' : 'outline'}
                onClick={() => switchLanguage('pl')}
              >
                PL
              </Button>
            </div>
          )}

          {!isLoginPage && initialized && !keycloak.authenticated && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogin}
            >
              {t('topBar.login')}
            </Button>
          )}

          {!isLoginPage && initialized && keycloak.authenticated && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
            >
              {t('topBar.logout')}
            </Button>
          )}
        </ItemActions>
      </Item>
    </div>
  );
}
