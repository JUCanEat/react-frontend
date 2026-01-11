import { useEffect, useRef } from "react";
import { useKeycloak } from "@react-keycloak/web";

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { keycloak, initialized } = useKeycloak();
    const loginTriggered = useRef(false);

    useEffect(() => {
        if (!initialized) return;

        if (!keycloak.authenticated && !loginTriggered.current) {
            loginTriggered.current = true;
            keycloak.login();
        }
    }, [initialized, keycloak]);

    if (!initialized) {
        return (
            <div className="h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if (!keycloak.authenticated) {
        return (
            <div className="h-screen flex items-center justify-center text-white">
                Redirecting to login...
            </div>
        );
    }

    return <>{children}</>;
}
