import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { Instagram, Linkedin, ArrowLeft } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { sendContactEmail } from "@/lib/forms.functions";
import { EMAIL, WHATSAPP_DISPLAY, SOCIAL } from "@/lib/brand";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Capacitiq" },
      { name: "description", content: "Ready for structured growth? Tell us about your business and we'll be in touch within one business day." },
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

const STEPS = ["Your Details", "Business Overview", "Service Selection", "Budget & Timeline"];

type FormState = {
  name: string; email: string; phone: string; company: string;
  business_overview: string; operating_for: string;
  services: string[]; help_with: string;
  budget: string; timeline: string; ready: string; notes: string;
  consent: boolean;
};

const INITIAL: FormState = {
  name: "", email: "", phone: "", company: "",
  business_overview: "", operating_for: "",
  services: [], help_with: "",
  budget: "", timeline: "", ready: "", notes: "", consent: false,
};

function ContactPage() {
  const submit = useServerFn(sendContactEmail);
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<FormState>(INITIAL);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setData((d) => ({ ...d, [k]: v }));
  const toggleService = (s: string) =>
    setData((d) => ({ ...d, services: d.services.includes(s) ? d.services.filter((x) => x !== s) : [...d.services, s] }));

  function valid(s: number): boolean {
    if (s === 0) return !!(data.name && data.email && data.company);
    if (s === 1) return !!(data.business_overview && data.operating_for);
    if (s === 2) return data.services.length > 0 && !!data.help_with;
    if (s === 3) return !!(data.budget && data.timeline && data.ready && data.consent);
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid(3)) return;
    setBusy(true); setError(null);
    try {
      await submit({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          message: JSON.stringify({
            business_overview: data.business_overview,
            operating_for: data.operating_for,
            services: data.services,
            help_with: data.help_with,
            budget: data.budget,
            timeline: data.timeline,
            ready: data.ready,
            notes: data.notes,
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
            <h2 className="text-2xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Message received.</h2>
            <p className="mt-3 text-[#4a6670]">We'll get back to you within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="neu-out rounded-3xl p-8 md:p-10 space-y-8">
            {/* Progress pills */}
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${i === step ? "" : "text-[#4a6670]"}`}
                  style={i === step
                    ? { fontFamily: "var(--font-display)", background: "#e6ff2b", color: "#0b4650", boxShadow: "inset 4px 4px 8px #c5cdd4, inset -4px -4px 8px #ffffff" }
                    : { fontFamily: "var(--font-display)", boxShadow: "4px 4px 8px #c5cdd4, -4px -4px 8px #ffffff" }}
                >
                  {i + 1}. {s}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Your Details</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <NeuField label="Full Name" required><NeuInput value={data.name} onChange={(e) => update("name", e.target.value)} required maxLength={120} /></NeuField>
                  <NeuField label="Email Address" required><NeuInput type="email" value={data.email} onChange={(e) => update("email", e.target.value)} required /></NeuField>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <NeuField label="Phone Number"><NeuInput value={data.phone} onChange={(e) => update("phone", e.target.value)} maxLength={40} /></NeuField>
                  <NeuField label="Business Name" required><NeuInput value={data.company} onChange={(e) => update("company", e.target.value)} required maxLength={160} /></NeuField>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Business Overview</h3>
                <NeuField label="What does your business do?" required>
                  <NeuTextarea value={data.business_overview} onChange={(e) => update("business_overview", e.target.value)} required maxLength={2000} />
                </NeuField>
                <RadioGroup label="How long have you been operating?" required options={OPERATING} value={data.operating_for} onChange={(v) => update("operating_for", v)} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Service Selection</h3>
                <fieldset>
                  <legend className="mb-3 block text-sm font-medium text-[#0b4650]">Which services are you interested in? <span className="text-[#0b4650]">*</span></legend>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SERVICES.map((s) => (
                      <label key={s} className="neu-in-sm rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-[#0b4650] cursor-pointer">
                        <input type="checkbox" checked={data.services.includes(s)} onChange={() => toggleService(s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <NeuField label="What do you need help with?" required>
                  <NeuTextarea value={data.help_with} onChange={(e) => update("help_with", e.target.value)} required maxLength={2000} />
                </NeuField>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Budget & Timeline</h3>
                <RadioGroup label="What is your budget range?" required options={BUDGET} value={data.budget} onChange={(v) => update("budget", v)} />
                <RadioGroup label="When do you need this service?" required options={TIMELINE} value={data.timeline} onChange={(v) => update("timeline", v)} />
                <RadioGroup label="Are you ready to move forward if there is a good fit?" required options={READY} value={data.ready} onChange={(v) => update("ready", v)} />
                <NeuField label="Any additional notes?"><NeuTextarea value={data.notes} onChange={(e) => update("notes", e.target.value)} maxLength={2000} /></NeuField>
                <label className="flex items-start gap-3 text-sm text-[#0b4650]">
                  <input type="checkbox" checked={data.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1" required />
                  <span>I understand that this is a paid service and I will be contacted regarding my enquiry. <span>*</span></span>
                </label>
                {error && <p className="text-sm text-[#c4523a]">{error}</p>}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-[#0b4650] hover:underline inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : <span />}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => { if (valid(step)) setStep(step + 1); }}
                  disabled={!valid(step)}
                  className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  style={LIME_BTN}
                >
                  Continue to {STEPS[step + 1]} →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={busy || !valid(3)}
                  className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  style={LIME_BTN}
                >
                  {busy ? "Sending…" : "Send Message"}
                </button>
              )}
            </div>
          </form>
        )}

        <aside className="space-y-4 h-fit">
          <div className="neu-out rounded-3xl p-6">
            <h3 className="font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>WhatsApp</h3>
            <a href="https://wa.me/27640620354" target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-[#4a6670] hover:text-[#0b4650]">{WHATSAPP_DISPLAY}</a>
          </div>
          <div className="neu-out rounded-3xl p-6">
            <h3 className="font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Email</h3>
            <a href={`mailto:${EMAIL}`} className="mt-2 block text-sm text-[#4a6670] hover:text-[#0b4650]">{EMAIL}</a>
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

function RadioGroup({ label, required, options, value, onChange }: {
  label: string; required?: boolean; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 block text-sm font-medium text-[#0b4650]">
        {label}{required && <span> *</span>}
      </legend>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o} className="neu-in-sm rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-[#0b4650] cursor-pointer">
            <input type="radio" checked={value === o} onChange={() => onChange(o)} required={required} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
