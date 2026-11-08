const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spendly';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Connect to MongoDB with graceful local fallback if Atlas IP is blocked
const LOCAL_URI = 'mongodb://127.0.0.1:27017/spendly';
let server;

async function startServer() {
  try {
    console.log(`Connecting to MongoDB (${MONGO_URI.includes('mongodb+srv') ? 'Atlas' : 'Local'})...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB (Primary)');
  } catch (err) {
    console.error('Primary MongoDB connection error:', err.message);
    if (MONGO_URI !== LOCAL_URI) {
      console.log('Attempting fallback to local MongoDB...');
      try {
        await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 3000 });
        console.log('Connected to Local MongoDB (Fallback)');
      } catch (localErr) {
        console.error('Local MongoDB fallback also failed:', localErr.message);
      }
    }
  }

  if (process.env.NODE_ENV !== 'test' && !server) {
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer();

module.exports = { app, mongoose };
