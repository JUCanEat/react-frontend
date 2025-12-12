import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";

import { StaffMenuFromPhotoComponent } from "~/staff/menu_from_photo";

export default function StaffMenuFromPhotoRoute() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialized) return;

        if (!keycloak.authenticated) {
            navigate("/login", { replace: true });
            return;
        }

        const roles = keycloak.tokenParsed?.realm_access?.roles || [];

        if (!roles.includes("restaurant_owner")) {
            navigate("/", { replace: true });
        }
    }, [initialized, keycloak.authenticated, navigate]);

    if (!initialized) {
        return null;
    }

    return <StaffMenuFromPhotoComponent />;
}
