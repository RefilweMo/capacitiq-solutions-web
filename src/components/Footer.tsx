import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { Logo } from "@/components/Logo";
import { EMAIL, WHATSAPP_DISPLAY, SOCIAL } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-5 pb-10 mt-24">
      <div className="neu-out rounded-[2rem] p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo showText size={44} />
            <p className="mt-4 text-sm text-[#4a6670] max-w-xs">
              Build a business that operates with clarity and structure.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-[#4a6670]">
              <li><a href={`mailto:${EMAIL}`} className="hover:text-[#0b4650]">{EMAIL}</a></li>
              <li><a href="https://wa.me/27640620354" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b4650]">{WHATSAPP_DISPLAY}</a></li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a aria-label="LinkedIn" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"><Linkedin className="h-4 w-4" /></a>
              <a aria-label="Instagram" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"><Instagram className="h-4 w-4" /></a>
              <a aria-label="TikTok" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"><TikTokIcon className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Our Links</h4>
            <ul className="space-y-2 text-sm text-[#4a6670]">
              <li><Link to="/" className="hover:text-[#0b4650]">Home</Link></li>
              <li><Link to="/company" className="hover:text-[#0b4650]">Company</Link></li>
              <li><Link to="/services" className="hover:text-[#0b4650]">Services</Link></li>
              <li><Link to="/templates" className="hover:text-[#0b4650]">Templates Shop</Link></li>
              <li><Link to="/portfolio" className="hover:text-[#0b4650]">Portfolio</Link></li>
              <li><Link to="/careers" className="hover:text-[#0b4650]">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-[#0b4650]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Legal & More</h4>
            <ul className="space-y-2 text-sm text-[#4a6670]">
              <li><Link to="/privacy-policy" className="hover:text-[#0b4650]">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-[#0b4650]">Terms of Service</Link></li>
              <li><Link to="/template-policy" className="hover:text-[#0b4650]">Template Licence</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#0b4650]">Refund & Cancellation</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-[#0b4650]">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/contact"
            className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-display)",
              background: "#e6ff2b",
              color: "#0b4650",
              boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
            }}
          >
            Get a Free Consultation
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#c5cdd4]/60 text-center text-xs text-[#4a6670]">
          © 2026 Capacitiq Solutions (Pty) Ltd
        </div>
      </div>
    </footer>
  );
}
