import request from 'supertest';
import app from '../src/app'; // Adjust the import based on your server file location
import { Customer } from '../src/models/customer.model';
import { TableBooking } from '../src/models/tableBooking.model';
import { FunctionBooking } from '../src/models/functionBooking.model';
import { HotelBooking } from '../src/models/hotelBooking.model';

// =====================================================
// BUSINESS RULES IMPLIED

// table & Function bookings = Hard time collision (hour-based)
// Hotel = Soft time collision (day-based accommodation)
// Minimum 1 day gap between bookings of any type.
// A customer cannot have more than one future booking of the same type.
// A customer cannot book two facilities at the same time.
// Email uniqueness across customers.
// =====================================================

// a customer is identified by his or her email address.

describe('Booking Endpoints', () => {
  it('throws an error if email already exists but is using different identification details', async () => {
    // First, create a customer with a specific email
    await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
    });

    const tableBookingResponse = await request(app)
      .post('/api/booking/book-table')
      .send({
        customer: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        tableNumber: 150,
        bookingDate: '2025-10-30T18:30:00.000Z',
        timeSlot: '6:30 PM - 8:30 PM',
        numberOfGuests: 5,
        specialRequests: 'Tablecloths for each guest.',
      });
    // Attempt to create another customer with the same email
    expect(tableBookingResponse.status).toBe(410);
    expect(tableBookingResponse.body.message).toBe(`Email already exists.`);

    const hotelBookingResponse = await request(app)
      .post('/api/booking/book-hotel-room')
      .send({
        customer: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        tableNumber: 150,
        bookingDate: '2025-10-30T18:30:00.000Z',
        timeSlot: '6:30 PM - 8:30 PM',
        numberOfGuests: 5,
        specialRequests: 'Tablecloths for each guest.',
      });

    expect(hotelBookingResponse.status).toBe(410);
    expect(hotelBookingResponse.body.message).toBe('Email already exists.');

    const functionRoomBookingResponse = await request(app)
      .post('/api/booking/book-function-room')
      .send({
        customer: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        tableNumber: 150,
        bookingDate: '2025-10-30T18:30:00.000Z',
        timeSlot: '6:30 PM - 8:30 PM',
        numberOfGuests: 5,
        message: '',
      });

    expect(functionRoomBookingResponse.status).toBe(410);
    expect(functionRoomBookingResponse.body.message).toBe(
      'Email already exists.'
    );
  });

  it('throws an error if a future booking already exists in the system for the customer.', async () => {
    // let's say a customer has already made a table booking,
    // a function booking,
    // and a hotel booking,
    // that will take place in two days.
    const now = Date.now();
    const twoDaysLater = new Date(now + 2 * 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(now + 3 * 24 * 60 * 60 * 1000);

    const customer = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
    });

    await TableBooking.create({
      customer: customer.id,
      tableNumber: 150,
      bookingDate: twoDaysLater.toISOString(),
      timeSlot: '6:30 PM - 8:30 PM',
      numberOfGuests: 5,
      specialRequests: 'Tablecloths for each guest.',
    });

    await FunctionBooking.create({
      customer: customer.id,
      preferredArea: 'East Wing',
      bookingDate: twoDaysLater.toISOString(),
      timeSlot: '6:30 PM - 8:30 PM',
      message: 'hello',
    });

    await HotelBooking.create({
      customer: customer.id,
      bookingDate: twoDaysLater.toISOString(),
      timeSlot: '6:30 PM - 8:30 PM',
      message: 'hello',
    });

    const tableBookingResponse = await request(app)
      .post('/api/booking/book-table')
      .send({
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        tableNumber: 151,
        bookingDate: threeDaysLater.toISOString(),
        timeSlot: '6:30 PM - 8:30 PM',
        numberOfGuests: 5,
        specialRequests: 'Tomato sauce',
      });

    expect(tableBookingResponse.status).toBe(409);
    expect(tableBookingResponse.body.message).toBe(
      'You already have a table booking coming up.'
    );

    const functionBookingResponse = await request(app)
      .post('/api/booking/book-function-room')
      .send({
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        preferredArea: 'West Wing',
        message: '',
        bookingDate: threeDaysLater.toISOString(),
        timeSlot: '6:30 PM - 8:30 PM',
      });

    expect(functionBookingResponse.status).toBe(409);
    expect(functionBookingResponse.body.message).toBe(
      'You already have a function room booking coming up.'
    );

    const hotelBookingResponse = await request(app)
      .post('/api/booking/book-hotel-room')
      .send({
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        bookingDate: threeDaysLater.toISOString(),
        timeSlot: '6:30 PM - 8:30 PM',
        message: '',
      });

    expect(hotelBookingResponse.status).toBe(409);
    expect(hotelBookingResponse.body.message).toBe(
      'You already have a hotel room booking coming up.'
    );
  });

  it('throws an error if a table booking and a function booking overlap in time, regardless of order.', async () => {
    const now = Date.now();
    const twoDaysLater = new Date(now + 2 * 24 * 60 * 60 * 1000);

    const customer = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
    });

    // First scenario: Table exists → Function attempt
    await TableBooking.create({
      customer: customer.id,
      tableNumber: 150,
      bookingDate: twoDaysLater,
      timeSlot: '6:30 PM - 8:30 PM',
      numberOfGuests: 4,
      specialRequests: '',
    });

    const functionAttempt = await request(app)
      .post('/api/booking/book-function-room')
      .send({
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        preferredArea: 'Garden View',
        bookingDate: twoDaysLater,
        timeSlot: '6:30 PM - 8:30 PM',
        message: '',
      });

    expect(functionAttempt.status).toBe(408);
    expect(functionAttempt.body.message).toBe(
      'cannot book two facilities at the same time.'
    );

    // Clear the DB between scenarios for correctness
    await TableBooking.deleteMany({});
    await FunctionBooking.deleteMany({});

    // Second scenario: Function exists → Table attempt
    await FunctionBooking.create({
      customer: customer.id,
      preferredArea: 'Main Hall',
      bookingDate: twoDaysLater,
      timeSlot: '6:30 PM - 8:30 PM',
      message: '',
    });

    const tableAttempt = await request(app)
      .post('/api/booking/book-table')
      .send({
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        tableNumber: 151,
        bookingDate: twoDaysLater,
        timeSlot: '6:30 PM - 8:30 PM',
        numberOfGuests: 2,
        specialRequests: '',
      });

    expect(tableAttempt.status).toBe(408);
    expect(tableAttempt.body.message).toBe(
      'cannot book two facilities at the same time.'
    );
  });

  it('throws an error if the customer tries to make a second booking within 1 day of an existing booking.', async () => {
    const now = Date.now();

    // Customer already made a booking for tomorrow
    const tomorrow = new Date(now + 1 * 24 * 60 * 60 * 1000);
    const inTwoDays = new Date(now + 2 * 24 * 60 * 60 * 1000);

    const customer = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
    });

    // Existing booking (e.g. table)
    await TableBooking.create({
      customer: customer.id,
      tableNumber: 150,
      bookingDate: tomorrow.toISOString(),
      timeSlot: '6:30 PM - 8:30 PM',
      numberOfGuests: 4,
      specialRequests: '',
    });

    // Attempt new booking within 1-day window → should be rejected
    const response = await request(app)
      .post('/api/booking/book-table')
      .send({
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          phone: '1234567890',
        },
        tableNumber: 151,
        bookingDate: inTwoDays.toISOString(), // 1 day after tomorrow = violates rest interval (needs 1 full day gap)
        timeSlot: '6:30 PM - 8:30 PM',
        numberOfGuests: 2,
        specialRequests: '',
      });

    expect(response.status).toBe(412);
    expect(response.body.message).toBe(
      'You must wait at least 1 day between bookings.'
    );
  });
});
