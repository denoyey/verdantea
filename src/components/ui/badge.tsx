import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-[#4a6741]/30 bg-[#2d3d2e] text-[#d4e4cc]",
        gold:
          "border border-[#c59b27]/30 bg-[#3d3215] text-[#f7dc8d]",
        outline:
          "border border-[#2d3d2e]/40 text-[#2d3d2e]",
        secondary:
          "bg-[#e8e2d5] text-[#2d3d2e] border border-black/8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
