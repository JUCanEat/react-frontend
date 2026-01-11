import { useKeycloak } from "@react-keycloak/web";
import { Button } from "~/shadcn/components/ui/button";

export default function LoginRoute() {
    const { keycloak } = useKeycloak();

    return (
        <div className="h-screen flex items-center justify-center">
            <Button
                size="lg"
                onClick={() =>
                    keycloak.login({
                        redirectUri: window.location.origin + "/profile",
                    })
                }
            >
                Log in
            </Button>
        </div>
    );
import { TopBar } from "~/components/shared/top_bar"
import { BottomNav } from "~/components/shared/bottom_nav"
import LoginComponent from "~/components/login/login_component";

export default function Login() {
    return <LoginComponent />
}
