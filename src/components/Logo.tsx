import { Link } from "@tanstack/react-router";
import { LOGO_URL, BRAND_NAME } from "@/lib/brand";

export function Logo({ to = "/", className = "" }: { to?: string; className?: string }) {
  return (
    <Link to={to as never} className={`flex items-center gap-3 ${className}`}>
      <img src={LOGO_URL} alt={`${BRAND_NAME} logo`} className="h-9 w-9" loading="eager" />
      <span className="font-bold text-lg text-[var(--brand)]" style={{ fontFamily: "var(--font-display)" }}>
        {BRAND_NAME}
      </span>
    </Link>
  );
}
