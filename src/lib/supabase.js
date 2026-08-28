import { createClient } from "@supabase/supabase-js";

const env = import.meta.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function getAdminSession() {
  if (!supabase) return { session: null, isAdmin: false };
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { session: null, isAdmin: false };

  const { data: profile, error } = await supabase
    .from("admin_profiles")
    .select("role, active")
    .eq("user_id", session.user.id)
    .maybeSingle();

  return {
    session,
    isAdmin: !error && Boolean(profile?.active),
    role: profile?.role || null,
  };
}
