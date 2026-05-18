import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import * as React from "react";
import { NeuLinkButton } from "@/components/neu/NeuButton";
import { useModals } from "@/components/ModalsProvider";

const NAV = [
  { to: "/", label: "Home" },
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
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:py-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-[var(--ink)]">
          <span className="neu-pill px-4 py-2 text-base">Capacitiq</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 neu-pill px-3 py-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              activeProps={{ className: "px-3 py-1.5 rounded-full text-sm font-semibold text-[var(--brand)] bg-white/60" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={openSpotter} className="text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--ink)]">
            Spotter Program
          </button>
          <NeuLinkButton to="/contact" variant="primary" size="sm">Book a call</NeuLinkButton>
        </div>
        <button
          aria-label="Menu"
          className="lg:hidden neu-out-sm h-10 w-10 rounded-full flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden mx-4 mb-4 rounded-3xl neu-out p-4">
          <div className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-medium text-[var(--ink)] hover:bg-black/5"
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openSpotter();
              }}
              className="text-left px-4 py-3 rounded-2xl text-sm font-medium text-[var(--ink)] hover:bg-black/5"
            >
              Spotter Program
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
