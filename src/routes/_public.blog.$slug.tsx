import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPostBySlug } from "@/lib/content.functions";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_public/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    return {
      meta: [
        { title: p ? `${p.title} — Capacitiq` : "Post — Capacitiq" },
        { name: "description", content: p?.excerpt ?? "Capacitiq blog post" },
        { property: "og:title", content: p?.title ?? "" },
        { property: "og:description", content: p?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        ...(p?.cover_image ? [{ property: "og:image" as const, content: p.cover_image }] : []),
      ],
      links: p ? [{ rel: "canonical", href: `/blog/${p.slug}` }] : [],
      scripts: p
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: p.title,
              author: { "@type": "Organization", name: p.author ?? "Capacitiq" },
              datePublished: p.published_at,
              image: p.cover_image,
            }),
          }]
        : [],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Post not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-[var(--brand)] underline">Back to blog</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Couldn't load this post</h1>
      <p className="mt-3 text-[var(--ink-soft)]">{error.message}</p>
    </div>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>
      <header className="mt-6">
        <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)]">
          <span>{post.author}</span>
          {post.published_at && <span>· {new Date(post.published_at).toLocaleDateString("en-ZA", { dateStyle: "long" })}</span>}
        </div>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-balance">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-[var(--ink-soft)]">{post.excerpt}</p>}
      </header>
      {post.cover_image && (
        <div className="neu-out rounded-3xl overflow-hidden mt-8 aspect-[16/9]">
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div
        className="prose prose-neutral mt-10 max-w-none text-[var(--ink)] leading-relaxed whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
