const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const propertyRoutes = require('./routes/propertyRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Accommodation Onboarding API', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [Lamp Onboarding Backend] Server running on http://localhost:${PORT}`);
  });
});
