import { useKeycloak } from '@react-keycloak/web';
import ProfileComponent from '~/components/profile/profile_component';
import { useTranslation } from 'react-i18next';

export default function ProfileRoute() {
  const { initialized } = useKeycloak();
  const { t } = useTranslation();

  if (!initialized) {
    return <div>{t('common.loading')}</div>;
  }

  return <ProfileComponent />;
}
