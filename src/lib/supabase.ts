/**
 * CadetVerse Centralized Supabase Client
 * 
 * Supports dual initialization:
 * 1. Build-time / static environment variables (import.meta.env.VITE_SUPABASE_URL, etc.)
 * 2. Runtime server configuration fetched via GET /api/config
 * 
 * Preserves local mock mode and handles missing credentials gracefully.
 * STRICTLY NO service-role or secret keys are ever imported or exposed here.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getStaticEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env[key] === 'string') {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
    return process.env[key];
  }
  return undefined;
};

const staticUrl = getStaticEnv('VITE_SUPABASE_URL');
const staticKey = getStaticEnv('VITE_SUPABASE_ANON_KEY');

export let isSupabaseConfigured: boolean = Boolean(
  staticUrl && staticUrl.trim() && staticKey && staticKey.trim()
);

export let supabase: SupabaseClient | null = null;

function createClientInstance(url: string, key: string): SupabaseClient | null {
  try {
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.warn('[CadetVerse] Warning: Failed to initialize Supabase client:', error);
    return null;
  }
}

// Initialize immediately if static environment variables are present
if (isSupabaseConfigured && staticUrl && staticKey) {
  supabase = createClientInstance(staticUrl, staticKey);
}

/**
 * Asynchronously loads Supabase credentials from the server's /api/config route.
 * Used when secrets are injected on the server container rather than built into client bundle.
 */
export async function initSupabaseFromConfig(): Promise<SupabaseClient | null> {
  if (supabase) {
    return supabase;
  }

  // Only execute in browser environments where fetch is available
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const res = await fetch('/api/config');
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.isConfigured && data.supabaseUrl && data.supabaseAnonKey) {
      supabase = createClientInstance(data.supabaseUrl, data.supabaseAnonKey);
      if (supabase) {
        isSupabaseConfigured = true;
      }
      return supabase;
    }
  } catch (err) {
    // Graceful fallback to mock mode
    console.info('[CadetVerse] Operating in local mock mode (no active backend config).');
  }

  return null;
}

// In browser environments, attempt background configuration loading if not statically set
if (typeof window !== 'undefined' && !supabase) {
  initSupabaseFromConfig().catch(() => {});
}

/**
 * Helper to obtain the active Supabase client.
 * Throws a descriptive error if accessed when Supabase has not been configured.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      '[CadetVerse] Supabase client is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
    );
  }
  return supabase;
}
