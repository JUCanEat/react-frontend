import { RequireAuth } from "~/auth/RequireAuth";
import { StaffMenuDraft } from "~/components/staff/menu/menu_draft";
import { useKeycloak } from "@react-keycloak/web";
import { useParams } from "react-router-dom";

export default function StaffMenuDraftRoute() {
    return (
        <RequireAuth>
            <StaffMenuDraftInner />
        </RequireAuth>
    );
}

function StaffMenuDraftInner() {
    const { keycloak } = useKeycloak();
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];

    if (!roles.includes("restaurant_owner")) {
        return (
            <div className="p-6 text-white">
                Access denied
            </div>
        );
    }

    if (!restaurantId) {
        return (
            <div className="p-6 text-white">
                Restaurant ID is missing
            </div>
        );
    }

    return <StaffMenuDraft restaurantId={restaurantId} />;
}