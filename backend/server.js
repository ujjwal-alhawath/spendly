const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5005;
const LOCAL_URI = 'mongodb://127.0.0.1:27017/spendly';

// Helper to reliably read MongoDB URI with sanitization
function getMongoUri() {
  const raw = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (raw && typeof raw === 'string') {
    return raw.trim().replace(/^["']|["']$/g, '');
  }
  return null;
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB connection cache across serverless warm invocations
let cachedPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const configuredUri = getMongoUri();

  if (!configuredUri) {
    if (process.env.VERCEL) {
      throw new Error(
        'MONGO_URI is missing in Vercel Environment Variables. Please add MONGO_URI in spendly-ba2z -> Settings -> Environment Variables, and then redeploy.'
      );
    }
  }

  const targetUri = configuredUri || LOCAL_URI;

  if (!cachedPromise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };

    console.log(`Connecting to MongoDB (${targetUri.includes('mongodb+srv') ? 'Atlas' : 'Local'})...`);
    cachedPromise = mongoose.connect(targetUri, opts)
      .then((m) => {
        console.log('Connected to MongoDB (Primary)');
        return m.connection;
      })
      .catch(async (err) => {
        console.error('Primary MongoDB connection error:', err.message);
        cachedPromise = null;
        // Fallback to local MongoDB only when running locally, never on Vercel
        if (targetUri !== LOCAL_URI && !process.env.VERCEL) {
          console.log('Attempting fallback to local MongoDB...');
          return mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 3000 })
            .then((m) => {
              console.log('Connected to Local MongoDB (Fallback)');
              return m.connection;
            })
            .catch((localErr) => {
              console.error('Local MongoDB fallback also failed:', localErr.message);
              throw localErr;
            });
        }
        throw err;
      });
  }

  try {
    await cachedPromise;
  } catch (err) {
    cachedPromise = null;
    throw err;
  }

  return mongoose.connection;
}

// Middleware to ensure DB connection before handling API requests
app.use(async (req, res, next) => {
  // Allow root and health check to respond immediately even if DB is still connecting
  if (req.path === '/' || req.path === '/api/health' || req.path === '/health') {
    if (mongoose.connection.readyState === 0 && !cachedPromise) {
      connectToDatabase().catch(() => {});
    }
    return next();
  }

  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error in request middleware:', error.message);
    return res.status(503).json({
      error: 'Database connection failed',
      details: error.message,
      hint: 'Ensure MongoDB Atlas Network Access has 0.0.0.0/0 whitelisted and MONGO_URI is set in Vercel.',
    });
  }
});

// Root informational endpoint
app.get('/', (req, res) => {
  const configuredUri = getMongoUri();
  res.json({
    name: 'Spendly API',
    status: 'online',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mongoUriConfigured: Boolean(configuredUri),
    databaseType: configuredUri && configuredUri.includes('mongodb+srv') ? 'Atlas' : (configuredUri ? 'Custom' : 'None'),
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      expenses: '/api/expenses',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
const healthHandler = (req, res) => {
  const configuredUri = getMongoUri();
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mongoUriConfigured: Boolean(configuredUri),
    databaseType: configuredUri && configuredUri.includes('mongodb+srv') ? 'Atlas' : (configuredUri ? 'Custom' : 'None'),
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
    timestamp: new Date().toISOString(),
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Catch-all 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl || req.url,
  });
});

// Standalone server initialization for local development
let server;
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  connectToDatabase().catch((err) => {
    console.error('Initial DB connection attempt failed:', err.message);
  });

  server = app.listen(PORT, () => {
    console.log(`Spendly backend running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.app = app;
module.exports.mongoose = mongoose;
module.exports.connectToDatabase = connectToDatabase;
module.exports.getMongoUri = getMongoUri;
