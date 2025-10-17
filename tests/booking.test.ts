import request from 'supertest';
import app from '../src/app'; // Adjust the import based on your server file location
import { Customer } from '../src/models/customer.model';

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
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        phone: '1234567890',
      });
    // Attempt to create another customer with the same email
    expect(tableBookingResponse.status).toBe(410);
    expect(tableBookingResponse.body.message).toBe('Email already exists');

    const hotelBookingResponse = await request(app).post(
      '/api/booking/book-hotel-room'
    );

    expect(hotelBookingResponse.status).toBe(410);
    expect(hotelBookingResponse.body.message).toBe('Email already exists');

    const functionRoomBookingResponse = await request(app).post(
      '/api/booking/book-function-room'
    );

    expect(functionRoomBookingResponse.status).toBe(410);
    expect(functionRoomBookingResponse.body.message).toBe(
      'Email already exists'
    );
  });
});
