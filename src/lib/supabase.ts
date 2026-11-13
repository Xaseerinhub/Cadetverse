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

export interface RecoveryCallbackInfo {
  isRecoveryCallback: boolean;
  hasRecoveryType: boolean;
  hasTokens: boolean;
  isErrorCallback: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

/**
 * Safely parses URL fragment/query parameters for Supabase recovery callbacks
 * without ever returning, storing, or exposing access or refresh tokens.
 */
export function parseRecoveryCallback(hash: string, search: string = ''): RecoveryCallbackInfo {
  const empty: RecoveryCallbackInfo = {
    isRecoveryCallback: false,
    hasRecoveryType: false,
    hasTokens: false,
    isErrorCallback: false,
    errorCode: null,
    errorMessage: null,
  };

  try {
    const rawHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const rawSearch = search.startsWith('?') ? search.slice(1) : search;
    const hashParams = new URLSearchParams(rawHash);
    const searchParams = new URLSearchParams(rawSearch);

    const type = hashParams.get('type') || searchParams.get('type');
    const hasRecoveryType = type === 'recovery';
    const hasTokens =
      hashParams.has('access_token') ||
      hashParams.has('refresh_token') ||
      searchParams.has('access_token') ||
      searchParams.has('refresh_token');

    const error = hashParams.get('error') || searchParams.get('error');
    const errorCode = hashParams.get('error_code') || searchParams.get('error_code');
    const errorDescription =
      hashParams.get('error_description') || searchParams.get('error_description');

    const isErrorCallback = Boolean(error || errorCode);
    let errorMessage: string | null = null;

    if (isErrorCallback) {
      if (errorCode === 'otp_expired') {
        errorMessage =
          'This password recovery link has expired or has already been used. Please request a new recovery link.';
      } else if (errorDescription) {
        const normalized = errorDescription.replace(/\+/g, ' ').trim();
        errorMessage =
          normalized.toLowerCase().includes('expired') || normalized.toLowerCase().includes('invalid')
            ? 'This password recovery link is invalid, expired, or has already been used. Please request a new recovery link.'
            : normalized;
      } else {
        errorMessage =
          'This password recovery link is invalid or expired. Please request a new recovery link.';
      }
    }

    return {
      isRecoveryCallback: hasRecoveryType && !isErrorCallback,
      hasRecoveryType,
      hasTokens,
      isErrorCallback,
      errorCode,
      errorMessage,
    };
  } catch {
    return empty;
  }
}

// Synchronously capture recovery callback metadata BEFORE any Supabase client
// constructor (`detectSessionInUrl: true`) or async config fetch can clear window.location.hash.
let initialRecoveryCallback: RecoveryCallbackInfo =
  typeof window !== 'undefined'
    ? parseRecoveryCallback(window.location.hash, window.location.search)
    : parseRecoveryCallback('', '');

export function getInitialRecoveryCallback(): RecoveryCallbackInfo {
  return initialRecoveryCallback;
}

export function clearInitialRecoveryCallback(): void {
  initialRecoveryCallback = parseRecoveryCallback('', '');
}

const getStaticEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env[key] === 'string') {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && typeof process.env[key] === 'string') {
    return process.env[key];
  }
  return undefined;
};

/**
 * Normalizes the Supabase project base URL by stripping any accidental subpaths
 * such as `/rest/v1`, `/rest/v1/`, `/rest`, or trailing slashes.
 * Supabase SDK requires the root project URL (e.g. https://xyz.supabase.co).
 */
export function normalizeSupabaseUrl(rawUrl: string | undefined | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  return trimmed
    .replace(/\/rest\/v1\/?$/, '')
    .replace(/\/rest\/?$/, '')
    .replace(/\/auth\/v1\/?$/, '')
    .replace(/\/$/, '');
}

const rawStaticUrl = getStaticEnv('VITE_SUPABASE_URL');
const rawStaticKey = getStaticEnv('VITE_SUPABASE_ANON_KEY');
const staticUrl = normalizeSupabaseUrl(rawStaticUrl);
const staticKey = rawStaticKey ? rawStaticKey.trim() : undefined;

export let isSupabaseConfigured: boolean = Boolean(
  staticUrl && staticKey
);

export let supabase: SupabaseClient | null = null;

function createClientInstance(url: string, key: string): SupabaseClient | null {
  const normalizedUrl = normalizeSupabaseUrl(url);
  const normalizedKey = key ? key.trim() : '';

  if (!normalizedUrl || !normalizedKey) {
    return null;
  }

  try {
    return createClient(normalizedUrl, normalizedKey, {
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

let initConfigPromise: Promise<SupabaseClient | null> | null = null;

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

  if (initConfigPromise) {
    return initConfigPromise;
  }

  initConfigPromise = (async () => {
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
    } catch {
      // Graceful fallback to mock mode
      console.info('[CadetVerse] Operating in local mock mode (no active backend config).');
    } finally {
      initConfigPromise = null;
    }

    return null;
  })();

  return initConfigPromise;
}

/**
 * Ensures the Supabase client is initialized (awaiting /api/config if needed)
 * and returns it.
 */
export async function getOrInitSupabase(): Promise<SupabaseClient | null> {
  if (supabase) {
    return supabase;
  }
  return await initSupabaseFromConfig();
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
