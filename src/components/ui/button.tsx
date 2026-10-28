import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 hover:shadow-emerald-900/30",
        secondary:
          "bg-emerald-950/40 text-emerald-100 border border-emerald-800/50 hover:bg-emerald-900/60 hover:border-emerald-600/60 backdrop-blur-md",
        outline:
          "border border-emerald-700/60 bg-transparent text-emerald-200 hover:bg-emerald-900/20 hover:text-white",
        ghost:
          "text-emerald-300 hover:bg-emerald-900/30 hover:text-white",
        lux:
          "bg-linear-to-r from-amber-400 via-amber-300 to-yellow-500 text-emerald-950 font-semibold shadow-lg shadow-amber-900/20 hover:brightness-110",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-13 rounded-full px-8 text-base tracking-wide",
        icon: "h-10 w-10 p-0",
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
