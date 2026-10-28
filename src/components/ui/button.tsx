import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d3d2e] disabled:pointer-events-none disabled:opacity-50 active:scale-98 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#2d3d2e] text-white shadow-xs hover:bg-[#3d533e]",
        secondary:
          "bg-[#f0ebe1] text-[#1a2218] border border-black/10 hover:bg-[#e7e1d5]",
        outline:
          "border border-black/15 bg-transparent text-[#1a2218] hover:bg-black/5",
        ghost:
          "text-[#2d3d2e] hover:bg-black/5",
        white:
          "bg-white text-[#1a2218] shadow-sm hover:bg-[#f7f5f0]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-7 text-base",
        icon: "h-9 w-9 p-0",
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
