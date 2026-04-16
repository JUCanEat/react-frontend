import { RequireAuth } from '~/auth/RequireAuth';
import { PublishedMenuPanel } from '~/components/staff/menu/manual_menu/published_menu_panel';
import { useKeycloak } from '@react-keycloak/web';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function StaffPublishedMenuRoute() {
  return (
    <RequireAuth>
      <StaffPublishedMenuInner />
    </RequireAuth>
  );
}

function StaffPublishedMenuInner() {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  if (!roles.includes('restaurant_owner')) {
    return <div className="p-6 text-white">{t('auth.accessDenied')}</div>;
  }

  if (!restaurantId) {
    return <div className="p-6 text-white">{t('auth.restaurantIdMissing')}</div>;
  }

  return <PublishedMenuPanel restaurantId={restaurantId} />;
}
