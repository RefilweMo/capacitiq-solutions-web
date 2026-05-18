import * as React from "react";
import { cn } from "@/lib/utils";

export function NeuCard({
  className,
  inset = false,
  as: Component = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; as?: React.ElementType }) {
  return (
    <Component
      className={cn(
        "rounded-3xl p-6",
        inset ? "neu-in" : "neu-out",
        className,
      )}
      {...props}
    />
  );
}
