/**
 * CORS matching for the API.
 *
 * The allowlist itself lives in `server.js`, so the domains that may call this
 * API are visible in one obvious place. This module only decides whether a
 * given Origin is on that list.
 */

/** Compare on the origin alone — scheme + host + port, no trailing slash, no case. */
const normalize = (origin) => String(origin || '').trim().replace(/\/+$/, '').toLowerCase();

/**
 * Build the options object for the `cors` middleware.
 *
 * @param {string[]} origins Allowed browser origins, declared in server.js.
 * Extra origins can be added per environment through `CORS_ALLOWED_ORIGINS`
 * (comma separated), which is how staging or preview hosts get in without a
 * code change.
 */
const createCorsOptions = (origins = []) => {
  const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(normalize)
    .filter(Boolean);

  const allowedOrigins = [...new Set([...origins.map(normalize), ...envOrigins])];

  const corsOptions = {
    origin(origin, callback) {
      // Same-origin requests, curl, and server-to-server calls such as the
      // Twilio webhooks send no Origin header. CORS is a browser control, so
      // those are never what it protects against — let them through untouched.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(normalize(origin))) return callback(null, true);

      // Answer without the CORS headers rather than throwing: the browser
      // blocks the response either way, and the server log stays readable.
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

  return { corsOptions, allowedOrigins };
};

module.exports = { createCorsOptions, normalize };
