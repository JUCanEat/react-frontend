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

export function TopBar() {
  return (
    <div className="flex w-full max-w-full flex-col gap-6">
      <Item variant="outline" size="xsm" width="default" className="justify-between">
          <div className="flex items-center gap-2">
              <ItemMedia variant="logo">
                  <img src="/logo.svg"></img>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>JU Can Eat</ItemTitle>
                </ItemContent>
          </div>
          <ItemActions>
          <Button variant="outline" size="sm">
            Login
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
