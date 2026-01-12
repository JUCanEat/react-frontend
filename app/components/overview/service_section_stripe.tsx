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

export function ServiceSectionStripe({stripeTitle} : {stripeTitle: string}) {
  return (
    <div className="flex w-full max-w-full flex-col gap-2">
      <Item variant="outline" border="none" size="xsm" rounded="rounded">
        <ItemContent className={"dark:text-jcablue"}>
          <ItemTitle>{stripeTitle}</ItemTitle>
        </ItemContent>
        <ItemActions>
          {/* deprecated */}
          {/*<Button variant="outline" size="xsm">*/}
          {/*  See All*/}
          {/*</Button>*/}
        </ItemActions>
      </Item>
    </div>
  )
}
