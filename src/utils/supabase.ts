/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Avoid createClient() throwing synchronously at import time when env vars are
// missing (e.g. not set in the hosting provider's dashboard) - that would blank
// the whole app before React can render anything.
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;
