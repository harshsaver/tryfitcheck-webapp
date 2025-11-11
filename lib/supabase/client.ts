import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that throws helpful errors
    console.warn('Supabase credentials not configured. Auth features will be unavailable.');
    throw new Error('Authentication is not configured. Please contact support.');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
