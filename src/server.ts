const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
import connectDB from './config/db';

dotenv.config();

export const app = express();

// Routes
const bookingRoutes = require('../routes/bookingRoutes');

(async () => {
  try {
    app.use('/api/booking', bookingRoutes);
    app.use(express.json());

    // Connect to MongoDB
    await connectDB();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('DB Bootstrap Failed: ', error);
  }
})();
