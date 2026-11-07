import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isSupabaseConfigured, supabase, getSupabaseClient } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Client Module Validation', () => {
  test('gracefully handles missing environment configuration', () => {
    // If running in environment without VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      assert.equal(isSupabaseConfigured, false, 'isSupabaseConfigured should be false when env vars are unset');
      assert.equal(supabase, null, 'supabase client should be null when unconfigured');
      assert.throws(
        () => getSupabaseClient(),
        /Supabase client is not configured/,
        'getSupabaseClient should throw descriptive error when unconfigured'
      );
    } else {
      assert.equal(isSupabaseConfigured, true, 'isSupabaseConfigured should be true when env vars are present');
      assert.ok(supabase, 'supabase client should be initialized');
    }
  });

  test('successfully initializes SupabaseClient instance when parameters are supplied', () => {
    // Verify that createClient works as expected with dummy test credentials without error
    const testClient = createClient('https://test-project.supabase.co', 'dummy-anon-key-for-test');
    assert.ok(testClient, 'createClient should produce a valid client instance');
    assert.ok(testClient.auth, 'Client should possess auth interface');
    assert.ok(typeof testClient.from === 'function', 'Client should possess from() method');
  });
});
