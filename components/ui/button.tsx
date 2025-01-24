import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Neobrutalist button styling with thick borders, chunky shadow,
 * and your Tailwind primary color (#FF6B00).
 */
const buttonVariants = cva(
  [
    // Base shared styles
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    // Icon styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
    // Neobrutalist border + shadow
    "border-[5px] border-black shadow-100 rounded-[20px]",
  ],
  {
    variants: {
      variant: {
        // === DEFAULT ===
        default: cn(
          // Primary background, white text
          "bg-primary text-white hover:bg-primary/90"
        ),

        // === DESTRUCTIVE ===
        destructive: cn(
          // Red or a different color if you prefer
          "bg-red-600 text-white hover:bg-red-600/90"
        ),

        // === OUTLINE ===
        outline: cn(
          // White background, black text
          "bg-white text-black hover:bg-black hover:text-white"
        ),

        // === SECONDARY ===
        secondary: cn(
          // Lighter primary background, black text
          "bg-primary-100 text-black hover:bg-primary hover:text-white"
        ),

        // === GHOST ===
        ghost: cn(
          // Transparent, becomes primary on hover
          "bg-transparent hover:bg-primary hover:text-white"
        ),

        // === LINK ===
        link: cn(
          // Minimal styling for inline or textual links
          "border-none bg-transparent text-primary underline-offset-4 hover:underline"
        ),
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
