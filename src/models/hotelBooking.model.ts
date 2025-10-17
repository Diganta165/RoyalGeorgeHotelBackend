import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const hotelBookingSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    functionType: { type: String, required: true },
  },
  { timestamps: true }
);

export const HotelBooking = model('HotelBooking', hotelBookingSchema);
