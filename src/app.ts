import express from 'express';
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(express.json());
app.use('/api/booking', bookingRoutes);

export default app;
