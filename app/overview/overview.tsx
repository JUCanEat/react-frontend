import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "~/shadcn/components/ui/navigation-menu"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "~/shadcn/components/ui/item"

import jcaLogo from "~/assets/logo.svg"

export function OverviewComponent() {
  return (
    <div className="min-h-screen">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <img src={jcaLogo} alt="Icon description" className="w-15 h-15" />
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink>Homepage</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
              <NavigationMenuLink>Login</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <main className="flex items-center justify-center pt-16 pb-4">
        <Item>
          <ItemMedia />
          <ItemContent>
            <ItemTitle>Dzisiaj serwujemy:</ItemTitle>
            <ItemDescription>Kotlet jarski</ItemDescription>
          </ItemContent>
          <ItemActions />
          <ItemHeader>Bistro4mat</ItemHeader>
          <ItemFooter>Gronostajowa 7 </ItemFooter>
        </Item>
      </main>
    </div>
  );
}