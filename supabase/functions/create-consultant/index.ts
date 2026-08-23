// Admin-only: invites a new consultant and grants staff access.
// The service role key never leaves this server-side function.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing authorization header" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Verify the caller's own identity/role via their JWT; never trust a client-supplied role.
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: callerData, error: callerError } = await callerClient.auth.getUser();
  if (callerError || !callerData.user) return json({ error: "Not authenticated" }, 401);
  if (callerData.user.app_metadata?.role !== "admin") {
    return json({ error: "Only admins can add consultants" }, 403);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  const fullName = typeof payload?.fullName === "string" ? payload.fullName.trim() : "";
  if (!email || !email.includes("@")) return json({ error: "A valid email is required" }, 400);

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });
  if (inviteError) return json({ error: inviteError.message }, 400);

  const { error: roleError } = await adminClient.auth.admin.updateUserById(invited.user.id, {
    app_metadata: { role: "staff" },
  });
  if (roleError) return json({ error: roleError.message }, 400);

  return json({ id: invited.user.id, email: invited.user.email });
});
