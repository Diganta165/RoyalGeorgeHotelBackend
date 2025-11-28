import express from 'express';
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/book-table', bookingController.bookTable);

router.post('/book-hotel-room', bookingController.bookHotelRoom);

router.post('/book-function-room', bookingController.bookFunctionRoom);

// test route
router.post('/book-test', bookingController.bookFunctionRoom);

module.exports = router;
