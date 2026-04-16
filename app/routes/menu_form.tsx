import { TopBar } from '~/components/shared/top_bar';
import { DailyMenuForm } from '~/components/menu_form/menu_form';
import { useKeycloak } from '@react-keycloak/web';
import { useParams } from 'react-router';
import { Alert, AlertDescription, AlertTitle } from '~/shadcn/components/ui/alert';
import { useTranslation } from 'react-i18next';

export default function DailyMenuPage() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();
  const token = keycloak?.token;
  const userId = keycloak?.tokenParsed?.sub;
  const { restaurantId } = useParams<{ restaurantId: string }>();

  if (!initialized) {
    return (
      <div className="dark:bg-transparent">
        <TopBar isLoginPage={false}></TopBar>
        <div
          className="w-full flex items-center justify-center dark:bg-transparent"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {t('menuForm.loadingAuthentication')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!keycloak.token) {
    return (
      <div className="dark:bg-transparent">
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4 dark:bg-transparent">
          <Alert variant="destructive">
            <AlertTitle>{t('menuForm.authenticationRequired')}</AlertTitle>
            <AlertDescription>{t('menuForm.pleaseLoginToAddMenu')}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="dark:bg-transparent">
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4 dark:bg-transparent">
          <Alert variant="destructive">
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>{t('menuForm.noRestaurantSpecified')}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-transparent">
      <TopBar isLoginPage={false}></TopBar>
      <div
        className="w-full dark:bg-transparent"
        style={{ height: 'calc(100vh - 150px)' }}
      >
        <DailyMenuForm
          restaurantId={restaurantId}
          userId={userId || ''}
          token={keycloak.token}
        ></DailyMenuForm>
      </div>
    </div>
  );
}
