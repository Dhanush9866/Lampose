/**
 * CORS allowlist.
 *
 * The API is no longer open to every origin: only the Lampose front ends may
 * call it from a browser. Extra origins can be added per environment through
 * `CORS_ALLOWED_ORIGINS` (comma separated) without touching this file, which is
 * how staging or preview hosts get in.
 */

/** Compare on the origin alone — scheme + host + port, no trailing slash, no case. */
const normalize = (origin) => String(origin || '').trim().replace(/\/+$/, '').toLowerCase();

// Deployed front ends.
const PRODUCTION_ORIGINS = [
  'https://onboard.lampose.com', // Employee onboarding app
  'https://lampose.com',
  'https://www.lampose.com',
];

// Vite dev servers — the onboarding app and the admin console.
const DEVELOPMENT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(normalize)
  .filter(Boolean);

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  ...new Set([
    ...PRODUCTION_ORIGINS.map(normalize),
    ...envOrigins,
    ...(isProduction ? [] : DEVELOPMENT_ORIGINS.map(normalize)),
  ]),
];

const corsOptions = {
  origin(origin, callback) {
    // Same-origin requests, curl, and server-to-server calls such as the Twilio
    // webhooks send no Origin header. CORS is a browser control, so those are
    // never the thing it protects against — let them through untouched.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(normalize(origin))) return callback(null, true);

    // Answer without the CORS headers rather than throwing: the browser blocks
    // the response either way, and the server log stays readable.
    console.warn(`🚫 [CORS Blocked] Origin "${origin}" is not on the allowlist.`);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Correlation-ID',
    'x-employee-email', // Identifies the field agent on gated writes
    'x-user-email',
  ],
  credentials: true,
  maxAge: 86400, // Cache the preflight for a day
  optionsSuccessStatus: 204,
};

module.exports = { corsOptions, allowedOrigins };
