// contains the logo, the name and the "Log in" button.
import { Button } from '~/shadcn/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '~/shadcn/components/ui/item';
import { Popover, PopoverContent, PopoverTrigger } from '~/shadcn/components/ui/popover';
import { Slider } from '~/shadcn/components/ui/slider';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '~/lib/app_routes';
import { useState, useEffect } from 'react';
import { Contrast } from 'lucide-react';

export function TopBar({ isLoginPage }: { isLoginPage: boolean }) {
  const { keycloak, initialized } = useKeycloak();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const itemClassName = isLoginPage ? 'justify-center' : 'justify-between';

  const [contrast, setContrast] = useState(() => {
    return Number(localStorage.getItem('jucaneat-contrast') ?? 1);
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.filter = contrast > 1 ? `contrast(${contrast})` : '';
    root.classList.toggle('high-contrast', contrast > 1);
    localStorage.setItem('jucaneat-contrast', String(contrast));
  }, [contrast]);

  const handleLogin = () => {
    if (!initialized) return;

    const loginLocale = i18n.language.startsWith('pl') ? 'pl' : 'en';
    keycloak.login({
      redirectUri: window.location.origin + appRoutes.profile,
      locale: loginLocale,
    });
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + appRoutes.home,
    });
  };

  const switchLanguage = (language: 'en' | 'pl') => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  };

  return (
    <div className="flex w-full max-w-full flex-col gap-6 overflow-x-hidden">
      <Item
        variant="default"
        border="no_outline"
        size="xsm"
        width="default"
        className={`${itemClassName} flex-nowrap w-full max-w-full min-w-0 gap-2 overflow-hidden sm:gap-3 !bg-transparent text-gray-900 dark:!bg-transparent dark:text-zinc-50`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ItemMedia
            variant="logo"
            onClick={() => navigate(appRoutes.home)}
          >
            <img
              className={'dark:invert'}
              src="/logo.svg"
            />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="truncate">JU Can Eat</ItemTitle>
          </ItemContent>
        </div>

        <ItemActions className="ml-auto min-w-0 shrink-0 flex-nowrap justify-end gap-1 sm:gap-2">
          {!isLoginPage && (
            <div className="flex items-center gap-1">
              <span className="hidden text-xs text-gray-600 dark:text-gray-300 sm:inline">
                {t('topBar.languageLabel')}:
              </span>
              <Button
                size="xsm"
                variant={i18n.language.startsWith('en') ? 'default' : 'outline'}
                className={
                  i18n.language.startsWith('en')
                    ? 'border-gray-200 shadow-sm bg-black text-white hover:bg-black/90 hover:text-white dark:border-zinc-200 dark:bg-white dark:text-black dark:hover:bg-zinc-100'
                    : 'border-gray-200 shadow-sm bg-white text-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800'
                }
                onClick={() => switchLanguage('en')}
              >
                EN
              </Button>
              <Button
                size="xsm"
                variant={i18n.language.startsWith('pl') ? 'default' : 'outline'}
                className={
                  i18n.language.startsWith('pl')
                    ? 'border-gray-200 shadow-sm bg-black text-white hover:bg-black/90 hover:text-white dark:border-zinc-200 dark:bg-white dark:text-black dark:hover:bg-zinc-100'
                    : 'border-gray-200 shadow-sm bg-white text-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800'
                }
                onClick={() => switchLanguage('pl')}
              >
                PL
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="xsm"
                    variant={contrast > 1 ? 'default' : 'outline'}
                    className={
                      contrast > 1
                        ? 'border-gray-200 shadow-sm bg-black text-white hover:bg-black/90 hover:text-white dark:border-zinc-200 dark:bg-white dark:text-black dark:hover:bg-zinc-100'
                        : 'border-gray-200 shadow-sm bg-white text-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800'
                    }
                    aria-label={t('topBar.highContrast')}
                  >
                    <Contrast size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56"
                  align="end"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('topBar.highContrast')}</span>
                      {contrast > 1 && (
                        <button
                          onClick={() => setContrast(1)}
                          className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                          {t('topBar.contrastReset')}
                        </button>
                      )}
                    </div>
                    <Slider
                      min={1}
                      max={1.2}
                      step={0.05}
                      value={[contrast]}
                      onValueChange={([val]) => setContrast(val)}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{t('topBar.contrastNormal')}</span>
                      <span>{t('topBar.contrastHigh')}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {!isLoginPage && initialized && !keycloak.authenticated && (
            <Button
              size="sm"
              variant="outline"
              border="none"
              className="border border-gray-200 shadow-sm bg-white text-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              onClick={handleLogin}
            >
              {t('topBar.login')}
            </Button>
          )}

          {!isLoginPage && initialized && keycloak.authenticated && (
            <Button
              size="sm"
              variant="outline"
              border="none"
              className="border border-gray-200 shadow-sm bg-white text-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
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
