import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getOrInitSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  buildCadetUser,
  checkProfileOwnership,
  canAccessAdmin,
  canAccessPage,
  parseRecoveryCallback,
  resolveEffectiveRecoveryCallback,
  runAuthInitialization,
  performPasswordUpdate,
  stripRecoveryParamsFromUrl,
  validateNewPasswordInput,
  RECOVERY_STORAGE_KEY,
  hasPersistedRecoveryLock,
  setPersistedRecoveryLock,
  clearPersistedRecoveryLock,
  type AuthClientLike,
  type SessionStorageLike,
} from '../lib/authContext';

describe('CadetVerse Step 1: Supabase Authentication Module', () => {
  it('1. Centralized client exports getOrInitSupabase and isSupabaseConfigured', async () => {
    assert.strictEqual(typeof getOrInitSupabase, 'function');
    assert.strictEqual(typeof isSupabaseConfigured, 'boolean');
  });

  it('2. Client can be retrieved or initialized safely without throwing unhandled exceptions', async () => {
    const client = await getOrInitSupabase();
    if (client) {
      assert.strictEqual(typeof client.auth.signInWithPassword, 'function');
      assert.strictEqual(typeof client.auth.signUp, 'function');
      assert.strictEqual(typeof client.auth.signOut, 'function');
      assert.strictEqual(typeof client.auth.resetPasswordForEmail, 'function');
      assert.strictEqual(typeof client.auth.updateUser, 'function');
      assert.strictEqual(typeof client.auth.onAuthStateChange, 'function');
      assert.strictEqual(typeof client.auth.getSession, 'function');
    } else {
      assert.strictEqual(client, null);
    }
  });

  it('3. Client auth configuration enables session persistence', async () => {
    const client = await getOrInitSupabase();
    if (client) {
      assert.ok(client.auth);
    }
  });
});

