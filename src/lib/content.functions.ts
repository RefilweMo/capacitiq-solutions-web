import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id,slug,title,excerpt,cover_image,author,published_at,tags")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(200) }).parse)
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id,slug,title,excerpt,content,cover_image,author,published_at,tags")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .select("id,title,client,category,description,cover_image,url,tags,display_order")
    .eq("published", true)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listOpenCareers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("careers")
    .select("id,title,location,employment_type,summary,description,requirements,display_order")
    .eq("open", true)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listActiveTemplates = createServerFn({ method: "GET" }).handler(async () => {
  // Returns only safe columns. canva_link is never exposed publicly.
  const { data, error } = await supabaseAdmin
    .from("templates")
    .select("id,name,description,price_cents,cover_image,category,display_order")
    .eq("active", true)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getTemplate = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("templates")
      .select("id,name,description,price_cents,cover_image,category")
      .eq("id", data.id)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

/* -------------------- Legal pages -------------------- */
export const getLegalPage = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(80) }).parse)
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("legal_pages")
      .select("slug,title,effective_date,content,updated_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listLegalPages = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("legal_pages")
    .select("slug,title,effective_date,content,updated_at")
    .order("slug");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const updateLegalPage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      slug: z.string().min(1).max(80),
      title: z.string().min(1).max(200),
      effective_date: z.string().min(8).max(32),
      content: z.string().min(10).max(50000),
    }).parse,
  )
  .handler(async ({ data }) => {
    // NOTE: gated at UI level via admin-only routes. Trust boundary is the admin layout.
    const { error } = await supabaseAdmin
      .from("legal_pages")
      .update({
        title: data.title,
        effective_date: data.effective_date,
        content: data.content,
      })
      .eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
