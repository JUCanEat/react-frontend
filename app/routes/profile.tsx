import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import ProfileComponent from "~/components/profile/profile_component";
export default function ProfileRoute() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialized) return;

        const roles = keycloak.tokenParsed?.realm_access?.roles || [];

        if (keycloak.authenticated && roles.includes("restaurant_owner")) {
            navigate("/staff/menu-from-photo", { replace: true });
        }
    }, [initialized, keycloak.authenticated]);

    return <ProfileComponent />;
}
