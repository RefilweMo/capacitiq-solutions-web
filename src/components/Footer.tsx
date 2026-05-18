import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--line)]/60">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="neu-pill inline-block px-4 py-2 font-bold">Capacitiq</div>
            <p className="mt-4 text-sm text-[var(--ink-soft)] max-w-xs">
              Business support agency for South African startups & SMEs. We build operational structure that scales.
            </p>
            <p className="mt-3 text-xs text-[var(--ink-soft)]">B-BBEE Level 1</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
              <li><Link to="/services" className="hover:text-[var(--ink)]">Services</Link></li>
              <li><Link to="/templates" className="hover:text-[var(--ink)]">Templates</Link></li>
              <li><Link to="/portfolio" className="hover:text-[var(--ink)]">Portfolio</Link></li>
              <li><Link to="/blog" className="hover:text-[var(--ink)]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
              <li><Link to="/company" className="hover:text-[var(--ink)]">About</Link></li>
              <li><Link to="/careers" className="hover:text-[var(--ink)]">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--ink)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Get in touch</h4>
            <div className="flex items-center gap-3">
              <a aria-label="WhatsApp" href="https://wa.me/27640620354" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a aria-label="Email" href="mailto:hello@capacitiq.co.za" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4" />
              </a>
              <a aria-label="Instagram" href="https://www.instagram.com/capacitiq_za" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center">
                <Instagram className="h-4 w-4" />
              </a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/capacitiq/" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center">
                <Linkedin className="h-4 w-4" />
              </a>
              <a aria-label="TikTok" href="https://www.tiktok.com/@capacitiq" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">hello@capacitiq.co.za</p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--line)]/60 flex flex-col md:flex-row justify-between gap-3 text-xs text-[var(--ink-soft)]">
          <p>© {new Date().getFullYear()} Capacitiq. All rights reserved.</p>
          <p>Remote-first · South Africa</p>
        </div>
      </div>
    </footer>
  );
}
