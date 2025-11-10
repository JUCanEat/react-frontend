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
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline" size="xsm" width="default">
        <ItemMedia variant="logo">
          <img src="/logo.svg"></img>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>JU Can Eat</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Login
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
