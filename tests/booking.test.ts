import request from 'supertest';
import { app } from '../src/server'; // Adjust the import based on your server file location
import { Customer } from '../src/models/customer.model';

describe('Booking Endpoints', () => {
  it('throws an error if email already exists', async () => {
    // First, create a customer with a specific email
    await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
    });

    const res = await request(app).post('/api/booking/book-table');
    // Attempt to create another customer with the same email
    expect(res.status).toBe(410);
    expect(res.body.message).toBe('Email already exists');

    const res = await request(app).post('/api/booking/book-hotel-room');

    expect(res.status).toBe(410);
    expect(res.body.message).toBe('Email already exists');

    const res = await request(app).post('/api/booking/book-function-room');

    expect(res.status).toBe(410);
    expect(res.body.message).toBe('Email already exists');
  });
});
