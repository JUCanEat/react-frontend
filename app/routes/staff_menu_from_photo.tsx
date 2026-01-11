import { RequireAuth } from "~/auth/RequireAuth";
import { StaffMenuFromPhotoComponent } from "~/staff/menu_from_photo";
import { useKeycloak } from "@react-keycloak/web";

export default function StaffMenuFromPhotoRoute() {
    return (
        <RequireAuth>
            <StaffMenuFromPhotoInner />
        </RequireAuth>
    );
}

function StaffMenuFromPhotoInner() {
    const { keycloak } = useKeycloak();
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];

    if (!roles.includes("restaurant_owner")) {
        return (
            <div className="p-6 text-white">
                Brak dostępu
            </div>
        );
    }

    return <StaffMenuFromPhotoComponent />;
}
