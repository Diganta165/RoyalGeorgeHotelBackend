import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const tableBookingSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    tableNumber: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    numberOfGuests: { type: Number, required: true },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

export const TableBooking = model('TableBooking', tableBookingSchema);
