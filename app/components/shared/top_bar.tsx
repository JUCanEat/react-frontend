// contains the logo, the name and the "Log in" button.
import { Button } from "~/shadcn/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "~/shadcn/components/ui/item";
import { useKeycloak } from "@react-keycloak/web";

export function TopBar({ isLoginPage }: { isLoginPage: boolean }) {
    const { keycloak, initialized } = useKeycloak();
    const itemClassName = isLoginPage ? "justify-center" : "justify-between";

    const handleLogin = () => {
        if (!initialized) return;
        keycloak.login({
            redirectUri: window.location.origin + "/profile",
        });
    };

    const handleLogout = () => {
        keycloak.logout({
            redirectUri: window.location.origin + "/",
        });
    };

    return (
    <div className="flex w-full flex-row">
      <Item variant="outline" size="xsm" width="default" className={itemClassName}>
          <div className="flex items-center gap-1.5">
              <ItemMedia variant="logo" onClick={() => (window.location.href = "/")}>
                  <img src="/logo.svg"></img>
              </ItemMedia>
              <ItemContent className={"hidden 3xs:block"}>
                  <ItemTitle>JU Can Eat</ItemTitle>
              </ItemContent>
          </div>
          <ItemActions>
              {!isLoginPage && (
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = "/login")}
                  >
                      Login
                  </Button>
              )}
        </ItemActions>
      </Item>
    </div>
  )
}

