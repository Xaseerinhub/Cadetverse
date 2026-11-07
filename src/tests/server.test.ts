import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { app, getSupabaseServerConfig } from '../../server';

describe('Server Supabase Endpoints Validation', () => {
  test('getSupabaseServerConfig returns safe object without secret keys', () => {
    const config = getSupabaseServerConfig();
    assert.ok(typeof config === 'object');
    assert.ok('supabaseUrl' in config);
    assert.ok('supabaseAnonKey' in config);
    assert.ok('isConfigured' in config);
    // Ensure no service_role key is exposed
    assert.equal('serviceRoleKey' in config, false);
    assert.equal('SUPABASE_SERVICE_ROLE_KEY' in (config as any), false);
  });

  test('GET /api/config returns JSON with expected schema', async () => {
    const req = { method: 'GET', url: '/api/config' };
    let jsonResult: any = null;
    const res: any = {
      json: (data: any) => {
        jsonResult = data;
      },
      status: (code: number) => res,
    };

    // Find and execute route handler
    const route = app._router.stack.find((layer: any) => layer.route && layer.route.path === '/api/config');
    assert.ok(route, 'GET /api/config route must be registered');

    await route.route.stack[0].handle(req, res);
    assert.ok(jsonResult, 'Route handler should produce JSON output');
    assert.ok('isConfigured' in jsonResult);
    assert.ok('supabaseUrl' in jsonResult);
    assert.ok('supabaseAnonKey' in jsonResult);
    assert.equal('serviceRole' in jsonResult, false);
  });

  test('GET /api/supabase/health handles unconfigured state safely', async () => {
    const req = { method: 'GET', url: '/api/supabase/health' };
    let jsonResult: any = null;
    let statusCode = 200;
    const res: any = {
      json: (data: any) => {
        jsonResult = data;
      },
      status: (code: number) => {
        statusCode = code;
        return res;
      },
    };

    const route = app._router.stack.find((layer: any) => layer.route && layer.route.path === '/api/supabase/health');
    assert.ok(route, 'GET /api/supabase/health route must be registered');

    await route.route.stack[0].handle(req, res);
    assert.ok(jsonResult, 'Health check should return JSON response');
    assert.equal(statusCode, 200);
    assert.ok('status' in jsonResult);
    assert.ok('isConnected' in jsonResult);
  });
});
