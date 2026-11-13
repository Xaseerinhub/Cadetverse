/**
 * CadetVerse Authentication Context
 * 
 * Provides centralized Supabase authentication state and actions:
 * - Session restoration and persistent session management
 * - Email / password sign-up and sign-in
 * - Sign-out
 * - Password recovery email trigger and password update flow
 * - In-memory CadetUser conversion without database table dependence
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import {
  getOrInitSupabase,
  isSupabaseConfigured as initialConfiguredStatus,
  parseRecoveryCallback,
  getInitialRecoveryCallback,
  clearInitialRecoveryCallback,
  type RecoveryCallbackInfo,
} from './supabase';
import type { CadetUser, CadetCollegeCode } from '../types';

export { parseRecoveryCallback, type RecoveryCallbackInfo };

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  cadetUser: CadetUser | null;
  loading: boolean;
  isConfigured: boolean;
  isPasswordRecovery: boolean;
  recoveryError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | Error | null; user: User | null }>;
  signOut: () => Promise<{ error: AuthError | Error | null }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: AuthError | Error | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: AuthError | Error | null }>;
  clearRecoveryMode: () => void;
  clearRecoveryError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Derives a temporary in-memory CadetUser object from the authenticated Supabase user.
 * 
 * IMPORTANT: In Step 1 (Authentication), database profile and membership tables
 * do not exist yet (scheduled for Step 2). Therefore:
 * - NO fabricated college, house, intake, or cadet number is presented as authoritative.
 * - Temporary placeholders are explicitly marked as "Pending Verification" / "Unassigned".
 * - Role is strictly baseline 'cadet' and isVerifiedAlumnus is false, ensuring NO privileges are granted.
 */
export function buildCadetUser(user: User): CadetUser {
  const metadata = user.user_metadata || {};
  const emailName = user.email ? user.email.split('@')[0] : 'Cadet User';
  const name = metadata.full_name || metadata.display_name || emailName;

  // Use authoritative metadata only if explicitly provided; otherwise use unambiguous placeholders
  const college = metadata.college ? String(metadata.college) : 'Pending College Verification';
  const collegeCode = (metadata.college_code as CadetCollegeCode) || 'PENDING';
  const intake = typeof metadata.intake === 'number' ? metadata.intake : (Number(metadata.intake) || 0);
  const house = metadata.house ? String(metadata.house) : 'House Unassigned';
  const cadetNumber = metadata.cadet_number ? String(metadata.cadet_number) : 'UNASSIGNED';

  return {
    id: user.id,
    name: String(name),
    cadetNumber,
    college,
    collegeCode,
    intake,
    house,
    houseColor: metadata.house_color || '#64748b', // Neutral slate, not claiming an authoritative house colour
    avatar: metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    coverImage: '/src/assets/images/cadet_campus_grounds_1794029062449.jpg',
    role: 'cadet', // Baseline role strictly with NO administrative or privileged rights
    profession: metadata.profession ? String(metadata.profession) : 'Cadet Member (Unverified)',
    location: metadata.location ? String(metadata.location) : 'Bangladesh',
    bio: metadata.bio ? String(metadata.bio) : `CadetVerse Member (${user.email || 'authenticated'}) - Verification Pending`,
    joinedDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Recently Joined',
    isVerifiedAlumnus: false, // Strictly false: never grants verified alumnus status as a placeholder
    stats: {
      posts: 0,
      connections: 0,
      batchmatesCount: 0,
    },
    badges: ['Unverified Cadet'],
  };
}

/**
 * Authoritative check to verify whether currentUser owns targetUser profile.
 * Strictly compares unique user IDs, preventing false positives when both users
 * have placeholder cadet numbers (e.g. 'UNASSIGNED').
 */
export function checkProfileOwnership(
  currentUser: CadetUser | null | undefined,
  targetUser: CadetUser | null | undefined
): boolean {
  if (!currentUser?.id || !targetUser?.id) return false;
  return currentUser.id === targetUser.id;
}

/**
 * Authoritative check to determine if a user possesses admin council access.
 * Strictly validates that role is 'admin', safely handling null or unverified users.
 */
