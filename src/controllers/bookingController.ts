import express, { Request, Response } from 'express';
import { Customer } from '../models/customer.model';
import { TableBooking } from '../models/tableBooking.model';
import { FunctionBooking } from '../models/functionBooking.model';
import { HotelBooking } from '../models/hotelBooking.model';

module.exports = {
  bookTable: async (req: Request, res: Response) => {
    try {
      // Write business logic for booking a table here
      const { firstName, lastName, email, phone } = req.body.customer;
      const {
        tableNumber,
        bookingDate,
        timeSlot,
        numberOfGuests,
        specialRequests,
      } = req.body;
      // date to compare chronological time.
      const now = Date.now();

      const customer = await Customer.findOne({
        email: email,
      });

      if (!customer) {
        const customer = await Customer.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        });

        await TableBooking.create({
          customer: customer.id,
          bookingDate: bookingDate,
          tableNumber: tableNumber,
          timeSlot: timeSlot,
          numberOfGuests: numberOfGuests,
          specialRequests: specialRequests,
        });
      } else {
        if (customer.firstName !== firstName) {
          return res.status(410).json({
            message: `Email already exists.`,
          });
        }

        const tableBooking = await TableBooking.findOne({
          customer: customer.id,
        });

        if (!tableBooking) {
          await TableBooking.create({
            customer: customer.id,
            bookingDate: bookingDate,
            tableNumber: tableNumber,
            timeSlot: timeSlot,
            numberOfGuests: numberOfGuests,
            specialRequests: specialRequests,
          });
        } else {
          const tableBookingDate = tableBooking.bookingDate;
          const bookingTimestamp = new Date(tableBookingDate).getTime();

          if (bookingTimestamp > now) {
            return res
              .status(409)
              .json({ message: 'You already have a table booking coming up.' });
          }
        }
      }

      return res.status(200).json({ message: 'Successfully booked a table.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error booking table', error });
    }
  },

  bookHotelRoom: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone } = req.body.customer;
      const { bookingDate, timeSlot, message } = req.body;
      const now = Date.now();
      let customer;

      customer = await Customer.findOne({
        email: email,
      });

      if (!customer) {
        customer = await Customer.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        });

        await HotelBooking.create({
          customer: customer.id,
          bookingDate: bookingDate,
          timeSlot: timeSlot,
          message: message,
        });
      } else {
        if (customer.firstName !== firstName) {
          return res.status(410).json({ message: 'Email already exists.' });
        }

        const hotelBooking = await HotelBooking.findOne({
          customer: customer.id,
        });

        if (!hotelBooking) {
          await HotelBooking.create({
            customer: customer.id,
            bookingDate: bookingDate,
            timeSlot: timeSlot,
            message: message,
          });
        } else if (hotelBooking) {
          const hotelBookingDate = hotelBooking.bookingDate;
          const bookingDateTimestamp = new Date(hotelBookingDate).getTime();

          if (bookingDateTimestamp > now) {
            return res.status(409).json({
              message: 'You already have a hotel room booking coming up.',
            });
          }
        }
      }

      return res
        .status(200)
        .json({ message: 'Successfully booked a hotel room.' });
    } catch (error) {
      return res.status(500).json({ message: 'error booking hotel room' });
    }
  },

  bookFunctionRoom: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone } = req.body.customer;
      const { preferredArea, message, bookingDate, timeSlot } = req.body;
      const now = Date.now();

      const customer = await Customer.findOne({
        email: email,
      });

      if (!customer) {
        const customer = await Customer.create({
          firstName,
          lastName,
          email,
          phone,
        });

        await FunctionBooking.create({
          customer: customer.id,
          preferredArea: preferredArea,
          message: message,
          bookingDate: bookingDate,
          timeSlot: timeSlot,
        });
      } else {
        if (customer.firstName !== firstName) {
          return res.status(410).json({ message: 'Email already exists.' });
        }

        const functionBooking = await FunctionBooking.findOne({
          customer: customer.id,
        });

        if (!functionBooking) {
          await FunctionBooking.create({
            customer: customer.id,
            preferredArea: preferredArea,
            message: message,
            bookingDate: bookingDate,
            timeSlot: timeSlot,
          });
        } else {
          const functionBookingDate = functionBooking.bookingDate;
          const bookingTimestamp = new Date(functionBookingDate).getTime();

          if (bookingTimestamp > now) {
            return res.status(409).json({
              message: 'You already have a function room booking coming up.',
            });
          }
        }
      }

      return res
        .status(200)
        .json({ message: 'Successfully booked a function room.' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error booking function room', error });
    }
  },
};
