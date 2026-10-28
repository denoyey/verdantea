import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-emerald-600/40 bg-emerald-900/40 text-emerald-300 backdrop-blur-md",
        gold:
          "border border-amber-500/40 bg-amber-950/40 text-amber-300 backdrop-blur-md",
        outline:
          "border border-emerald-700/60 text-emerald-300",
        secondary:
          "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60",
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
