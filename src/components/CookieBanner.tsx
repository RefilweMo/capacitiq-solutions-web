import * as React from "react";
import { Link } from "@tanstack/react-router";

const KEY = "capacitiq_cookies_ack";

export function CookieBanner() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* noop */ }
  }, []);

  if (!show) return null;
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-sm">
      <div className="neu-out rounded-2xl p-5 bg-[#e8edf0]">
        <p className="text-sm text-[#0b4650] font-medium" style={{ fontFamily: "var(--font-display)" }}>
          We use cookies
        </p>
        <p className="mt-2 text-xs text-[#4a6670] leading-relaxed">
          We use essential cookies and anonymised analytics to improve your experience. Read our{" "}
          <Link to="/cookie-policy" className="underline text-[#0b4650]">Cookie Policy</Link>.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => { try { localStorage.setItem(KEY, "1"); } catch { /* noop */ } setShow(false); }}
            className="flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              background: "#e6ff2b",
              color: "#0b4650",
              boxShadow: "4px 4px 8px #c5cdd4, -4px -4px 8px #ffffff",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
