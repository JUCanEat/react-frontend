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
    <div className="flex w-full max-w-full flex-col gap-6">
      <Item variant="outline" size="xsm" width="default" className={itemClassName}>
          <div className="flex items-center gap-2">
              <ItemMedia
                  variant="logo"
                  onClick={() => (window.location.href = "/")}
              >
                  <img src="/logo.svg"></img>
                </ItemMedia>
                <ItemContent>
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