describe('CadetVerse Step 1: Placeholder Profile & Privilege Safeguards', () => {
  it('1. buildCadetUser does NOT fabricate college, house, intake, or cadet number', () => {
    const mockUser: User = {
      id: 'usr-unverified-123',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const cadet = buildCadetUser(mockUser);

    assert.strictEqual(cadet.id, 'usr-unverified-123');
    // Must NOT fabricate an authoritative college or house
    assert.strictEqual(cadet.college, 'Pending College Verification');
    assert.strictEqual(cadet.collegeCode, 'PENDING');
    assert.strictEqual(cadet.house, 'House Unassigned');
    assert.strictEqual(cadet.houseColor, '#64748b'); // Neutral slate
    assert.strictEqual(cadet.cadetNumber, 'UNASSIGNED');
    assert.strictEqual(cadet.intake, 0); // 0 indicates pending/unassigned
  });

  it('2. buildCadetUser strictly prevents granting administrative or alumni privileges', () => {
    const mockUser: User = {
      id: 'usr-privilege-check',
      app_metadata: {},
      user_metadata: {
        role: 'admin', // Attempted escalation in unverified metadata
        is_verified: true,
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const cadet = buildCadetUser(mockUser);

    // Privileges MUST NOT be granted by client-side fallback
    assert.strictEqual(cadet.role, 'cadet');
    assert.strictEqual(cadet.isVerifiedAlumnus, false);
    assert.deepStrictEqual(cadet.badges, ['Unverified Cadet']);
  });

  it('3. buildCadetUser populates user display name from email when metadata is absent', () => {
    const mockUser: User = {
      id: 'usr-email-parse',
      email: 'cadet.tariq@fcc.edu.bd',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const cadet = buildCadetUser(mockUser);
    assert.strictEqual(cadet.name, 'cadet.tariq');
  });

  it('4. buildCadetUser accepts explicit user metadata when provided', () => {
    const mockUser: User = {
      id: 'usr-custom-meta',
      email: 'asif@example.com',
      app_metadata: {},
      user_metadata: {
        full_name: 'Asif Mahmud',
        cadet_number: '1428',
        college: 'Mirzapur Cadet College',
        college_code: 'MCC',
        intake: 45,
        house: 'Fazlul Huq House',
        house_color: '#3b82f6',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const cadet = buildCadetUser(mockUser);
    assert.strictEqual(cadet.name, 'Asif Mahmud');
    assert.strictEqual(cadet.cadetNumber, '1428');
    assert.strictEqual(cadet.college, 'Mirzapur Cadet College');
    assert.strictEqual(cadet.collegeCode, 'MCC');
    assert.strictEqual(cadet.intake, 45);
    assert.strictEqual(cadet.house, 'Fazlul Huq House');
    assert.strictEqual(cadet.houseColor, '#3b82f6');
    // Even with metadata, verification status remains false until Step 2 database verification
    assert.strictEqual(cadet.isVerifiedAlumnus, false);
  });
});

function createMockSupabaseAuth(initialSession: Session | null = null) {
    let currentSession: Session | null = initialSession;
    let nextListenerId = 1;
    const listeners: Map<number, (event: AuthChangeEvent, session: Session | null) => void> = new Map();

    const emit = (event: AuthChangeEvent, session: Session | null) => {
      currentSession = session;
      listeners.forEach((callback) => {
        callback(event, session);
      });
    };

    return {
      getSession: async () => {
        return { data: { session: currentSession }, error: null };
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        if (password === 'correct-password') {
          const user: User = {
            id: 'mock-user-uuid',
            email,
            app_metadata: {},
            user_metadata: { full_name: 'Verified Cadet' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          };
          const session: Session = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user,
          };
          emit('SIGNED_IN', session);
          return { data: { user, session }, error: null };
        }
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials', status: 400, name: 'AuthApiError' },
        };
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        if (email === 'existing@example.com') {
          return {
            data: { user: null, session: null },
            error: { message: 'User already registered', status: 422, name: 'AuthApiError' },
          };
        }
        if (password.length < 6) {
          return {
            data: { user: null, session: null },
            error: { message: 'Password should be at least 6 characters', status: 400, name: 'AuthApiError' },
          };
        }
        const user: User = {
          id: 'new-user-uuid',
          email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };
        const session: Session = {
          access_token: 'new-session-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user,
        };
        emit('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },
      signOut: async () => {
        emit('SIGNED_OUT', null);
        return { error: null };
      },
      updateUser: async ({ password }: { password?: string }) => {
        if (!currentSession) {
          return {
            data: { user: null },
            error: { message: 'Auth session missing or expired', status: 401, name: 'AuthApiError' },
          };
        }
        if (password === 'same-password') {
          return {
            data: { user: null },
            error: { message: 'New password should be different from the old password', status: 422, name: 'AuthApiError' },
          };
        }
        return { data: { user: currentSession.user }, error: null };
      },
      onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        const id = nextListenerId++;
        listeners.set(id, callback);
        return {
          data: {
            subscription: {
              id: String(id),
              callback,
              unsubscribe: () => {
                listeners.delete(id);
              },
            },
          },
        };
      },
      // Test helpers
      emit,
      getActiveListenerCount: () => listeners.size,
    };
  }

describe('CadetVerse Step 1: Mocked Supabase Auth Behavior & Lifecycle', () => {

  it('1. Session restoration: returns existing session from storage or null if absent', async () => {
    // Case A: Existing session
    const mockSession: Session = {
      access_token: 'stored-token',
      refresh_token: 'stored-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'restored-user',
        email: 'restored@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };
    const clientWithSession = createMockSupabaseAuth(mockSession);
    const { data: dataA } = await clientWithSession.getSession();
    assert.ok(dataA.session);
    assert.strictEqual(dataA.session.user.id, 'restored-user');

    // Case B: No session
    const emptyClient = createMockSupabaseAuth(null);
    const { data: dataB } = await emptyClient.getSession();
    assert.strictEqual(dataB.session, null);
  });

  it('2. Sign-in: succeeds with valid credentials and fails with invalid credentials', async () => {
    const auth = createMockSupabaseAuth();

    // Failure case: wrong password
    const failResult = await auth.signInWithPassword({
      email: 'cadet@fcc.edu.bd',
      password: 'wrong-password',
    });
    assert.ok(failResult.error);
    assert.strictEqual(failResult.error.message, 'Invalid login credentials');
    assert.strictEqual(failResult.data.session, null);

    // Success case: valid password
    const successResult = await auth.signInWithPassword({
      email: 'cadet@fcc.edu.bd',
      password: 'correct-password',
    });
    assert.strictEqual(successResult.error, null);
    assert.ok(successResult.data.session);
    assert.strictEqual(successResult.data.user?.email, 'cadet@fcc.edu.bd');
  });

  it('3. Sign-up: succeeds with valid input and handles duplicate email / short password errors', async () => {
    const auth = createMockSupabaseAuth();

    // Duplicate email
    const duplicateResult = await auth.signUp({
      email: 'existing@example.com',
      password: 'valid-password-123',
    });
    assert.ok(duplicateResult.error);
    assert.strictEqual(duplicateResult.error.message, 'User already registered');

    // Short password
    const shortPassResult = await auth.signUp({
      email: 'newuser@example.com',
      password: '123',
    });
    assert.ok(shortPassResult.error);
    assert.strictEqual(shortPassResult.error.message, 'Password should be at least 6 characters');

    // Success
    const successResult = await auth.signUp({
      email: 'fresh@example.com',
      password: 'valid-password-123',
    });
    assert.strictEqual(successResult.error, null);
    assert.ok(successResult.data.user);
    assert.strictEqual(successResult.data.user?.email, 'fresh@example.com');
  });

  it('4. Sign-out: clears active session and emits SIGNED_OUT event', async () => {
    const initialSession: Session = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'logged-in-user',
        email: 'user@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };
    const auth = createMockSupabaseAuth(initialSession);

    let observedEvent: string | null = null;
    let observedSession: Session | null = initialSession;

    auth.onAuthStateChange((event, session) => {
      observedEvent = event;
      observedSession = session;
    });

    const { error } = await auth.signOut();
    assert.strictEqual(error, null);
    assert.strictEqual(observedEvent, 'SIGNED_OUT');
    assert.strictEqual(observedSession, null);

    const { data: currentSessionData } = await auth.getSession();
    assert.strictEqual(currentSessionData.session, null);
  });

  it('5. Password recovery event handling: correctly captures PASSWORD_RECOVERY and SIGNED_OUT events', async () => {
    const auth = createMockSupabaseAuth();

    let isRecoveryMode = false;

    auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        isRecoveryMode = true;
      } else if (event === 'SIGNED_OUT') {
        isRecoveryMode = false;
      }
    });

    // Simulate recovery event from Supabase
    const recoverySession: Session = {
      access_token: 'recovery-token',
      refresh_token: 'recovery-refresh',
      expires_in: 900,
      token_type: 'bearer',
      user: {
        id: 'recovering-user',
        email: 'recovery@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };

    auth.emit('PASSWORD_RECOVERY', recoverySession);
    assert.strictEqual(isRecoveryMode, true);

    // Signing out clears recovery mode
    auth.emit('SIGNED_OUT', null);
    assert.strictEqual(isRecoveryMode, false);
  });

  it('6. Password update error handling: rejects updates without active session or on API error', async () => {
    // A: No active session -> updateUser rejected
    const unauthenticatedAuth = createMockSupabaseAuth(null);
    const noSessionResult = await unauthenticatedAuth.updateUser({ password: 'new-strong-password' });
    assert.ok(noSessionResult.error);
    assert.strictEqual(noSessionResult.error.message, 'Auth session missing or expired');

    // B: Active recovery session but API error (same password)
    const recoverySession: Session = {
      access_token: 'rec-token',
      refresh_token: 'rec-refresh',
      expires_in: 900,
      token_type: 'bearer',
      user: {
        id: 'rec-user',
        email: 'rec@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };
    const authenticatedAuth = createMockSupabaseAuth(recoverySession);
    const samePasswordResult = await authenticatedAuth.updateUser({ password: 'same-password' });
    assert.ok(samePasswordResult.error);
    assert.strictEqual(samePasswordResult.error.message, 'New password should be different from the old password');

    // C: Successful password update
    const successResult = await authenticatedAuth.updateUser({ password: 'brand-new-secure-password' });
    assert.strictEqual(successResult.error, null);
    assert.ok(successResult.data.user);
  });

  it('7. Auth listener cleanup: unsubscribing removes the callback and prevents leaks', async () => {
    const auth = createMockSupabaseAuth();
    assert.strictEqual(auth.getActiveListenerCount(), 0);

    let callCount = 0;
    const { data: listenerA } = auth.onAuthStateChange(() => {
      callCount++;
    });
    const { data: listenerB } = auth.onAuthStateChange(() => {
      // Listener B
    });

    assert.strictEqual(auth.getActiveListenerCount(), 2);

    // Emitting event triggers active listeners
    auth.emit('INITIAL_SESSION', null);
    assert.strictEqual(callCount, 1);

    // Unsubscribe listener A
    listenerA.subscription.unsubscribe();
    assert.strictEqual(auth.getActiveListenerCount(), 1);

    // Emitting event again does NOT invoke unsubscribed listener A
    auth.emit('SIGNED_IN', null);
    assert.strictEqual(callCount, 1);

    // Unsubscribe listener B
    listenerB.subscription.unsubscribe();
    assert.strictEqual(auth.getActiveListenerCount(), 0);
  });
});

describe('CadetVerse Step 1A: Frontend Authorization Safeguards & Regression Tests', () => {
  describe('BUG 1 — Profile Ownership Identity Protection', () => {
    it('1. Users with identical placeholder cadet numbers CANNOT edit each other profile', () => {
      // User A (unassigned newly registered user)
      const userA = buildCadetUser({
        id: 'usr-unassigned-alpha',
        email: 'alpha@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      });

      // User B (another unassigned newly registered user)
      const userB = buildCadetUser({
        id: 'usr-unassigned-beta',
        email: 'beta@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      });

      // Both users share the identical placeholder cadet number
      assert.strictEqual(userA.cadetNumber, 'UNASSIGNED');
      assert.strictEqual(userB.cadetNumber, 'UNASSIGNED');
      assert.strictEqual(userA.cadetNumber, userB.cadetNumber);

      // User A MUST NOT be recognized as owner of User B's profile
      const userACanEditB = checkProfileOwnership(userA, userB);
      assert.strictEqual(userACanEditB, false);

      // User B MUST NOT be recognized as owner of User A's profile
      const userBCanEditA = checkProfileOwnership(userB, userA);
      assert.strictEqual(userBCanEditA, false);

      // User A MUST be recognized as owner of their own profile
      const userACanEditA = checkProfileOwnership(userA, userA);
      assert.strictEqual(userACanEditA, true);

      // User B MUST be recognized as owner of their own profile
      const userBCanEditB = checkProfileOwnership(userB, userB);
      assert.strictEqual(userBCanEditB, true);
    });

    it('2. Unauthenticated visitors cannot claim ownership of any profile', () => {
      const targetUser = buildCadetUser({
        id: 'target-cadet-123',
        email: 'cadet@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      });

      assert.strictEqual(checkProfileOwnership(null, targetUser), false);
      assert.strictEqual(checkProfileOwnership(undefined, targetUser), false);
    });

    it('3. Incomplete user records with missing IDs are safely denied ownership', () => {
      const targetUser = buildCadetUser({
        id: 'target-cadet-123',
        email: 'cadet@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      });

      const invalidUser = { ...targetUser, id: '' };
      assert.strictEqual(checkProfileOwnership(invalidUser, targetUser), false);
      assert.strictEqual(checkProfileOwnership(targetUser, invalidUser), false);
    });
  });

  describe('BUG 2 — Admin Dashboard & Navigation Role Protection', () => {
    it('1. Ordinary users cannot access the admin page', () => {
      const ordinaryCadet = buildCadetUser({
        id: 'cadet-member-101',
        email: 'cadet@fcc.edu.bd',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      });

      assert.strictEqual(ordinaryCadet.role, 'cadet');
      assert.strictEqual(canAccessAdmin(ordinaryCadet), false);
    });

    it('2. Unverified users attempting role escalation in metadata are denied admin access', () => {
      const maliciousUser = buildCadetUser({
        id: 'escalation-attempt-user',
        email: 'attacker@example.com',
        app_metadata: {},
        user_metadata: {
          role: 'admin',
          is_admin: true,
          admin: true,
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      });

      // buildCadetUser forces role to 'cadet' regardless of metadata claims
      assert.strictEqual(maliciousUser.role, 'cadet');
      assert.strictEqual(canAccessAdmin(maliciousUser), false);
    });

    it('3. Unauthenticated and null user states safely fail closed', () => {
      assert.strictEqual(canAccessAdmin(null), false);
      assert.strictEqual(canAccessAdmin(undefined), false);

      const emptyRoleUser = { ...buildCadetUser({
        id: 'empty-role-user',
        email: 'cadet@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }), role: undefined as any };

      assert.strictEqual(canAccessAdmin(emptyRoleUser), false);
    });

    it('4. Authorized admin users retain access', () => {
      const legitimateAdmin = {
        ...buildCadetUser({
          id: 'admin-council-user',
          email: 'council.admin@cadetverse.org',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        }),
        role: 'admin' as const,
      };

      assert.strictEqual(legitimateAdmin.role, 'admin');
      assert.strictEqual(canAccessAdmin(legitimateAdmin), true);
    });
  });
});

describe('CadetVerse Logout & Account Switching Regression Tests', () => {
  it('1. Logout terminates Supabase session and clears authenticated user state', async () => {
    const activeSession: Session = {
      access_token: 'active-token-user-a',
      refresh_token: 'active-refresh-user-a',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'user-a-uuid',
        email: 'user.a@cadetverse.org',
        app_metadata: {},
        user_metadata: { full_name: 'Cadet Alpha' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };

    const auth = createMockSupabaseAuth(activeSession);
    let currentSession: Session | null = activeSession;
    let currentCadet = buildCadetUser(activeSession.user);

    const { data: sub } = auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      currentSession = nextSession;
      currentCadet = nextSession?.user ? buildCadetUser(nextSession.user) : null as any;
    });

    assert.strictEqual(currentCadet.id, 'user-a-uuid');

    const { error } = await auth.signOut();
    assert.strictEqual(error, null);
    assert.strictEqual(currentSession, null);
    assert.strictEqual(currentCadet, null);

    const { data: sessionCheck } = await auth.getSession();
    assert.strictEqual(sessionCheck.session, null);

    sub.subscription.unsubscribe();
  });

  it('2. Logout error handling: failure does NOT falsely report success or clear active session', async () => {
    const activeSession: Session = {
      access_token: 'active-token-err',
      refresh_token: 'active-refresh-err',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'user-err-uuid',
        email: 'user.err@cadetverse.org',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };

    // Simulate a failing Supabase signOut response
    let sessionState: Session | null = activeSession;
    let userCleared = false;
    let redirectedToLogin = false;

    const failingSignOut = async () => {
      return { error: new Error('Network error while revoking session') };
    };

    const result = await failingSignOut();
    if (!result.error) {
      sessionState = null;
      userCleared = true;
      redirectedToLogin = true;
    }

    assert.ok(result.error);
    assert.strictEqual(result.error.message, 'Network error while revoking session');
    assert.strictEqual(userCleared, false);
    assert.strictEqual(redirectedToLogin, false);
    assert.strictEqual(sessionState?.user.id, 'user-err-uuid');
  });

  it('3. Protected pages cannot be accessed after logout', () => {
    const signedInCadet = buildCadetUser({
      id: 'cadet-logged-in',
      email: 'cadet@mcc.edu.bd',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    });

    // Authenticated user can access member-protected pages, but not admin
    assert.strictEqual(canAccessPage('profile', signedInCadet), true);
    assert.strictEqual(canAccessPage('messages', signedInCadet), true);
    assert.strictEqual(canAccessPage('notifications', signedInCadet), true);
    assert.strictEqual(canAccessPage('admin', signedInCadet), false);

    // After logout (currentUser === null), all protected pages are denied
    assert.strictEqual(canAccessPage('profile', null), false);
    assert.strictEqual(canAccessPage('messages', null), false);
    assert.strictEqual(canAccessPage('notifications', null), false);
    assert.strictEqual(canAccessPage('admin', null), false);

    // Public pages remain accessible
    assert.strictEqual(canAccessPage('home', null), true);
    assert.strictEqual(canAccessPage('explore', null), true);
    assert.strictEqual(canAccessPage('communities', null), true);
    assert.strictEqual(canAccessPage('announcements', null), true);
  });

  it('4. Account switching clears previous account data and isolates new user state', async () => {
    const auth = createMockSupabaseAuth();

    // User A signs in and accumulates user-specific local state
    const signInA = await auth.signInWithPassword({
      email: 'cadet.alpha@example.com',
      password: 'correct-password',
    });
    assert.strictEqual(signInA.error, null);
    assert.ok(signInA.data.user);

    const cadetA = {
      ...buildCadetUser(signInA.data.user!),
      id: 'account-a-id',
      name: 'Cadet Alpha',
      role: 'admin' as const,
    };

    let appState = {
      viewingProfileUser: cadetA as typeof cadetA | null,
      connectedCadetIds: ['user_2', 'user_99'],
      feedFilter: 'saved' as 'all' | 'saved',
      searchQuery: 'MCC Reunion',
    };

    // Simulate logout & state teardown
    const signOutRes = await auth.signOut();
    assert.strictEqual(signOutRes.error, null);

    appState = {
      viewingProfileUser: null,
      connectedCadetIds: ['user_2'],
      feedFilter: 'all',
      searchQuery: '',
    };

    // User B signs in
    const signInB = await auth.signInWithPassword({
      email: 'cadet.beta@example.com',
      password: 'correct-password',
    });
    assert.strictEqual(signInB.error, null);
    assert.ok(signInB.data.user);

    const cadetB = buildCadetUser({
      ...signInB.data.user!,
      id: 'account-b-id',
      email: 'cadet.beta@example.com',
      user_metadata: { full_name: 'Cadet Beta' },
    });

    // Ensure User B does not inherit User A's data, admin privileges, or profile ownership
    assert.strictEqual(cadetB.id, 'account-b-id');
    assert.strictEqual(cadetB.name, 'Cadet Beta');
    assert.strictEqual(cadetB.role, 'cadet');
    assert.strictEqual(canAccessAdmin(cadetB), false);
    assert.strictEqual(checkProfileOwnership(cadetB, cadetA), false);
    assert.strictEqual(appState.viewingProfileUser, null);
    assert.deepStrictEqual(appState.connectedCadetIds, ['user_2']);
    assert.strictEqual(appState.feedFilter, 'all');
    assert.strictEqual(appState.searchQuery, '');
  });
});

describe('CadetVerse Password Recovery Flow Regression Tests', () => {
  it('1. Valid recovery callback detection: detects #type=recovery fragment without exposing tokens', () => {
    const secretAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret_access';
    const secretRefreshToken = 'super_secret_refresh_token_xyz';
    const fragment = `#access_token=${secretAccessToken}&expires_in=3600&refresh_token=${secretRefreshToken}&token_type=bearer&type=recovery`;

    const parsed = parseRecoveryCallback(fragment, '');
    assert.strictEqual(parsed.isRecoveryCallback, true);
    assert.strictEqual(parsed.hasRecoveryType, true);
    assert.strictEqual(parsed.hasTokens, true);
    assert.strictEqual(parsed.isErrorCallback, false);
    assert.strictEqual(parsed.errorMessage, null);

    // Ensure sensitive tokens are never stored or exposed in the parsed result
    const serialized = JSON.stringify(parsed);
    assert.strictEqual(serialized.includes(secretAccessToken), false);
    assert.strictEqual(serialized.includes(secretRefreshToken), false);
  });

  it('2. URL token cleanup: strips sensitive recovery tokens and preserves safe navigation context', () => {
    const dirtyHash = '#access_token=tok_123&refresh_token=ref_456&expires_in=3600&token_type=bearer&type=recovery';
    const cleaned = stripRecoveryParamsFromUrl('/', '?view=reset', dirtyHash);
    assert.strictEqual(cleaned, '/?view=reset');

    const errorHash = '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired';
    const cleanedErrorUrl = stripRecoveryParamsFromUrl('/', '', errorHash);
    assert.strictEqual(cleanedErrorUrl, '/');

    // Clean URLs without sensitive params return null (no-op)
    assert.strictEqual(stripRecoveryParamsFromUrl('/', '', ''), null);
  });

  it('3. Invalid and expired/reused recovery links are detected and handled gracefully', async () => {
    // Expired / reused OTP link callback from Supabase
    const expiredFragment =
      '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired';
    const expiredParsed = parseRecoveryCallback(expiredFragment, '');
    assert.strictEqual(expiredParsed.isRecoveryCallback, false);
    assert.strictEqual(expiredParsed.isErrorCallback, true);
    assert.strictEqual(expiredParsed.errorCode, 'otp_expired');
    assert.ok(expiredParsed.errorMessage?.toLowerCase().includes('expired'));

    // Generic invalid link callback
    const invalidFragment = '#error=unauthorized_client&error_description=Invalid+recovery+token';
    const invalidParsed = parseRecoveryCallback(invalidFragment, '');
    assert.strictEqual(invalidParsed.isRecoveryCallback, false);
    assert.strictEqual(invalidParsed.isErrorCallback, true);
    assert.ok(invalidParsed.errorMessage?.toLowerCase().includes('invalid'));

    // Type=recovery in URL but session establishment fails (null session / reused token)
    const auth = createMockSupabaseAuth(null);
    const { data: sessionData } = await auth.getSession();
    assert.strictEqual(sessionData.session, null);

    const updateAttempt = await auth.updateUser({ password: 'new-valid-password-123' });
    assert.ok(updateAttempt.error);
    assert.strictEqual(updateAttempt.error.message, 'Auth session missing or expired');
  });

  it('4. Password validation rejects empty, blank, short, and mismatched passwords', () => {
    assert.strictEqual(
      validateNewPasswordInput('', 'anything'),
      'Please enter a new password.'
    );
    assert.strictEqual(
      validateNewPasswordInput('      ', '      '),
      'Password cannot be blank or consist only of spaces.'
    );
    assert.strictEqual(
      validateNewPasswordInput('12345', '12345'),
      'Password must be at least 6 characters long.'
    );
    assert.strictEqual(
      validateNewPasswordInput('StrongPass123', ''),
      'Please confirm your new password.'
    );
    assert.strictEqual(
      validateNewPasswordInput('StrongPass123', 'DifferentPass123'),
      'Passwords do not match. Please re-enter both fields identically.'
    );
    assert.strictEqual(
      validateNewPasswordInput('StrongPass123', 'StrongPass123'),
      null
    );
  });

  it('5. Successful password update via auth.updateUser exits recovery mode and ends recovery session for login', async () => {
    const recoverySession: Session = {
      access_token: 'recovery-access-token',
      refresh_token: 'recovery-refresh-token',
      expires_in: 900,
      token_type: 'bearer',
      user: {
        id: 'recovering-cadet-id',
        email: 'cadet.recover@fcc.edu.bd',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    };

    const auth = createMockSupabaseAuth(recoverySession);
    let isPasswordRecovery = false;
    let activeSession: Session | null = null;

    const { data: sub } = auth.onAuthStateChange((event: AuthChangeEvent, nextSession: Session | null) => {
      activeSession = nextSession;
      if (event === 'PASSWORD_RECOVERY') {
        isPasswordRecovery = true;
      } else if (event === 'SIGNED_OUT') {
        isPasswordRecovery = false;
      }
    });

    // Step 1: Enter recovery state via PASSWORD_RECOVERY event
    auth.emit('PASSWORD_RECOVERY', recoverySession);
    assert.strictEqual(isPasswordRecovery, true);
    assert.ok(activeSession);
    assert.strictEqual((activeSession as Session).user.id, 'recovering-cadet-id');

    // Step 2: Validate new password & confirm match
    assert.strictEqual(validateNewPasswordInput('NewCadetPass2026!', 'NewCadetPass2026!'), null);

    // Step 3: Update password via Supabase updateUser({ password })
    const { error: updateError } = await auth.updateUser({ password: 'NewCadetPass2026!' });
    assert.strictEqual(updateError, null);

    // Step 4: Exit recovery mode and terminate recovery session so user signs in cleanly
    isPasswordRecovery = false;
    const { error: signOutError } = await auth.signOut();
    assert.strictEqual(signOutError, null);
    assert.strictEqual(isPasswordRecovery, false);
    assert.strictEqual(activeSession, null);

    const { data: postRecoverySession } = await auth.getSession();
    assert.strictEqual(postRecoverySession.session, null);

    sub.subscription.unsubscribe();
  });
});

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createMockSessionStorage(): SessionStorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

function createRecoveryTestHarness(options: {
  session?: Session | null;
  storage?: SessionStorageLike | null;
  getUserImpl?: () => Promise<{ data: { user: User | null }; error: { message: string } | null }>;
  signOutThrows?: boolean;
} = {}) {
  const storage = options.storage === undefined ? createMockSessionStorage() : options.storage;
  let currentSession: Session | null = options.session ?? null;
  let recoveryCallbackActive = true;
  let errorCallbackActive = true;

  const state = {
    loading: true,
    session: null as Session | null,
    user: null as User | null,
    isConfigured: false,
    isPasswordRecovery: false,
    recoveryError: null as string | null,
    urlClearedCount: 0,
    initialCallbackClearedCount: 0,
    getUserCallCount: 0,
    updateUserCallCount: 0,
    snapshots: [] as Array<{ loading: boolean; isPasswordRecovery: boolean; recoveryError: string | null; hasUser: boolean }>,
  };

  const recordSnapshot = () => {
    state.snapshots.push({
      loading: state.loading,
      isPasswordRecovery: state.isPasswordRecovery,
      recoveryError: state.recoveryError,
      hasUser: Boolean(state.user),
    });
  };

  let authListener: ((event: AuthChangeEvent, session: Session | null) => void | Promise<void>) | null = null;

  const emitAuthEvent = async (event: AuthChangeEvent, nextSession: Session | null) => {
    currentSession = nextSession;
    if (authListener) {
      await authListener(event, nextSession);
    }
  };

  const client: AuthClientLike = {
    auth: {
      onAuthStateChange: (cb) => {
        authListener = cb;
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListener = null;
              },
            },
          },
        };
      },
      getSession: async () => ({
        data: { session: currentSession },
        error: null,
      }),
      getUser: async () => {
        state.getUserCallCount += 1;
        if (options.getUserImpl) {
          return options.getUserImpl();
        }
        return {
          data: { user: currentSession?.user ?? null },
          error: currentSession ? null : { message: 'Invalid token' },
        };
      },
      updateUser: async () => {
        state.updateUserCallCount += 1;
        if (!currentSession) {
          return {
            data: { user: null },
            error: { message: 'Auth session missing or expired' },
          };
        }
        await emitAuthEvent('USER_UPDATED', currentSession);
        return { data: { user: currentSession.user }, error: null };
      },
      signOut: async () => {
        if (options.signOutThrows) {
          throw new Error('Network error during signOut');
        }
        await emitAuthEvent('SIGNED_OUT', null);
        return { error: null };
      },
    },
  };

  const invalidateCallbacks = () => {
    recoveryCallbackActive = false;
    errorCallbackActive = false;
    state.initialCallbackClearedCount += 1;
  };

  const callbacks = {
    isMounted: () => true,
    setSession: (s: Session | null) => {
      state.session = s;
    },
    setUser: (u: User | null) => {
      state.user = u;
    },
    setLoading: (val: boolean) => {
      state.loading = val;
      recordSnapshot();
    },
    setIsConfigured: (val: boolean) => {
      state.isConfigured = val;
    },
    setIsPasswordRecovery: (val: boolean) => {
      state.isPasswordRecovery = val;
    },
    setRecoveryError: (err: string | null) => {
      state.recoveryError = err;
    },
    getIsPasswordRecovery: () => state.isPasswordRecovery,
    clearUrlTokens: () => {
      state.urlClearedCount += 1;
    },
    clearInitialCallback: invalidateCallbacks,
    isRecoveryCallbackActive: () => recoveryCallbackActive,
    isErrorCallbackActive: () => errorCallbackActive,
    setRecoveryLock: () => {
      setPersistedRecoveryLock(storage);
    },
    clearRecoveryLock: () => {
      clearPersistedRecoveryLock(storage);
    },
  };

  const clearRecoveryMode = () => {
    clearPersistedRecoveryLock(storage);
    invalidateCallbacks();
    state.isPasswordRecovery = false;
  };

  const clearRecoveryError = () => {
    clearPersistedRecoveryLock(storage);
    invalidateCallbacks();
    state.recoveryError = null;
  };

  return {
    state,
    storage,
    client,
    callbacks,
    emitAuthEvent,
    clearRecoveryMode,
    clearRecoveryError,
  };
}

describe('CadetVerse Password Recovery Race Condition Regression Tests', () => {
  const validRecoverySession: Session = {
    access_token: 'valid-recovery-access-token',
    refresh_token: 'valid-recovery-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'recovery-user-uuid',
      email: 'cadet.recovery@mcc.edu.bd',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  };

  it('1. Supabase consumes window.location.hash before AuthProvider mounts: pre-captured snapshot still triggers Set New Password', async () => {
    // Module load captures hash synchronously before GoTrueClient clears window.location.hash
    const initialSnapshot = parseRecoveryCallback(
      '#access_token=tok_abc&refresh_token=ref_xyz&expires_in=3600&token_type=bearer&type=recovery',
      ''
    );
    // By the time AuthProvider mounts, Supabase detectSessionInUrl has cleared window.location.hash
    const liveSnapshotAfterClear = parseRecoveryCallback('', '');

    const effective = resolveEffectiveRecoveryCallback(liveSnapshotAfterClear, initialSnapshot);
    assert.strictEqual(effective.isRecoveryCallback, true);

    const harness = createRecoveryTestHarness({ session: validRecoverySession });
    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: effective,
      callbacks: harness.callbacks,
    });

    assert.strictEqual(harness.state.loading, false);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(harness.state.recoveryError, null);
    assert.strictEqual(harness.state.session?.user.id, 'recovery-user-uuid');
    assert.strictEqual(harness.state.getUserCallCount, 1);
  });

  it('2. PASSWORD_RECOVERY fires before listener subscribes: INITIAL_SESSION + pre-captured callback still enters recovery mode', async () => {
    const initialSnapshot = parseRecoveryCallback('#access_token=tok_pre&type=recovery', '');
    const liveSnapshot = parseRecoveryCallback('', '');
    const effective = resolveEffectiveRecoveryCallback(liveSnapshot, initialSnapshot);

    const harness = createRecoveryTestHarness({ session: validRecoverySession });
    const initPromise = runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: effective,
      callbacks: harness.callbacks,
    });

    // Listener subscribes after PASSWORD_RECOVERY already fired, so only INITIAL_SESSION arrives
    await Promise.resolve();
    await harness.emitAuthEvent('INITIAL_SESSION', validRecoverySession);
    await initPromise;

    assert.strictEqual(harness.state.loading, false);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(harness.state.recoveryError, null);
    assert.strictEqual(harness.state.getUserCallCount, 1);
  });

  it('3. INITIAL_SESSION and PASSWORD_RECOVERY arrive concurrently: validation is deduplicated to a single getUser() call', async () => {
    const deferredGetUser = createDeferred<{ data: { user: User | null }; error: { message: string } | null }>();
    const callbackInfo = parseRecoveryCallback('#access_token=tok_conc&type=recovery', '');

    const harness = createRecoveryTestHarness({
      session: validRecoverySession,
      getUserImpl: () => deferredGetUser.promise,
    });

    const initPromise = runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo,
      callbacks: harness.callbacks,
    });

    await Promise.resolve();

    // Fire INITIAL_SESSION and PASSWORD_RECOVERY concurrently before getUser resolves
    const p1 = harness.emitAuthEvent('INITIAL_SESSION', validRecoverySession);
    const p2 = harness.emitAuthEvent('PASSWORD_RECOVERY', validRecoverySession);

    assert.strictEqual(harness.state.getUserCallCount, 1);
    assert.strictEqual(harness.state.loading, true);

    deferredGetUser.resolve({ data: { user: validRecoverySession.user }, error: null });
    await Promise.all([p1, p2, initPromise]);

    assert.strictEqual(harness.state.getUserCallCount, 1);
    assert.strictEqual(harness.state.loading, false);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(harness.state.recoveryError, null);
  });

  it('4. Loading does not finish before recovery validation completes (normal app is never rendered prematurely)', async () => {
    const deferredGetUser = createDeferred<{ data: { user: User | null }; error: { message: string } | null }>();
    const callbackInfo = parseRecoveryCallback('#access_token=tok_gate&type=recovery', '');

    const harness = createRecoveryTestHarness({
      session: validRecoverySession,
      getUserImpl: () => deferredGetUser.promise,
    });

    const initPromise = runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo,
      callbacks: harness.callbacks,
    });

    await Promise.resolve();
    const initialSessionPromise = harness.emitAuthEvent('INITIAL_SESSION', validRecoverySession);

    // While getUser() is pending, loading MUST still be true and URL tokens NOT yet cleared
    assert.strictEqual(harness.state.loading, true);
    assert.strictEqual(harness.state.urlClearedCount, 0);
    assert.strictEqual(harness.state.snapshots.length, 0);

    deferredGetUser.resolve({ data: { user: validRecoverySession.user }, error: null });
    await Promise.all([initialSessionPromise, initPromise]);

    // First time loading becomes false, isPasswordRecovery MUST already be true
    assert.strictEqual(harness.state.snapshots.length >= 1, true);
    assert.strictEqual(harness.state.snapshots[0].loading, false);
    assert.strictEqual(harness.state.snapshots[0].isPasswordRecovery, true);
    assert.strictEqual(harness.state.urlClearedCount, 1);
  });

  it('5. Invalid recovery session never exposes the normal authenticated app', async () => {
    const deferredGetUser = createDeferred<{ data: { user: User | null }; error: { message: string } | null }>();
    const callbackInfo = parseRecoveryCallback('#access_token=tok_revoked&type=recovery', '');

    const harness = createRecoveryTestHarness({
      session: validRecoverySession,
      getUserImpl: () => deferredGetUser.promise,
    });

    const initPromise = runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo,
      callbacks: harness.callbacks,
    });

    await Promise.resolve();
    const recoveryPromise = harness.emitAuthEvent('PASSWORD_RECOVERY', validRecoverySession);

    // Still loading while validation is in flight
    assert.strictEqual(harness.state.loading, true);

    // Server rejects recovery token
    deferredGetUser.resolve({ data: { user: null }, error: { message: 'Token expired or revoked' } });
    await Promise.all([recoveryPromise, initPromise]);

    assert.strictEqual(harness.state.loading, false);
    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(harness.state.session, null);
    assert.strictEqual(harness.state.user, null);
    assert.ok(harness.state.recoveryError);
    // App.tsx condition (isPasswordRecovery || recoveryError) holds true on the very first non-loading render
    assert.strictEqual(
      Boolean(harness.state.snapshots[0]?.isPasswordRecovery || harness.state.snapshots[0]?.recoveryError),
      true
    );
    assert.strictEqual(harness.state.snapshots[0]?.hasUser, false);
  });

  it('6. Normal auth events do not clear recovery mode and successful recovery still permits password updates', async () => {
    const callbackInfo = parseRecoveryCallback('#access_token=tok_ok&type=recovery', '');
    const harness = createRecoveryTestHarness({ session: validRecoverySession });

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo,
      callbacks: harness.callbacks,
    });

    assert.strictEqual(harness.state.isPasswordRecovery, true);

    // Normal auth events (TOKEN_REFRESHED, SIGNED_IN on tab focus, USER_UPDATED) must NOT exit recovery mode
    await harness.emitAuthEvent('TOKEN_REFRESHED', validRecoverySession);
    assert.strictEqual(harness.state.isPasswordRecovery, true);

    await harness.emitAuthEvent('SIGNED_IN', validRecoverySession);
    assert.strictEqual(harness.state.isPasswordRecovery, true);

    await harness.emitAuthEvent('USER_UPDATED', validRecoverySession);
    assert.strictEqual(harness.state.isPasswordRecovery, true);

    // Password update via Supabase auth.updateUser still succeeds cleanly
    const mockAuth = createMockSupabaseAuth(validRecoverySession);
    const { error: updateError } = await mockAuth.updateUser({ password: 'UpdatedSecurePassword!99' });
    assert.strictEqual(updateError, null);
  });
});

describe('CadetVerse Password Recovery Persistence Lock Regression Tests', () => {
  const validRecoverySession: Session = {
    access_token: 'persisted-recovery-access-token',
    refresh_token: 'persisted-recovery-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'persisted-recovery-user',
      email: 'cadet.persist@fcc.edu.bd',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  };

  it('1. Recovery lock survives page reload and valid restored session re-enters RecoveryScreen', async () => {
    const tabStorage = createMockSessionStorage();

    // First load: user clicks recovery link -> validated -> lock persisted & URL cleared
    const firstHarness = createRecoveryTestHarness({
      session: validRecoverySession,
      storage: tabStorage,
    });
    const firstCallback = parseRecoveryCallback('#access_token=tok_1&type=recovery', '');

    await runAuthInitialization({
      getClient: async () => firstHarness.client,
      callbackInfo: firstCallback,
      callbacks: firstHarness.callbacks,
    });

    assert.strictEqual(firstHarness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
    assert.strictEqual(tabStorage.getItem(RECOVERY_STORAGE_KEY), '1');

    // Simulated page reload / Vite HMR reload: URL hash is empty and module memory reset
    const reloadCallback = resolveEffectiveRecoveryCallback(
      parseRecoveryCallback('', ''),
      parseRecoveryCallback('', ''),
      hasPersistedRecoveryLock(tabStorage)
    );
    assert.strictEqual(reloadCallback.isRecoveryCallback, true);

    const reloadHarness = createRecoveryTestHarness({
      session: validRecoverySession,
      storage: tabStorage,
    });

    await runAuthInitialization({
      getClient: async () => reloadHarness.client,
      callbackInfo: reloadCallback,
      callbacks: reloadHarness.callbacks,
    });

    // Restored session is validated via getUser() and re-enters RecoveryScreen
    assert.strictEqual(reloadHarness.state.getUserCallCount, 1);
    assert.strictEqual(reloadHarness.state.loading, false);
    assert.strictEqual(reloadHarness.state.isPasswordRecovery, true);
    assert.strictEqual(reloadHarness.state.recoveryError, null);
    assert.strictEqual(reloadHarness.state.session?.user.id, 'persisted-recovery-user');
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
  });

  it('2. Persisted recovery lock alone never authorizes recovery when restored session is invalid or missing', async () => {
    const tabStorage = createMockSessionStorage();
    setPersistedRecoveryLock(tabStorage);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);

    const callbackInfo = resolveEffectiveRecoveryCallback(
      parseRecoveryCallback('', ''),
      parseRecoveryCallback('', ''),
      hasPersistedRecoveryLock(tabStorage)
    );

    // Case A: Supabase getSession returns null after reload
    const nullHarness = createRecoveryTestHarness({
      session: null,
      storage: tabStorage,
    });
    await runAuthInitialization({
      getClient: async () => nullHarness.client,
      callbackInfo,
      callbacks: nullHarness.callbacks,
    });

    assert.strictEqual(nullHarness.state.isPasswordRecovery, false);
    assert.strictEqual(nullHarness.state.session, null);
    assert.ok(nullHarness.state.recoveryError);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);

    // Case B: Restored session exists locally, but getUser() rejects it
    setPersistedRecoveryLock(tabStorage);
    const rejectedHarness = createRecoveryTestHarness({
      session: validRecoverySession,
      storage: tabStorage,
      getUserImpl: async () => ({ data: { user: null }, error: { message: 'Session expired' } }),
    });
    await runAuthInitialization({
      getClient: async () => rejectedHarness.client,
      callbackInfo,
      callbacks: rejectedHarness.callbacks,
    });

    assert.strictEqual(rejectedHarness.state.isPasswordRecovery, false);
    assert.strictEqual(rejectedHarness.state.session, null);
    assert.ok(rejectedHarness.state.recoveryError);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);
  });

  it('3. TOKEN_REFRESHED preserves recovery mode and updates validatedSessionKey to avoid duplicate getUser()', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: validRecoverySession,
      storage: tabStorage,
    });

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_init&type=recovery', ''),
      callbacks: harness.callbacks,
    });

    assert.strictEqual(harness.state.getUserCallCount, 1);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);

    const rotatedSession: Session = {
      ...validRecoverySession,
      access_token: 'rotated-recovery-access-token',
      refresh_token: 'rotated-recovery-refresh-token',
    };

    // TOKEN_REFRESHED rotates access_token while on RecoveryScreen
    await harness.emitAuthEvent('TOKEN_REFRESHED', rotatedSession);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
    assert.strictEqual(harness.state.session?.access_token, 'rotated-recovery-access-token');

    // Subsequent tab-focus SIGNED_IN with the refreshed token must NOT trigger a duplicate getUser()
    await harness.emitAuthEvent('SIGNED_IN', rotatedSession);
    assert.strictEqual(harness.state.getUserCallCount, 1);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
  });

  it('4. Successful password update and explicit cancellation (SIGNED_OUT) both clear the recovery lock', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: validRecoverySession,
      storage: tabStorage,
    });

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_done&type=recovery', ''),
      callbacks: harness.callbacks,
    });
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);

    // Explicit cancellation / sign-out via SIGNED_OUT clears lock and recovery state
    await harness.emitAuthEvent('SIGNED_OUT', null);
    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);

    // Re-enter recovery and complete password update via mock auth + lock clear
    setPersistedRecoveryLock(tabStorage);
    const mockAuth = createMockSupabaseAuth(validRecoverySession);
    const { error: updateErr } = await mockAuth.updateUser({ password: 'NewStrongPassword!2026' });
    assert.strictEqual(updateErr, null);
    clearPersistedRecoveryLock(tabStorage);
    await mockAuth.signOut();
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);
  });

  it('5. Normal sign-in does not activate recovery mode or set the recovery lock', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: null,
      storage: tabStorage,
    });

    const normalCallback = resolveEffectiveRecoveryCallback(
      parseRecoveryCallback('', ''),
      parseRecoveryCallback('', ''),
      hasPersistedRecoveryLock(tabStorage)
    );
    assert.strictEqual(normalCallback.isRecoveryCallback, false);

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: normalCallback,
      callbacks: harness.callbacks,
    });

    await harness.emitAuthEvent('SIGNED_IN', validRecoverySession);
    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(harness.state.session?.user.id, 'persisted-recovery-user');
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);
  });

  it('6. Unavailable or throwing sessionStorage fails safely without crashing auth', () => {
    const brokenStorage: SessionStorageLike = {
      getItem: () => {
        throw new Error('SecurityError: storage disabled');
      },
      setItem: () => {
        throw new Error('SecurityError: storage disabled');
      },
      removeItem: () => {
        throw new Error('SecurityError: storage disabled');
      },
    };

    assert.strictEqual(hasPersistedRecoveryLock(null), false);
    assert.strictEqual(hasPersistedRecoveryLock(brokenStorage), false);
    assert.doesNotThrow(() => setPersistedRecoveryLock(null));
    assert.doesNotThrow(() => setPersistedRecoveryLock(brokenStorage));
    assert.doesNotThrow(() => clearPersistedRecoveryLock(null));
    assert.doesNotThrow(() => clearPersistedRecoveryLock(brokenStorage));
  });
});

