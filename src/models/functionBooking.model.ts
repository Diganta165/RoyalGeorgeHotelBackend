import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const functionBookingSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    preferredArea: { type: String, required: true },
    message: { type: String },
    bookingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
  },
  { timestamps: true }
);

export const FunctionBooking = model('FunctionBooking', functionBookingSchema);
