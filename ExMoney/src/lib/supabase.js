import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if the URL and Key are provided (to prevent crashing the app if credentials are missing)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Supabase client will be null.');
} else {
  console.log('✅ Supabase client successfully initialized with your credentials!');
}