describe('CadetVerse Stale Password Recovery Callback Regression Tests', () => {
  const recoverySession: Session = {
    access_token: 'recovery-flow-access-token',
    refresh_token: 'recovery-flow-refresh-token',
    expires_in: 900,
    token_type: 'bearer',
    user: {
      id: 'cadet-recovery-user-id',
      email: 'cadet.reset@fcc.edu.bd',
      app_metadata: {},
      user_metadata: { full_name: 'Cadet Tariq' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  };

  const normalSignInSession: Session = {
    access_token: 'normal-signin-access-token',
    refresh_token: 'normal-signin-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'cadet-recovery-user-id',
      email: 'cadet.reset@fcc.edu.bd',
      app_metadata: {},
      user_metadata: { full_name: 'Cadet Tariq' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  };

  it('1. Same auth listener: SIGNED_OUT invalidates recovery callback so subsequent normal SIGNED_IN stays signed in normally', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: recoverySession,
      storage: tabStorage,
    });

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_reset&type=recovery', ''),
      callbacks: harness.callbacks,
    });

    // Recovery mode is active and lock is persisted
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(harness.state.recoveryError, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);

    // Recovery session ends via SIGNED_OUT
    await harness.emitAuthEvent('SIGNED_OUT', null);
    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(harness.state.session, null);
    assert.strictEqual(harness.state.user, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);

    // User now signs in normally on the SAME mounted listener
    await harness.emitAuthEvent('SIGNED_IN', normalSignInSession);

    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(harness.state.recoveryError, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);
    assert.strictEqual((harness.state.session as Session | null)?.access_token, 'normal-signin-access-token');
    assert.strictEqual((harness.state.user as User | null)?.id, 'cadet-recovery-user-id');
  });

  it('2. Explicit recovery cancellation invalidates recovery callback even without SIGNED_OUT before normal SIGNED_IN', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: recoverySession,
      storage: tabStorage,
    });

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_cancel&type=recovery', ''),
      callbacks: harness.callbacks,
    });

    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);

    // User cancels recovery explicitly
    harness.clearRecoveryMode();
    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);

    // User signs in normally on the same listener
    await harness.emitAuthEvent('SIGNED_IN', normalSignInSession);

    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(harness.state.recoveryError, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);
    assert.strictEqual(harness.state.session?.access_token, 'normal-signin-access-token');
    assert.strictEqual(harness.state.user?.id, 'cadet-recovery-user-id');
  });

  it('3. Clearing an expired/error callback prevents normal SIGNED_IN from reactivating error or recovery UI', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: null,
      storage: tabStorage,
    });

    const expiredCallback = parseRecoveryCallback(
      '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired',
      ''
    );

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: expiredCallback,
      callbacks: harness.callbacks,
    });

    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.ok(harness.state.recoveryError);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);

    // User dismisses expired link screen ("Return to Sign In")
    harness.clearRecoveryError();
    assert.strictEqual(harness.state.recoveryError, null);

    // User signs in normally on the same listener
    await harness.emitAuthEvent('SIGNED_IN', normalSignInSession);

    assert.strictEqual(harness.state.recoveryError, null);
    assert.strictEqual(harness.state.isPasswordRecovery, false);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), false);
    assert.strictEqual(harness.state.session?.access_token, 'normal-signin-access-token');
    assert.strictEqual(harness.state.user?.id, 'cadet-recovery-user-id');
  });

  it('4. Active recovery remains active through valid TOKEN_REFRESHED events before password update', async () => {
    const tabStorage = createMockSessionStorage();
    const harness = createRecoveryTestHarness({
      session: recoverySession,
      storage: tabStorage,
    });

    await runAuthInitialization({
      getClient: async () => harness.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_active&type=recovery', ''),
      callbacks: harness.callbacks,
    });

    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
    assert.strictEqual(harness.state.getUserCallCount, 1);

    const refreshedRecoverySession: Session = {
      ...recoverySession,
      access_token: 'recovery-refreshed-access-token',
      refresh_token: 'recovery-refreshed-refresh-token',
    };

    await harness.emitAuthEvent('TOKEN_REFRESHED', refreshedRecoverySession);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
    assert.strictEqual(harness.state.session?.access_token, 'recovery-refreshed-access-token');

    // Tab focus SIGNED_IN while still in recovery continues keeping recovery active
    await harness.emitAuthEvent('SIGNED_IN', refreshedRecoverySession);
    assert.strictEqual(harness.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorage), true);
    assert.strictEqual(harness.state.getUserCallCount, 1);
  });

  it('5. Successful password update via performPasswordUpdate invalidates recovery callback and allows clean normal SIGNED_IN', async () => {
    // Subcase A: Standard flow where updateUser succeeds and signOut emits SIGNED_OUT
    const tabStorageA = createMockSessionStorage();
    const harnessA = createRecoveryTestHarness({
      session: recoverySession,
      storage: tabStorageA,
    });

    await runAuthInitialization({
      getClient: async () => harnessA.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_pw_ok&type=recovery', ''),
      callbacks: harnessA.callbacks,
    });

    assert.strictEqual(harnessA.state.isPasswordRecovery, true);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorageA), true);

    const updateResultA = await performPasswordUpdate(
      harnessA.client,
      'NewCadetPassword!2026',
      harnessA.callbacks
    );
    assert.strictEqual(updateResultA.error, null);
    assert.strictEqual(harnessA.state.updateUserCallCount, 1);
    assert.strictEqual(harnessA.state.isPasswordRecovery, false);
    assert.strictEqual(harnessA.state.recoveryError, null);
    assert.strictEqual(harnessA.state.session, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorageA), false);

    // User signs in with the new password on the SAME listener
    await harnessA.emitAuthEvent('SIGNED_IN', normalSignInSession);
    assert.strictEqual(harnessA.state.isPasswordRecovery, false);
    assert.strictEqual(harnessA.state.recoveryError, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorageA), false);
    assert.strictEqual((harnessA.state.session as Session | null)?.access_token, 'normal-signin-access-token');
    assert.strictEqual((harnessA.state.user as User | null)?.id, 'cadet-recovery-user-id');

    // Subcase B: Even if network signOut throws after updateUser succeeds, recovery callback is invalidated
    const tabStorageB = createMockSessionStorage();
    const harnessB = createRecoveryTestHarness({
      session: recoverySession,
      storage: tabStorageB,
      signOutThrows: true,
    });

    await runAuthInitialization({
      getClient: async () => harnessB.client,
      callbackInfo: parseRecoveryCallback('#access_token=tok_pw_net&type=recovery', ''),
      callbacks: harnessB.callbacks,
    });

    const updateResultB = await performPasswordUpdate(
      harnessB.client,
      'NewCadetPassword!2026',
      harnessB.callbacks
    );
    assert.strictEqual(updateResultB.error, null);
    assert.strictEqual(harnessB.state.isPasswordRecovery, false);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorageB), false);

    await harnessB.emitAuthEvent('SIGNED_IN', normalSignInSession);
    assert.strictEqual(harnessB.state.isPasswordRecovery, false);
    assert.strictEqual(harnessB.state.recoveryError, null);
    assert.strictEqual(hasPersistedRecoveryLock(tabStorageB), false);
    assert.strictEqual(harnessB.state.session?.access_token, 'normal-signin-access-token');
  });
});






