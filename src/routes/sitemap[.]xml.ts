import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/services", "/templates", "/portfolio", "/blog", "/careers", "/company", "/contact"];
        const [{ data: posts }, { data: tpls }] = await Promise.all([
          supabaseAdmin.from("blog_posts").select("slug,updated_at").eq("published", true),
          supabaseAdmin.from("templates").select("id,updated_at").eq("active", true),
        ]);
        const urls = [
          ...staticPaths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`),
          ...(posts ?? []).map((p) => `  <url><loc>${BASE_URL}/blog/${p.slug}</loc><lastmod>${p.updated_at}</lastmod></url>`),
          ...(tpls ?? []).map((t) => `  <url><loc>${BASE_URL}/templates/${t.id}</loc><lastmod>${t.updated_at}</lastmod></url>`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
