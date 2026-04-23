import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-50 text-brand-700 hover:bg-brand-100",
        secondary:
          "border-transparent bg-gray-50 text-gray-700 hover:bg-gray-100",
        destructive:
          "border-transparent bg-error-50 text-error-700 hover:bg-error-100",
        outline: "border-gray-200 text-gray-700 bg-white",
        success: "border-transparent bg-success-50 text-success-700 hover:bg-success-100",
        warning: "border-transparent bg-warning-50 text-warning-700 hover:bg-warning-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
