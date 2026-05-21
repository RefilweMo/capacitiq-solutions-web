import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { getLegalPage } from "@/lib/content.functions";

const SLUGS = ["privacy-policy", "terms-of-service", "template-policy", "refund-policy", "cookie-policy"] as const;
type Slug = typeof SLUGS[number];

export const Route = createFileRoute("/_public/legal/$slug")({
  beforeLoad: ({ params }) => {
    if (!SLUGS.includes(params.slug as Slug)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${labelFor(params.slug)} — Capacitiq` },
      { name: "description", content: `${labelFor(params.slug)} for Capacitiq Solutions (Pty) Ltd.` },
      { property: "og:title", content: `${labelFor(params.slug)} — Capacitiq` },
      { property: "og:url", content: `/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/${params.slug}` }],
  }),
  component: LegalPage,
});

function labelFor(slug: string) {
  return ({
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
    "template-policy": "Template Licence",
    "refund-policy": "Refund & Cancellation Policy",
    "cookie-policy": "Cookie Policy",
  } as Record<string, string>)[slug] ?? "Legal";
}

function LegalPage() {
  const { slug } = Route.useParams();
  const fetchPage = useServerFn(getLegalPage);
  const { data, isLoading } = useQuery({
    queryKey: ["legal", slug],
    queryFn: () => fetchPage({ data: { slug } }),
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-5 py-20 text-[#4a6670]">Loading…</div>;
  if (!data) return <div className="mx-auto max-w-3xl px-5 py-20 text-[#4a6670]">Not found. <Link to="/" className="underline text-[#0b4650]">Go home</Link></div>;

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">Legal</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
        {data.title}
      </h1>
      <p className="mt-2 text-sm text-[#4a6670]">Effective Date: {new Date(data.effective_date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className="prose-legal mt-8 neu-out rounded-3xl p-8 md:p-10 text-[#0b4650]">
        <ReactMarkdown
          components={{
            h2: (p) => <h2 {...p} className="mt-8 first:mt-0 text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }} />,
            p: (p) => <p {...p} className="mt-3 text-[15px] leading-relaxed text-[#4a6670]" />,
            a: (p) => <a {...p} className="text-[#0b4650] underline" />,
            ul: (p) => <ul {...p} className="mt-3 list-disc pl-5 text-[15px] text-[#4a6670] space-y-1" />,
            li: (p) => <li {...p} className="leading-relaxed" />,
            strong: (p) => <strong {...p} className="text-[#0b4650]" />,
          }}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
