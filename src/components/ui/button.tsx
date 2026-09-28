import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315BFF]/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#315BFF] text-white shadow-md shadow-blue-500/25 hover:bg-[#254BE3] hover:shadow-blue-500/35 font-bold",
        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700 font-semibold",
        outline:
          "border border-[#E5EAF2] bg-white text-[#172033] shadow-2xs hover:bg-slate-50 hover:border-slate-300 font-semibold",
        secondary:
          "bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] hover:bg-blue-100/70 font-bold",
        ghost:
          "hover:bg-slate-100 hover:text-[#172033] text-slate-600 font-medium",
        link:
          "text-[#315BFF] underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs font-bold rounded-xl",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-11 px-7 text-sm font-bold rounded-xl",
        pill: "h-9 px-5 text-xs font-bold rounded-full",
        pillLg: "h-12 px-8 text-sm sm:text-base font-bold rounded-full",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
