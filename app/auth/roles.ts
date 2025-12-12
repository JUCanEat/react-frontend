
type KeycloakTokenPayload = {
    realm_access?: {
        roles?: string[];
    };
};

function decodeJwtPayload(token: string): KeycloakTokenPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const payloadBase64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const json = atob(payloadBase64);
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
    }
}

export function tokenHasRestaurantOwnerRole(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload) return false;

    const roles = payload.realm_access?.roles ?? [];
    return roles.includes("restaurant_owner");
}
