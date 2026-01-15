import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import ProfileComponent from "~/components/profile/profile_component";
import RestaurantOwnerProfile from "~/components/profile/restaurant_owner_profile";

export default function ProfileRoute() {
    const { keycloak, initialized } = useKeycloak();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (!initialized) return;

        const roles = keycloak.tokenParsed?.realm_access?.roles || [];
        setIsOwner(roles.includes("restaurant_owner"));
    }, [initialized, keycloak.tokenParsed]);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (isOwner) {
        return <RestaurantOwnerProfile />;
    }

    return <ProfileComponent />;
}