export function canAccessAdmin(
  currentUser: CadetUser | null | undefined
): boolean {
  if (!currentUser) return false;
  return currentUser.role === 'admin';
}

export type ProtectedPageCheck =
  | 'home'
  | 'explore'
  | 'communities'
  | 'messages'
  | 'announcements'
  | 'notifications'
  | 'profile'
  | 'admin';

/**
 * Checks whether a user is authorized to access a given application page.
 * Protected pages ('profile', 'messages', 'notifications') require an authenticated user;
 * 'admin' additionally requires authoritative 'admin' role.
 */
export function canAccessPage(
  page: ProtectedPageCheck,
  currentUser: CadetUser | null | undefined
): boolean {
  if (page === 'admin') {
    return canAccessAdmin(currentUser);
  }
  if (page === 'profile' || page === 'messages' || page === 'notifications') {
    return Boolean(currentUser?.id);
  }
  return true;
}

const SENSITIVE_AUTH_PARAMS = [
  'access_token',
  'refresh_token',
  'provider_token',
  'provider_refresh_token',
  'expires_in',
  'expires_at',
  'token_type',
  'type',
  'error',
  'error_code',
  'error_description',
];

export const RECOVERY_STORAGE_KEY = 'cadetverse_password_recovery_active';

export type SessionStorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getSafeSessionStorage(): SessionStorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Reads the tab-scoped recovery lock safely without throwing when sessionStorage is unavailable.
 */
export function hasPersistedRecoveryLock(storage: SessionStorageLike | null = getSafeSessionStorage()): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(RECOVERY_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Persists the tab-scoped recovery lock after a valid recovery session is established.
 */
export function setPersistedRecoveryLock(storage: SessionStorageLike | null = getSafeSessionStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(RECOVERY_STORAGE_KEY, '1');
  } catch {
    // Gracefully ignore storage errors (e.g. private browsing / restricted iframe)
  }
}

/**
 * Clears the tab-scoped recovery lock safely.
 */
export function clearPersistedRecoveryLock(storage: SessionStorageLike | null = getSafeSessionStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(RECOVERY_STORAGE_KEY);
  } catch {
    // Gracefully ignore storage errors
  }
}

/**
 * Resolves effective recovery callback metadata by preferring a live URL callback
 * if present, then the pre-initialization URL snapshot captured before Supabase
 * (`detectSessionInUrl: true`) cleared window.location.hash, and finally the
 * tab-scoped sessionStorage recovery lock across reloads/HMR.
 */
export function resolveEffectiveRecoveryCallback(
  liveCallback: RecoveryCallbackInfo,
  initialCallback: RecoveryCallbackInfo,
  persistedRecoveryLock: boolean = false
): RecoveryCallbackInfo {
  if (liveCallback.isErrorCallback || liveCallback.isRecoveryCallback) {
    return liveCallback;
  }
  if (initialCallback.isErrorCallback || initialCallback.isRecoveryCallback) {
    return initialCallback;
  }
  if (persistedRecoveryLock) {
    return {
      isRecoveryCallback: true,
      hasRecoveryType: false,
      hasTokens: false,
      isErrorCallback: false,
      errorCode: null,
      errorMessage: null,
    };
  }
  return liveCallback;
}

/**
 * Strips sensitive Supabase recovery tokens and callback error parameters from
 * a URL's search and hash segments, returning the cleaned relative URL or null
 * if no sensitive parameters were present.
 */
export function stripRecoveryParamsFromUrl(
  pathname: string,
  search: string = '',
  hash: string = ''
): string | null {
  try {
    const rawSearch = search.startsWith('?') ? search.slice(1) : search;
    const rawHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const searchParams = new URLSearchParams(rawSearch);
    const hashParams = new URLSearchParams(rawHash);

    let modified = false;
    for (const key of SENSITIVE_AUTH_PARAMS) {
      if (searchParams.has(key)) {
        searchParams.delete(key);
        modified = true;
      }
      if (hashParams.has(key)) {
        hashParams.delete(key);
        modified = true;
      }
    }

    if (!modified) return null;

    const cleanSearch = searchParams.toString();
    const cleanHash = hashParams.toString();
    return `${pathname || '/'}${cleanSearch ? `?${cleanSearch}` : ''}${cleanHash ? `#${cleanHash}` : ''}`;
  } catch {
    return null;
  }
}

