import { Link } from "@tanstack/react-router";
import { LOGO_URL, BRAND_NAME } from "@/lib/brand";

export function Logo({
  to = "/",
  className = "",
  showText = false,
  height = 40,
}: {
  to?: string;
  className?: string;
  showText?: boolean;
  height?: number;
}) {
  return (
    <Link to={to as never} className={`flex items-center gap-3 ${className}`}>
      <img
        src={LOGO_URL}
        alt={BRAND_NAME}
        height={height}
        style={{ height: `${height}px`, width: "auto" }}
        loading="eager"
      />
      {showText && (
        <span
          className="font-bold text-lg text-[#0b4650]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {BRAND_NAME}
        </span>
      )}
    </Link>
  );
}
