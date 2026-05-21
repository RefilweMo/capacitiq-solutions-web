import { Link } from "@tanstack/react-router";
import { LOGO_URL } from "@/lib/brand";

export function Logo({
  to = "/",
  className = "",
  showText = true,
  size = 44,
}: {
  to?: string;
  className?: string;
  showText?: boolean;
  size?: number;
}) {
  return (
    <Link to={to as never} className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        style={{
          background: "#0b4650",
          borderRadius: 10,
          padding: 8,
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "4px 4px 8px #c5cdd4, -4px -4px 8px #ffffff",
          flexShrink: 0,
        }}
      >
        <img
          src={LOGO_URL}
          alt="Capacitiq Solutions"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          loading="eager"
        />
      </span>
      {showText && (
        <span
          className="font-bold text-lg text-[#0b4650] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Solutions
        </span>
      )}
    </Link>
  );
}
