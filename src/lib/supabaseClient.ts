import { createClient } from '@supabase/supabase-js'

// Fetch environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Basic validation
if (!supabaseUrl) {
  console.error('Error: VITE_SUPABASE_URL is not defined in your .env file');
  throw new Error('Supabase URL not found. Make sure VITE_SUPABASE_URL is set in your .env file.');
}
if (!supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_ANON_KEY is not defined in your .env file');
  throw new Error('Supabase Anon Key not found. Make sure VITE_SUPABASE_ANON_KEY is set in your .env file.');
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("Supabase client initialized."); // Optional: Log for confirmation
