import express from 'express';
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/table-booking', bookingController.bookTable);

router.post('/hotel-booking', bookingController.bookHotelRoom);

router.post('/function-booking', bookingController.bookFunctionRoom);
