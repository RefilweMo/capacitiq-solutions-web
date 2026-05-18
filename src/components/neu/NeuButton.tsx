import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type Variant = "primary" | "secondary" | "ghost" | "lime";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all neu-press disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variants: Record<Variant, string> = {
  primary: "neu-out bg-[var(--brand)] text-[var(--brand-ink)] hover:brightness-110",
  secondary: "neu-out text-[var(--ink)]",
  ghost: "text-[var(--ink)] hover:bg-black/5",
  lime: "neu-out bg-[var(--lime)] text-[var(--ink)] hover:brightness-105",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
};

export const NeuButton = React.forwardRef<HTMLButtonElement,
  CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button ref={ref} className={cn(base, sizes[size], variants[variant], className)} {...props} />
  ),
);
NeuButton.displayName = "NeuButton";

export function NeuLinkButton({
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & {
  to?: string;
  href?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (to) {
    return (
      <Link to={to as never} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}
