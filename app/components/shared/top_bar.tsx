// contains the logo, the name and the "Log in" button.
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "~/shadcn/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/shadcn/components/ui/item"

export function TopBar({isLoginPage}: {isLoginPage: boolean}) {
  var itemClassName: string = isLoginPage ? "justify-center" : "justify-between"
    return (
    <div className="flex w-full flex-row">
      <Item variant="outline" size="xsm" width="default" className={`itemClassName`}>
          <div></div>
          <div className="flex items-center">
              <ItemMedia variant="logo" className={"scale-120 dark:invert"} onClick={() => (window.location.href = "/")}>
                  <img src="/logo.svg"></img>
              </ItemMedia>
              <ItemContent className={"hidden 3xs:block"}>
                  <div></div>
                  <ItemTitle className={"text-base pt-2"}>JU Can Eat</ItemTitle>
                  <div></div>
              </ItemContent>
          </div>
          <ItemActions>
              {!isLoginPage && (
                  <Button
                      variant="highlight"
                      border="none"
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
