import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAILS = ["admin@capacitiq.co.za", "rmolapisi@capacitiq.co.za"];

/**
 * Idempotent admin bootstrap. Only works for whitelisted emails.
 * - If user does not exist: create with email_confirm: true and given password.
 * - If user exists: update password (so the admin can recover from a forgotten password).
 * - Ensures the admin role row exists.
 */
export const ensureAdminUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(200),
    }).parse,
  )
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase().trim();
    if (!ADMIN_EMAILS.includes(email)) {
      throw new Error("This email is not authorised for admin bootstrap.");
    }

    // Look up the existing user
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw new Error(listErr.message);

    const existing = list.users.find((u) => u.email?.toLowerCase() === email);

    // SECURITY: if any admin already exists, refuse to set the password here.
    // Force the normal recovery flow (resetPasswordForEmail) so an attacker
    // can't seize the account by hitting this endpoint.
    const { count: adminCount } = await supabaseAdmin
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "admin");

    if ((adminCount ?? 0) > 0) {
      throw new Error(
        "Admin already exists. Use the password reset link instead of first-time setup.",
      );
    }

    let userId: string;
    if (existing) {
      userId = existing.id;
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: data.password,
        email_confirm: true,
      });
      if (updErr) throw new Error(updErr.message);
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: data.password,
        email_confirm: true,
      });
      if (createErr) throw new Error(createErr.message);
      userId = created.user!.id;
    }

    await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId, email, display_name: email.split("@")[0] }, { onConflict: "user_id" });

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    return { ok: true, created: !existing };
  });
