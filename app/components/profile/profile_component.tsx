import { TopBar } from "~/components/shared/top_bar";
import { BottomNav } from "~/components/shared/bottom_nav";
import { useKeycloak } from "@react-keycloak/web";

export default function ProfileComponent() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return (
            <div className="relative min-h-screen bg-white dark:bg-zinc-950">
                <TopBar isLoginPage={false} />
                <div className="w-full flex items-center justify-center" style={{ height: "calc(100vh - 150px)" }}>
                    <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">Loading profile…</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    const token = keycloak.tokenParsed;

    if (!token) {
        return (
            <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-950">
                <TopBar isLoginPage={false} />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">Your Profile</p>
                    <p className="text-sm text-gray-600 dark:text-white dark:opacity-50 mb-4">Log in or create an account to continue</p>
                    <button
                        className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white"
                        style={{ backgroundColor: "#009DE0" }}
                        onClick={() => keycloak.login({ redirectUri: window.location.origin + "/profile" })}
                    >
                        Log in
                    </button>
                    <button
                        className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white bg-[#1B1B1B]"
                        onClick={() => keycloak.register({ redirectUri: window.location.origin + "/profile" })}
                    >
                        Sign up
                    </button>
                </div>
                <BottomNav page={"profile"} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-950">
            <TopBar isLoginPage={false} />
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#009DE0" }}>Name</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{token.given_name} {token.family_name}</p>
                    </div>

                    <div className="w-full border-t border-gray-300 dark:border-white dark:opacity-10" />

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#009DE0" }}>Username</p>
                        <p className="text-lg text-gray-800 dark:text-white">@{token.preferred_username}</p>
                    </div>

                    <div className="w-full border-t border-gray-300 dark:border-white dark:opacity-10" />

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#009DE0" }}>Email</p>
                        <p className="text-lg text-gray-800 dark:text-white">{token.email}</p>
                    </div>

                </div>
            </div>
            <BottomNav page={"profile"} />
        </div>
    );
}
