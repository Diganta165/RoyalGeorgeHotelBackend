import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    tableBookings: [{ type: Schema.Types.ObjectId, ref: 'TableBooking' }],
    hotelBookings: [{ type: Schema.Types.ObjectId, ref: 'HotelBooking' }],
    functionBookings: [{ type: Schema.Types.ObjectId, ref: 'FunctionBooking' }],
  },
  { timestamps: true }
);

export const Customer = model('Customer', customerSchema);
