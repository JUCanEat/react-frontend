import { RequireAuth } from '~/auth/RequireAuth';
import { StaffMenuFromPhoto } from '~/components/staff/menu/menu_from_photo';
import { useKeycloak } from '@react-keycloak/web';
import { useParams } from 'react-router-dom';

export default function StaffMenuFromPhotoRoute() {
  return (
    <RequireAuth>
      <StaffMenuFromPhotoInner />
    </RequireAuth>
  );
}

function StaffMenuFromPhotoInner() {
  const { keycloak } = useKeycloak();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  if (!roles.includes('restaurant_owner')) {
    return <div className="p-6 text-white">Access denied</div>;
  }

  if (!restaurantId) {
    return <div className="p-6 text-white">Restaurant ID is missing</div>;
  }

  return <StaffMenuFromPhoto restaurantId={restaurantId} />;
}
