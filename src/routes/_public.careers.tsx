import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { useModals } from "@/components/ModalsProvider";

export const Route = createFileRoute("/_public/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Capacitiq" },
      { name: "description", content: "Work in a structured, performance-driven environment. Remote, flexible, independent contractor roles built for people who take ownership and execute consistently." },
      { property: "og:title", content: "Careers at Capacitiq" },
      { property: "og:description", content: "Remote, flexible, independent contractor roles. Performance-based." },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

const CULTURE = [
  { t: "Accountability", d: "Ownership of performance is non-negotiable. We expect execution from day one." },
  { t: "Clarity", d: "Clear expectations, clear deliverables, clear outcomes. No ambiguity about what is expected." },
  { t: "Consistent Execution", d: "Contractors are expected to operate independently, communicate professionally, and take full ownership of their performance." },
  { t: "Remote and Flexible", d: "Manage your own time and workflow, provided performance expectations and reporting requirements are consistently met." },
];

const LIME_BTN: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  background: "#e6ff2b",
  color: "#0b4650",
  boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
};

function CareersPage() {
  const { openSpotter } = useModals();

  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">Careers</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          Careers
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[#4a6670]">
          Work in a structured, performance-driven environment. Remote, flexible, independent contractor roles. Performance-based. Built for people who take ownership and execute consistently.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 pb-12">
        {CULTURE.map((c) => (
          <div key={c.t} className="neu-out rounded-3xl p-6">
            <h3 className="text-lg font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{c.t}</h3>
            <p className="mt-2 text-sm text-[#4a6670]">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="pb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          Open Roles
        </h2>

        <div className="space-y-4">
          <RoleCard
            title="Sales Spotter (Commission-Only)"
            meta="Remote · South Africa | Type: Freelance"
            status="OPEN"
            applyLabel="Apply Now"
            onApply={openSpotter}
          >
            <Block h="Role Overview">
              Refer qualified businesses to Capacitiq and earn 15% of their first invoice. Ideal for connectors with strong professional networks.
            </Block>
            <Block h="What You Will Do">
              <ul className="list-disc pl-5 space-y-1">
                <li>Identify businesses that could benefit from Capacitiq's services</li>
                <li>Make an introduction or warm referral</li>
                <li>Submit the referral via the Spotters form</li>
                <li>Earn 15% of the referred client's first invoice upon payment</li>
              </ul>
            </Block>
            <Block h="Requirements">
              <ul className="list-disc pl-5 space-y-1">
                <li>Strong professional network</li>
                <li>Comfortable making warm introductions</li>
                <li>No formal qualification required</li>
              </ul>
            </Block>
            <Block h="Compensation">
              15% of first invoice on every referred client that signs and pays.
            </Block>
          </RoleCard>

          <RoleCard
            title="Client Acquisition Specialist (Commission-Based Independent Contractor)"
            meta="Remote · South Africa | Type: Freelance — Commission Only"
            status="CLOSED"
          >
            <Block h="Role Overview">
              We are looking for Client Acquisition Specialists to join our team. This is a commission-based independent contractor role focused on identifying, engaging, and converting new business opportunities through direct outreach and structured client communication. You will be responsible for generating leads, initiating contact with prospective clients, and guiding them through the process of becoming paying clients.
            </Block>
            <Block h="What You Will Do">
              <ul className="list-disc pl-5 space-y-1">
                <li>Identify and research potential clients across South Africa</li>
                <li>Conduct cold outreach to business owners and decision-makers</li>
                <li>Engage prospects and present services using approved materials</li>
                <li>Follow up consistently to convert leads into active clients</li>
                <li>Manage your own pipeline from first contact to closed deal</li>
                <li>Maintain professional communication throughout the client journey</li>
              </ul>
            </Block>
            <Block h="Compensation Structure">
              This is a commission-based role only. Earn commission on every retainer client you close, paid monthly for as long as the client remains active. Earn commission on once-off projects upon completion and payment. Additional performance-based incentives may be introduced based on results, not guaranteed. Your income is directly tied to performance. There is no fixed monthly salary.
            </Block>
            <Block h="Performance Review">
              Performance will be internally tracked based on consistency, client acquisition outcomes, and overall contribution to revenue generation. After six months, there may be a review of your performance. This may include a possible restructuring of your contract, including upgraded commission structures and additional performance-based incentives depending on results achieved and business requirements at that time.
            </Block>
            <Block h="What We Offer">
              <ul className="list-disc pl-5 space-y-1">
                <li>Structured service offerings and sales materials</li>
                <li>Clear pricing and conversion framework</li>
                <li>Remote and flexible working environment</li>
                <li>Opportunity to build recurring monthly income through retainers</li>
                <li>Exposure to multiple industries and business types</li>
              </ul>
            </Block>
            <Block h="Who This Role Is For">
              Self-driven and disciplined without supervision. Comfortable with commission-based earnings. Confident initiating conversations with business owners. Enjoy research, outreach, and problem-solving. Communicate clearly and professionally. Motivated by performance and measurable results. No formal qualification or prior agency experience is required.
            </Block>
          </RoleCard>
        </div>
      </section>
    </div>
  );
}

function Block({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold text-sm mt-5 mb-2 text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{h}</h4>
      <div className="text-sm text-[#4a6670] leading-relaxed">{children}</div>
    </div>
  );
}

function RoleCard({
  title,
  meta,
  status,
  children,
  applyLabel,
  onApply,
}: {
  title: string;
  meta: string;
  status: "OPEN" | "CLOSED";
  children: React.ReactNode;
  applyLabel?: string;
  onApply?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isOpen = status === "OPEN";
  return (
    <div className="neu-out rounded-3xl p-2">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{title}</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={
                isOpen
                  ? { background: "#e6ff2b", color: "#0b4650" }
                  : { background: "#c5cdd4", color: "#4a6670" }
              }
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <span className="block text-xs text-[#4a6670] mt-1">{meta}</span>
        </div>
        <span className="neu-out-sm h-9 w-9 rounded-full flex items-center justify-center text-[#0b4650] shrink-0">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-6 pt-2">
          {children}
          <div className="mt-6">
            {isOpen && onApply ? (
              <button onClick={onApply} className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider" style={LIME_BTN}>
                {applyLabel || "Apply Now"}
              </button>
            ) : (
              <span className="inline-block rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider" style={{ background: "#c5cdd4", color: "#4a6670" }}>
                Applications Closed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
