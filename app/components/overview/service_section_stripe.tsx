// eg. contains "Restaurants" and "See All", ...
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

export function ServiceSectionStripe() {
  return (
    <div className="flex w-full max-w-full flex-col gap-2">
      <Item variant="outline" size="xsm">
        <ItemMedia>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Restaurants</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="xsm">
            See All
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
