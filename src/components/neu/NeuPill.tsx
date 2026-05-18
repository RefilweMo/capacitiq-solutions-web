import * as React from "react";
import { cn } from "@/lib/utils";

export function NeuPill({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium neu-out-sm text-[var(--ink)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function NeuIconBox({
  className,
  children,
  size = 56,
}: { className?: string; children: React.ReactNode; size?: number }) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-2xl neu-out-sm text-[var(--brand)]", className)}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}
