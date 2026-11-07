import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load local environment files if present
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 3000) : 3000;

app.use(express.json());

/**
 * Helper to retrieve Supabase public credentials from server environment.
 * Checks both standard and VITE_ prefixed environment variables.
 * STRICTLY NO service-role or secret keys are read or returned.
 */
function getSupabaseServerConfig() {
  let url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || null;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || null;

  if (url) {
    // Normalize: strip accidental trailing /rest/v1 or /rest/v1/ to keep canonical project base URL
    url = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  }

  const isConfigured = Boolean(url && url.trim() && anonKey && anonKey.trim());

  return {
    supabaseUrl: isConfigured ? url : null,
    supabaseAnonKey: isConfigured ? anonKey : null,
    isConfigured,
  };
}

/**
 * GET /api/config
 * Returns only the public Supabase URL and Publishable/Anon key.
 */
app.get('/api/config', (_req, res) => {
  const config = getSupabaseServerConfig();
  res.json({
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: config.supabaseAnonKey,
    isConfigured: config.isConfigured,
  });
});

/**
 * GET /api/supabase/health
 * Read-only connectivity health check against the Supabase backend.
 * Does not read or write user data or alter tables.
 */
app.get('/api/supabase/health', async (_req, res) => {
  const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseServerConfig();

  if (!isConfigured || !supabaseUrl || !supabaseAnonKey) {
    return res.status(200).json({
      status: 'unconfigured',
      message: 'Supabase credentials not configured in server environment variables.',
      isConnected: false,
    });
  }

  try {
    // Use the Auth health endpoint which is public and accessible with publishable key
    const endpoint = `${supabaseUrl}/auth/v1/health`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    res.status(200).json({
      status: response.ok ? 'reachable' : 'error_response',
      httpStatus: response.status,
      statusText: response.statusText,
      isConnected: response.ok,
    });
  } catch (error: any) {
    res.status(200).json({
      status: 'network_failure',
      error: error?.message || 'Network request failed',
      isConnected: false,
    });
  }
});

/**
 * Mount Vite in dev mode or serve static build in production
 */
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CadetVerse] Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Start server only when executed directly as the process entrypoint
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMainModule && process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('[CadetVerse] Failed to start server:', err);
    process.exit(1);
  });
}

export { app, getSupabaseServerConfig, startServer };
