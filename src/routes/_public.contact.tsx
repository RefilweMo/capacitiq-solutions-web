import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { Instagram, Linkedin } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { sendContactEmail } from "@/lib/forms.functions";
import { EMAIL, WHATSAPP_DISPLAY, SOCIAL } from "@/lib/brand";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Capacitiq" },
      { name: "description", content: "If you are ready for structured growth, complete the form. Capacitiq helps South African startups and SMEs build the systems they need to scale." },
      { property: "og:title", content: "Contact Capacitiq" },
      { property: "og:description", content: "If you are ready for structured growth." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const SERVICES = [
  "Business Strategy & Operations",
  "Marketing & Growth",
  "Public Relations",
  "Virtual Assistance",
  "Graphic Design",
  "Web Presence",
  "Not Sure",
  "Other",
];

const OPERATING = ["Less than 6 months", "6–12 months", "1–3 years", "3+ years"];
const BUDGET = ["Below R2,000", "R2,000–R5,000", "R5,000–R10,000", "R10,000+"];
const TIMELINE = ["Immediately", "Within 1 month", "1–2 months", "3+ months"];
const READY = ["Yes", "No", "Just Exploring"];

const LIME_BTN: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  background: "#e6ff2b",
  color: "#0b4650",
  boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
};

function ContactPage() {
  const submit = useServerFn(sendContactEmail);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const services = fd.getAll("services").map(String);
      await submit({
        data: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          company: String(fd.get("company") || ""),
          message: JSON.stringify({
            business_overview: String(fd.get("business_overview") || ""),
            operating_for: String(fd.get("operating_for") || ""),
            services,
            help_with: String(fd.get("help_with") || ""),
            budget: String(fd.get("budget") || ""),
            timeline: String(fd.get("timeline") || ""),
            ready: String(fd.get("ready") || ""),
            notes: String(fd.get("notes") || ""),
          }, null, 2),
        },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">Contact</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          If you are ready for structured growth.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[#4a6670]">
          This is not a quick fix service. The work requires clarity, responsiveness, and willingness to implement. If you are ready, complete the form below.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr] pb-16">
        {done ? (
          <div className="neu-out rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
              Message received.
            </h2>
            <p className="mt-3 text-[#4a6670]">We'll get back to you within one business day.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="neu-out rounded-3xl p-8 md:p-10 space-y-8">
            <FormSection title="Your Details">
              <div className="grid gap-5 sm:grid-cols-2">
                <NeuField label="Full Name" required><NeuInput name="name" required maxLength={120} /></NeuField>
                <NeuField label="Email Address" required><NeuInput type="email" name="email" required /></NeuField>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <NeuField label="Phone Number"><NeuInput name="phone" maxLength={40} /></NeuField>
                <NeuField label="Business Name" required><NeuInput name="company" required maxLength={160} /></NeuField>
              </div>
            </FormSection>

            <FormSection title="Business Overview">
              <NeuField label="What does your business do?" required>
                <NeuTextarea name="business_overview" required minLength={5} maxLength={2000} />
              </NeuField>
              <RadioGroup label="How long have you been operating?" name="operating_for" options={OPERATING} required />
            </FormSection>

            <FormSection title="Service Selection">
              <fieldset>
                <legend className="mb-3 block text-sm font-medium text-[#0b4650]">
                  Which services are you interested in?<span> *</span>
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {SERVICES.map((s) => (
                    <label key={s} className="neu-in-sm rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-[#0b4650] cursor-pointer">
                      <input type="checkbox" name="services" value={s} />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>
              <NeuField label="What do you need help with?" required>
                <NeuTextarea name="help_with" required minLength={5} maxLength={2000} />
              </NeuField>
            </FormSection>

            <FormSection title="Budget & Timeline">
              <RadioGroup label="What is your budget range?" name="budget" options={BUDGET} required />
              <RadioGroup label="When do you need this service?" name="timeline" options={TIMELINE} required />
              <RadioGroup label="Are you ready to move forward if there is a good fit?" name="ready" options={READY} required />
              <NeuField label="Any additional notes?">
                <NeuTextarea name="notes" maxLength={2000} />
              </NeuField>
            </FormSection>

            <label className="flex items-start gap-3 text-sm text-[#0b4650]">
              <input type="checkbox" required className="mt-1" />
              <span>I understand that this is a paid service and I will be contacted regarding my enquiry. <span className="text-[#0b4650]">*</span></span>
            </label>

            {error && <p className="text-sm text-[#c4523a]">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full px-6 py-4 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
              style={LIME_BTN}
            >
              {busy ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}

        <aside className="space-y-4 h-fit">
          <div className="neu-out rounded-3xl p-6">
            <h3 className="font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>WhatsApp</h3>
            <a href="https://wa.me/27640620354" target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-[#4a6670] hover:text-[#0b4650]">
              {WHATSAPP_DISPLAY}
            </a>
          </div>
          <div className="neu-out rounded-3xl p-6">
            <h3 className="font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Email</h3>
            <a href={`mailto:${EMAIL}`} className="mt-2 block text-sm text-[#4a6670] hover:text-[#0b4650]">
              {EMAIL}
            </a>
          </div>
          <div className="neu-out rounded-3xl p-6">
            <h3 className="font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Hours</h3>
            <ul className="mt-2 space-y-1 text-sm text-[#4a6670]">
              <li>Monday to Friday, 9:00am to 5:00pm</li>
              <li>Saturday: Closed</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
          <div className="neu-out rounded-3xl p-6">
            <h3 className="font-bold text-[#0b4650] mb-3" style={{ fontFamily: "var(--font-display)" }}>Follow</h3>
            <div className="flex gap-3">
              <a aria-label="LinkedIn" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"><Linkedin className="h-4 w-4" /></a>
              <a aria-label="TikTok" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"><TikTokIcon className="h-4 w-4" /></a>
              <a aria-label="Instagram" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center text-[#0b4650]"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
      {children}
    </div>
  );
}

function RadioGroup({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-3 block text-sm font-medium text-[#0b4650]">
        {label}{required && <span> *</span>}
      </legend>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o, i) => (
          <label key={o} className="neu-in-sm rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-[#0b4650] cursor-pointer">
            <input type="radio" name={name} value={o} required={required && i === 0} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
