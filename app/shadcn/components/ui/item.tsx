import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/shadcn/lib/utils"
import { Separator } from "~/shadcn/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex items-center border border-gray-200 border-transparent text-sm transition-colors [a]:hover:bg-gray-100/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-gray-950 focus-visible:ring-gray-950/50 focus-visible:ring-[3px] dark:border-gray-800 dark:[a]:hover:bg-gray-800/50 dark:focus-visible:border-gray-300 dark:focus-visible:ring-gray-300/50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "dark:bg-zinc-950 dark:text-zinc-50",
        muted: "bg-gray-100/50 dark:bg-gray-800/50",
      },
      size: {
        default: "p-4 gap-4",
        sm: "py-3 px-4 gap-2.5",
        xsm: "py-2 px-3 gap-2",
      },
      width: {
        default: "w-full max-w-full"
      },
      justify: {
          default: "justify-between"
      },
      rounded: {
          default: "rounded-0",
          rounded: "rounded-md"
      },
        border: {
            outline: "border dark:border-gray-200 dark:dark:border-gray-800",
            none: "border-none"
        },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
        justify: "default",
        width: "default",
        rounded: "default",
        border: "outline"
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  width = "default",
    rounded = "default",
    border = "outline",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, width, rounded, border, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 border border-gray-200 rounded-sm bg-gray-100 [&_svg:not([class*='size-'])]:size-4 dark:border-gray-800 dark:bg-gray-800",
        image:
          "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
        logo:
          "size-16 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-none flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex items-center gap-2 text-sm leading-snug font-medium",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-gray-500 line-clamp-2 text-sm leading-normal font-normal text-balance dark:text-gray-400",
        "[&>a:hover]:text-gray-900 [&>a]:underline [&>a]:underline-offset-4 dark:[&>a:hover]:text-gray-50",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
