<<<<<<< HEAD
import { TopBar } from "~/components/shared/top_bar"
import { BottomNav } from "~/components/shared/bottom_nav"
import ProfileComponent from "~/components/profile/profile_component";
=======
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useKeycloak } from "@react-keycloak/web";
import ProfileComponent from "~/profile/profile";
>>>>>>> 21f9d6a35b32dc75e64590f880d5c34a571c2446

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
