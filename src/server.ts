const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 4000;

// Routes
const bookingRoutes = require('../routes/bookingRoutes');

const startServer = async () => {
  try {
    // ✅ Jest sets NODE_ENV=test *before* this file executes
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connecting to DB in environment:', process.env.NODE_ENV);
      await connectDB();
    } else {
      console.log('Running in test mode — skipping DB connection');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Bootstrap failed:', err);
    process.exit(1);
  }
};

// ✅ Run only if not imported (e.g., by Jest)
if (require.main === module) {
  startServer();
}
