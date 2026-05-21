import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Placeholder: Supabase project not yet provisioned for this session.
// Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env
// or extra fields in app.json to enable network calls.

const url =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  (Constants.expoConfig?.extra?.supabaseUrl as string | undefined) ??
  'https://placeholder.supabase.co';

const anonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined) ??
  'placeholder-anon-key';

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: false, // until AsyncStorage adapter is wired in Phase 2
    autoRefreshToken: false,
  },
});

export const isSupabaseConfigured = url !== 'https://placeholder.supabase.co';
