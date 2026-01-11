import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/shadcn/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-gray-950 focus-visible:ring-gray-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-gray-300 dark:focus-visible:ring-gray-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-gray-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-50/90",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60 dark:bg-red-900 dark:hover:bg-red-900/90 dark:focus-visible:ring-red-900/20 dark:dark:focus-visible:ring-red-900/40 dark:dark:bg-red-900/60",
        outline:
          "bg-white shadow-xs hover:bg-zinc-100 hover:text-gray-900 dark:bg-zinc-200/30 dark:hover:bg-zinc-200/50 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-gray-50 dark:dark:bg-zinc-800/30 dark:dark:hover:bg-zinc-800/50",
        highlight:
          "bg-white shadow-xs hover:bg-zinc-100 hover:text-gray-900 dark:bg-zinc-200/30 dark:text-martynablue dark:hover:bg-zinc-200/50 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-gray-50 dark:dark:bg-zinc-800/30 dark:dark:hover:bg-zinc-800/50",
        secondary:
          "bg-zinc-100 text-gray-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-gray-50 dark:hover:bg-zinc-800/80",
        ghost:
          "dark:text-zinc-50 hover:bg-zinc-100 hover:text-gray-900 dark:hover:bg-zinc-100/50 dark:hover:bg-zinc-800 dark:hover:text-gray-50 dark:dark:hover:bg-zinc-800/50",
        link: "text-gray-900 underline-offset-4 hover:underline dark:text-gray-50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        xsm: "h-6 rounded-md gap-1.5 px-2 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      border: {
          outline: "border dark:border-gray-200 dark:dark:border-gray-800",
          none: "border-none"
      },
      rounded: {
          default: "rounded-0",
          rounded: "rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "outline",
      rounded: "default"
    },
  }
)

function Button({
  className,
  variant,
  border,
  size,
  rounded,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, border, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