function clearRecoveryTokensFromUrl(): void {
  if (typeof window === 'undefined') return;
  const cleanedUrl = stripRecoveryParamsFromUrl(
    window.location.pathname,
    window.location.search,
    window.location.hash
  );
  if (cleanedUrl !== null) {
    window.history.replaceState(null, '', cleanedUrl);
  }
}

/**
 * Validates new password and confirmation fields for password recovery.
 */
export function validateNewPasswordInput(
  newPassword: string,
  confirmPassword: string
): string | null {
  if (!newPassword) {
    return 'Please enter a new password.';
  }
  if (!newPassword.trim()) {
    return 'Password cannot be blank or consist only of spaces.';
  }
  if (newPassword.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  if (!confirmPassword) {
    return 'Please confirm your new password.';
  }
  if (newPassword !== confirmPassword) {
    return 'Passwords do not match. Please re-enter both fields identically.';
  }
  return null;
}

const INVALID_RECOVERY_LINK_MESSAGE =
  'Your password recovery link is invalid, expired, or has already been used. Please request a new recovery link.';

export interface AuthClientLike {
  auth: {
    onAuthStateChange: (
      callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>
    ) => { data: { subscription: { unsubscribe: () => void } } };
    getSession: () => Promise<{
      data: { session: Session | null };
      error: { message: string } | null;
    }>;
    getUser?: () => Promise<{
      data: { user: User | null };
      error: { message: string } | null;
    }>;
  };
}

export interface AuthLifecycleCallbacks {
  isMounted: () => boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsConfigured: (configured: boolean) => void;
  setIsPasswordRecovery: (active: boolean) => void;
  setRecoveryError: (error: string | null) => void;
  getIsPasswordRecovery: () => boolean;
  clearUrlTokens: () => void;
  clearInitialCallback: () => void;
  setRecoveryLock?: () => void;
  clearRecoveryLock?: () => void;
}

export interface RunAuthInitializationOptions {
  getClient: () => Promise<AuthClientLike | null>;
  callbackInfo: RecoveryCallbackInfo;
  callbacks: AuthLifecycleCallbacks;
  onSubscriptionReady?: (subscription: { unsubscribe: () => void }) => void;
}

/**
 * Coordinates Supabase auth initialization and password recovery detection:
 * - Keeps `loading` true until session restoration AND recovery validation complete.
 * - Deduplicates concurrent validation (e.g. INITIAL_SESSION + PASSWORD_RECOVERY)
 *   and skips redundant getUser() calls for an already-validated recovery session.
 * - Clears recovery URL parameters only after Supabase has processed the callback
 *   and session validation has resolved.
 * - Prevents normal auth events from accidentally clearing recovery mode.
 */
export async function runAuthInitialization({
  getClient,
  callbackInfo,
  callbacks,
  onSubscriptionReady,
}: RunAuthInitializationOptions): Promise<void> {
  let initialEventFired = false;
  let inFlightValidation: { key: string; promise: Promise<boolean> } | null = null;
  let validatedSessionKey: string | null = null;
  let recoveryInvalidated = false;

  const setLock = () => {
    if (callbacks.setRecoveryLock) {
      callbacks.setRecoveryLock();
    } else {
      setPersistedRecoveryLock();
    }
  };

  const clearLock = () => {
    if (callbacks.clearRecoveryLock) {
      callbacks.clearRecoveryLock();
    } else {
      clearPersistedRecoveryLock();
    }
  };

  const getSessionKey = (candidate: Session | null): string =>
    candidate?.access_token ? candidate.access_token : '__null_session__';

  async function validateAndEnterRecovery(
    client: AuthClientLike,
    candidateSession: Session | null
  ): Promise<boolean> {
    const key = getSessionKey(candidateSession);

    if (inFlightValidation && inFlightValidation.key === key) {
      return inFlightValidation.promise;
    }

    const validationPromise = (async (): Promise<boolean> => {
      if (!candidateSession) {
        if (!callbacks.isMounted()) return false;
        validatedSessionKey = null;
        recoveryInvalidated = true;
        clearLock();
        callbacks.setIsPasswordRecovery(false);
        callbacks.setSession(null);
        callbacks.setUser(null);
        callbacks.setRecoveryError(INVALID_RECOVERY_LINK_MESSAGE);
        callbacks.clearUrlTokens();
        callbacks.clearInitialCallback();
        return false;
      }

      if (validatedSessionKey === key) {
        if (!callbacks.isMounted()) return false;
        callbacks.setRecoveryError(null);
        callbacks.setIsPasswordRecovery(true);
        setLock();
        callbacks.clearUrlTokens();
        return true;
      }

      if (typeof client.auth.getUser === 'function') {
        const { data: userData, error: userError } = await client.auth.getUser();
        if (!callbacks.isMounted()) return false;
        if (userError || !userData?.user) {
          validatedSessionKey = null;
          recoveryInvalidated = true;
          clearLock();
          callbacks.setIsPasswordRecovery(false);
          callbacks.setSession(null);
          callbacks.setUser(null);
          callbacks.setRecoveryError(INVALID_RECOVERY_LINK_MESSAGE);
          callbacks.clearUrlTokens();
          callbacks.clearInitialCallback();
          return false;
        }
      }

      if (!callbacks.isMounted()) return false;
      validatedSessionKey = key;
      recoveryInvalidated = false;
      callbacks.setRecoveryError(null);
      callbacks.setIsPasswordRecovery(true);
      setLock();
      callbacks.clearUrlTokens();
      return true;
    })();

    inFlightValidation = { key, promise: validationPromise };
    try {
      return await validationPromise;
    } finally {
      if (inFlightValidation?.promise === validationPromise) {
        inFlightValidation = null;
      }
    }
  }

  try {
    const client = await getClient();
    if (!callbacks.isMounted()) return;

    if (!client) {
      if (callbackInfo.isErrorCallback || callbackInfo.isRecoveryCallback) {
        clearLock();
      }
      if (callbackInfo.isErrorCallback) {
        callbacks.setIsPasswordRecovery(false);
        callbacks.setRecoveryError(callbackInfo.errorMessage || INVALID_RECOVERY_LINK_MESSAGE);
        callbacks.clearUrlTokens();
        callbacks.clearInitialCallback();
      }
      callbacks.setIsConfigured(false);
      callbacks.setLoading(false);
      return;
    }

    callbacks.setIsConfigured(true);

    const { data } = client.auth.onAuthStateChange(async (event, newSession) => {
      if (!callbacks.isMounted()) return;
      initialEventFired = true;

      if (callbackInfo.isErrorCallback && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
        clearLock();
        callbacks.setIsPasswordRecovery(false);
        callbacks.setRecoveryError(callbackInfo.errorMessage || INVALID_RECOVERY_LINK_MESSAGE);
        callbacks.clearUrlTokens();
        callbacks.clearInitialCallback();
        callbacks.setSession(newSession);
        callbacks.setUser(newSession?.user ?? null);
        callbacks.setLoading(false);
        return;
      }

      if (event === 'PASSWORD_RECOVERY') {
        const valid = await validateAndEnterRecovery(client, newSession);
        if (!callbacks.isMounted()) return;
        if (valid) {
          callbacks.setSession(newSession);
          callbacks.setUser(newSession?.user ?? null);
        }
        callbacks.setLoading(false);
        return;
      }

      if (event === 'SIGNED_OUT') {
        validatedSessionKey = null;
        clearLock();
        callbacks.clearInitialCallback();
        callbacks.setSession(null);
        callbacks.setUser(null);
        callbacks.setIsPasswordRecovery(false);
        callbacks.setLoading(false);
        return;
      }

      if (
        !recoveryInvalidated &&
        callbackInfo.isRecoveryCallback &&
        (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')
      ) {
        // If TOKEN_REFRESHED already rotated the session during active recovery, keep validated key current
        if (callbacks.getIsPasswordRecovery() && validatedSessionKey && newSession?.access_token) {
          const valid = await validateAndEnterRecovery(client, newSession);
          if (!callbacks.isMounted()) return;
          if (valid) {
            callbacks.setSession(newSession);
            callbacks.setUser(newSession.user ?? null);
          }
          callbacks.setLoading(false);
          return;
        }
        const valid = await validateAndEnterRecovery(client, newSession);
        if (!callbacks.isMounted()) return;
        if (valid) {
          callbacks.setSession(newSession);
          callbacks.setUser(newSession?.user ?? null);
        }
        callbacks.setLoading(false);
        return;
      }

      // Preserve active recovery mode and recovery lock across non-sign-out auth events
      if (callbacks.getIsPasswordRecovery()) {
        if (newSession) {
          if (event === 'TOKEN_REFRESHED' && newSession.access_token) {
            validatedSessionKey = newSession.access_token;
          }
          callbacks.setSession(newSession);
          callbacks.setUser(newSession.user ?? null);
        }
        callbacks.setLoading(false);
        return;
      }

      callbacks.setSession(newSession);
      callbacks.setUser(newSession?.user ?? null);
      callbacks.setLoading(false);
    });

    if (!callbacks.isMounted()) {
      data.subscription.unsubscribe();
      return;
    }

    onSubscriptionReady?.(data.subscription);

    if (!initialEventFired) {
      const { data: sessionData, error } = await client.auth.getSession();
      if (!callbacks.isMounted()) return;

      if (!initialEventFired) {
        if (error) {
          console.warn('[CadetVerse Auth] Failed to restore session:', error.message);
        }

        if (callbackInfo.isErrorCallback) {
          clearLock();
          callbacks.setIsPasswordRecovery(false);
          callbacks.setRecoveryError(callbackInfo.errorMessage || INVALID_RECOVERY_LINK_MESSAGE);
          callbacks.clearUrlTokens();
          callbacks.clearInitialCallback();
          callbacks.setSession(sessionData.session);
          callbacks.setUser(sessionData.session?.user ?? null);
          callbacks.setLoading(false);
          return;
        }

        if (callbackInfo.isRecoveryCallback && !recoveryInvalidated) {
          const valid = await validateAndEnterRecovery(client, sessionData.session);
          if (!callbacks.isMounted()) return;
          if (valid) {
            callbacks.setSession(sessionData.session);
            callbacks.setUser(sessionData.session?.user ?? null);
          }
          callbacks.setLoading(false);
          return;
        }

        callbacks.setSession(sessionData.session);
        callbacks.setUser(sessionData.session?.user ?? null);
        callbacks.setLoading(false);
      }
    }
  } catch (err) {
    console.error(
      '[CadetVerse Auth] Initialization error:',
      err instanceof Error ? err.message : 'Unknown error'
    );
    if (callbacks.isMounted()) {
      if (callbackInfo.isErrorCallback) {
        clearLock();
        callbacks.setIsPasswordRecovery(false);
        callbacks.setRecoveryError(callbackInfo.errorMessage || INVALID_RECOVERY_LINK_MESSAGE);
        callbacks.clearUrlTokens();
        callbacks.clearInitialCallback();
      }
      callbacks.setLoading(false);
    }
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(initialConfiguredStatus);
  const [isPasswordRecovery, setIsPasswordRecoveryState] = useState<boolean>(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const isPasswordRecoveryRef = useRef<boolean>(false);

  const setIsPasswordRecovery = (active: boolean) => {
    isPasswordRecoveryRef.current = active;
    setIsPasswordRecoveryState(active);
  };

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const liveCallback =
      typeof window !== 'undefined'
        ? parseRecoveryCallback(window.location.hash, window.location.search)
        : parseRecoveryCallback('', '');
    const callbackInfo = resolveEffectiveRecoveryCallback(
      liveCallback,
      getInitialRecoveryCallback(),
      hasPersistedRecoveryLock()
    );

    void runAuthInitialization({
      getClient: getOrInitSupabase,
      callbackInfo,
      callbacks: {
        isMounted: () => isMounted,
        setSession,
        setUser,
        setLoading,
        setIsConfigured,
        setIsPasswordRecovery,
        setRecoveryError,
        getIsPasswordRecovery: () => isPasswordRecoveryRef.current,
        clearUrlTokens: clearRecoveryTokensFromUrl,
        clearInitialCallback: clearInitialRecoveryCallback,
        setRecoveryLock: () => setPersistedRecoveryLock(),
        clearRecoveryLock: () => clearPersistedRecoveryLock(),
      },
      onSubscriptionReady: (subscription) => {
        authSubscription = subscription;
      },
    });

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }
    };
  }, []);

  const cadetUser = useMemo(() => {
    if (!user) return null;
    return buildCadetUser(user);
  }, [user]);

  const signInWithEmail = async (email: string, password: string) => {
    const client = await getOrInitSupabase();
    if (!client) {
      return { error: new Error('Supabase is not configured.') };
    }
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (!error && data.session) {
      setSession(data.session);
      setUser(data.user);
    }
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    const client = await getOrInitSupabase();
    if (!client) {
      return { error: new Error('Supabase is not configured.'), user: null };
    }

    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: fullName ? { full_name: fullName.trim() } : undefined,
      },
    });

    if (!error && data.session) {
      setSession(data.session);
      setUser(data.user);
    }

    return { error, user: data.user };
  };

  const signOut = async () => {
    const client = await getOrInitSupabase();
    if (!client) {
      clearPersistedRecoveryLock();
      clearInitialRecoveryCallback();
      setSession(null);
      setUser(null);
      setIsPasswordRecovery(false);
      return { error: null };
    }
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        return { error };
      }
      clearPersistedRecoveryLock();
      clearInitialRecoveryCallback();
      setSession(null);
      setUser(null);
      setIsPasswordRecovery(false);
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to terminate session.'),
      };
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    const client = await getOrInitSupabase();
    if (!client) {
      return { error: new Error('Supabase is not configured.') };
    }

    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const updateUserPassword = async (newPassword: string) => {
    const client = await getOrInitSupabase();
    if (!client) {
      return { error: new Error('Supabase is not configured.') };
    }

    if (!newPassword || !newPassword.trim() || newPassword.length < 6) {
      return { error: new Error('Password must be at least 6 characters long.') };
    }

    // Session & server-side user verification: ensure an active, valid recovery session exists
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session) {
      clearPersistedRecoveryLock();
      clearInitialRecoveryCallback();
      setIsPasswordRecovery(false);
      setRecoveryError(INVALID_RECOVERY_LINK_MESSAGE);
      clearRecoveryTokensFromUrl();
      return {
        error: new Error(
          sessionError?.message || INVALID_RECOVERY_LINK_MESSAGE
        ),
      };
    }

    if (typeof client.auth.getUser === 'function') {
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData?.user) {
        clearPersistedRecoveryLock();
        clearInitialRecoveryCallback();
        setIsPasswordRecovery(false);
        setRecoveryError(INVALID_RECOVERY_LINK_MESSAGE);
        clearRecoveryTokensFromUrl();
        return {
          error: new Error(userError?.message || INVALID_RECOVERY_LINK_MESSAGE),
        };
      }
    }

    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (!error) {
      clearPersistedRecoveryLock();
      clearInitialRecoveryCallback();
      setIsPasswordRecovery(false);
      setRecoveryError(null);
      clearRecoveryTokensFromUrl();
      // Terminate recovery session so the user signs in cleanly with the new password
      try {
        await client.auth.signOut();
      } catch {
        // Proceed with local state cleanup even if network signOut encounters an issue
      }
      setSession(null);
      setUser(null);
    }
    return { error };
  };

  const clearRecoveryMode = () => {
    clearPersistedRecoveryLock();
    clearInitialRecoveryCallback();
    setIsPasswordRecovery(false);
  };

  const clearRecoveryError = () => {
    clearPersistedRecoveryLock();
    clearInitialRecoveryCallback();
    setRecoveryError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    cadetUser,
    loading,
    isConfigured,
    isPasswordRecovery,
    recoveryError,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    sendPasswordResetEmail,
    updateUserPassword,
    clearRecoveryMode,
    clearRecoveryError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
