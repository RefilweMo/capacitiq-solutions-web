import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const adminGuard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) throw new Error("Forbidden: admin only");
    return true;
  });

export const checkAdmin = adminGuard;

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin only");
}

/* ---------- Blog ---------- */
const blogSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(1),
  cover_image: z.string().url().optional().or(z.literal("")),
  author: z.string().max(120).optional().or(z.literal("")),
  tags: z.array(z.string()).max(20).optional(),
  published: z.boolean().optional(),
});

export const listAllBlog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertBlog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(blogSchema.parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const payload = {
      ...data,
      excerpt: data.excerpt || null,
      cover_image: data.cover_image || null,
      author: data.author || "Capacitiq",
      tags: data.tags ?? [],
      published_at: data.published ? new Date().toISOString() : null,
    };
    const { error } = data.id
      ? await supabaseAdmin.from("blog_posts").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("blog_posts").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBlog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Portfolio ---------- */
const portfolioSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  client: z.string().max(200).optional().or(z.literal("")),
  category: z.string().max(80).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  cover_image: z.string().url().optional().or(z.literal("")),
  url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).max(20).optional(),
  display_order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const listAllPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("portfolio_items").select("*").order("display_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });
export const upsertPortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(portfolioSchema.parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const payload = {
      ...data,
      client: data.client || null,
      category: data.category || null,
      description: data.description || null,
      cover_image: data.cover_image || null,
      url: data.url || null,
      tags: data.tags ?? [],
    };
    const { error } = data.id
      ? await supabaseAdmin.from("portfolio_items").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("portfolio_items").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
export const deletePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("portfolio_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Careers ---------- */
const careerSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  location: z.string().max(120).optional().or(z.literal("")),
  employment_type: z.string().max(80).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(8000).optional().or(z.literal("")),
  requirements: z.string().max(4000).optional().or(z.literal("")),
  display_order: z.number().int().optional(),
  open: z.boolean().optional(),
});
export const listAllCareers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("careers").select("*").order("display_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });
export const upsertCareer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(careerSchema.parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const payload = {
      ...data,
      location: data.location || "Remote, South Africa",
      employment_type: data.employment_type || "Contractor",
      summary: data.summary || null,
      description: data.description || null,
      requirements: data.requirements || null,
    };
    const { error } = data.id
      ? await supabaseAdmin.from("careers").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("careers").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
export const deleteCareer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("careers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Templates ---------- */
const templateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  price_cents: z.number().int().min(0).max(100000000),
  cover_image: z.string().url().optional().or(z.literal("")),
  category: z.string().max(80).optional().or(z.literal("")),
  canva_link: z.string().url(),
  display_order: z.number().int().optional(),
  active: z.boolean().optional(),
});
export const listAllTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("templates").select("*").order("display_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });
export const upsertTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(templateSchema.parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const payload = {
      ...data,
      description: data.description || null,
      cover_image: data.cover_image || null,
      category: data.category || null,
    };
    const { error } = data.id
      ? await supabaseAdmin.from("templates").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("templates").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
export const deleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Submissions ---------- */
export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
