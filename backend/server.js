const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { createCorsOptions } = require('./config/cors');
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

const app = express();

/**
 * CORS ORIGIN ALLOWLIST
 *
 * Browser origins permitted to call this API. Add a deployed front end by
 * adding its domain here (scheme + host, no trailing path), or per environment
 * through CORS_ALLOWED_ORIGINS="https://a.com,https://b.com" in .env.
 */
const ALLOWED_ORIGINS = [
  'https://onboard.lampose.com', // Employee onboarding app
  'https://lampose.com',
  'https://www.lampose.com',

  // Local Vite dev servers — dropped automatically when NODE_ENV=production
  ...(process.env.NODE_ENV === 'production'
    ? []
    : [
        'http://localhost:5173', // Onboarding app
        'http://localhost:5174', // Admin console
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ]),
];

const { corsOptions, allowedOrigins } = createCorsOptions(ALLOWED_ORIGINS);

// Global Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const isError = res.statusCode >= 400;
    const statusIcon = isError ? '❌' : '✅';
    console.log(
      `🌐 [${timestamp}] ${statusIcon} ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`
    );
  });
  next();
});

// Middleware — browser traffic is restricted to the allowlisted front ends
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', statsRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/whatsapp', verificationRoutes);
app.use('/api/permissions', permissionRoutes);

// Health check endpoint — reports real database connectivity, not a static "ok".
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const READY_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    service: 'Accommodation Onboarding API',
    database: {
      state: READY_STATES[mongoose.connection.readyState] || 'unknown',
      name: mongoose.connection.name || null,
      connected: dbConnected,
    },
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5001;

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 [Lampose Backend API] Server running on port ${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   - POST   /api/properties/upload-image`);
    console.log(`   - POST   /api/properties/upload-images (Batch)`);
    console.log(`   - GET    /api/properties`);
    console.log(`   - POST   /api/properties`);
    console.log(`   - GET    /api/properties/:id`);
    console.log(`   - DELETE /api/properties/:id`);
    console.log(`   - GET    /api/permissions`);
    console.log(`   - GET    /api/permissions/access`);
    console.log(`   - POST   /api/permissions`);
    console.log(`   - PUT    /api/permissions/:id`);
    console.log(`🌍 CORS allowed origins:`);
    allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));
    console.log(`==================================================\n`);
  });
});

// Watch reloader trigger

