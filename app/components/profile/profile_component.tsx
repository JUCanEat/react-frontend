import { TopBar } from "~/components/shared/top_bar";
import { BottomNav } from "~/components/shared/bottom_nav";
import { useKeycloak } from "@react-keycloak/web";

export default function ProfileComponent() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return (
            <>
                <TopBar isLoginPage={false} />
                <div
                    className="w-full flex items-center justify-center bg-white dark:bg-zinc-950"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">Loading profile…</p>
                </div>
                <BottomNav />
            </>
        );
    }

    const token = keycloak.tokenParsed;

    if (!token) {
        return (
            <>
                <TopBar isLoginPage={false} />
                <div
                    className="w-full flex items-center justify-center bg-white dark:bg-zinc-950"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
                        You are not logged in
                    </p>
                </div>
                <BottomNav />
            </>
        );
    }

    return (
        <>
            <TopBar isLoginPage={false} />
            <div
                className="w-full flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-950"
                style={{ height: "calc(100vh - 150px)" }}
            >
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {token.given_name} {token.family_name}
                </p>
                <p className="text-sm opacity-80 text-gray-800 dark:text-gray-300">
                    {token.email}
                </p>
                <p className="text-sm opacity-60 text-gray-700 dark:text-gray-400">
                    @{token.preferred_username}
                </p>
            </div>
            <BottomNav />
        </>
    );
}
