import * as React from "react";
import { cn } from "@/lib/utils";

export const NeuInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "neu-in w-full rounded-2xl px-5 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40",
        className,
      )}
      {...props}
    />
  ),
);
NeuInput.displayName = "NeuInput";

export const NeuTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "neu-in w-full rounded-2xl px-5 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40 min-h-[120px] resize-y",
        className,
      )}
      {...props}
    />
  ),
);
NeuTextarea.displayName = "NeuTextarea";

export const NeuSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "neu-in w-full rounded-2xl px-5 py-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
NeuSelect.displayName = "NeuSelect";

export function NeuField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--ink)]">
        {label}
        {required && <span className="text-[var(--brand)]"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[var(--ink-soft)]">{hint}</span>}
    </label>
  );
}
