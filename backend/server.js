const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

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

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/properties', propertyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log(`🩺 [Health Check] Ping received at ${new Date().toISOString()}`);
  res.json({ status: 'ok', service: 'Accommodation Onboarding API', timestamp: new Date() });
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
    console.log(`==================================================\n`);
  });
});
