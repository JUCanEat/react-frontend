// contains the logo, the name and the "Log in" button.
import { Button } from '~/shadcn/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '~/shadcn/components/ui/item';
import { useKeycloak } from '@react-keycloak/web';

export function TopBar({ isLoginPage }: { isLoginPage: boolean }) {
  const { keycloak, initialized } = useKeycloak();
  const itemClassName = isLoginPage ? 'justify-center' : 'justify-between';

  const handleLogin = () => {
    if (!initialized) return;
    keycloak.login({
      redirectUri: window.location.origin + '/profile',
    });
  };

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/',
    });
  };

  return (
    <div className="flex w-full max-w-full flex-col gap-6">
      <Item
        variant="outline"
        size="xsm"
        width="default"
        className={itemClassName}
      >
        <div className="flex items-center gap-2">
          <ItemMedia
            variant="logo"
            onClick={() => (window.location.href = '/')}
          >
            <img src="/logo.svg" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>JU Can Eat</ItemTitle>
          </ItemContent>
        </div>

        <ItemActions>
          {!isLoginPage && initialized && !keycloak.authenticated && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}

          {!isLoginPage && initialized && keycloak.authenticated && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </ItemActions>
      </Item>
    </div>
  );
}
