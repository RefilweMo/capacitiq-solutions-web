import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import * as React from "react";
import { Logo } from "@/components/Logo";
import { useModals } from "@/components/ModalsProvider";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/services", label: "Services" },
  { to: "/templates", label: "Templates" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/company", label: "Company" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { openSpotter } = useModals();

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto max-w-7xl neu-pill flex items-center justify-between gap-4 px-5 py-3">
        <Logo />

        <nav className="hidden xl:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="relative px-3 py-2 rounded-full text-sm font-medium text-[#0b4650] hover:opacity-80 transition-opacity"
              activeProps={{
                className:
                  "relative px-3 py-2 rounded-full text-sm font-medium text-[#0b4650] [&>span.dot]:opacity-100",
              }}
            >
              {n.label}
              <span
                className="dot pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-1 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity"
                style={{ background: "#e6ff2b" }}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={openSpotter}
            className="text-sm font-medium text-[#0b4650] hover:opacity-80"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Spotter Program
          </button>
          <Link
            to="/contact"
            className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              background: "#e6ff2b",
              color: "#0b4650",
              boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
            }}
          >
            Work With Us
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="md:hidden neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-auto mt-3 max-w-7xl rounded-3xl neu-out p-4">
          <div className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-medium text-[#0b4650]"
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openSpotter();
              }}
              className="text-left px-4 py-3 rounded-2xl text-sm font-medium text-[#0b4650]"
            >
              Spotter Program
            </button>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 text-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-display)",
                background: "#e6ff2b",
                color: "#0b4650",
                boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
              }}
            >
              Work With Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
