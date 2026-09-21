import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white shadow hover:bg-blue-700",
        secondary: "border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
        destructive: "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline: "text-zinc-950 border-zinc-300",
        // Priority custom variants
        low: "border-emerald-200 bg-emerald-50 text-emerald-700",
        medium: "border-amber-200 bg-amber-50 text-amber-700",
        high: "border-red-200 bg-red-50 text-red-700",
        // Status custom variants
        pending: "border-zinc-200 bg-zinc-100 text-zinc-700",
        in_progress: "border-blue-200 bg-blue-50 text-blue-700",
        completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
