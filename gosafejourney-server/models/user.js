import mongoose, { Schema } from 'mongoose';

const guestSchema = mongoose.Schema({
  salutation: String,
  fullName: String,
  isBelow12Years: {
    type: Boolean,
    default: false,
  },
});

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  birthDate: { type: Date },
  gender: String,
  maritialStatus: String,
  imageUrl: String,
  guests: [guestSchema],
  salutation: String,
  gst: String,
  registrationNo: String,
  company: String,
  companyAddress: String,
  propertyBookings: [{ type: Schema.Types.ObjectId, ref: "PropertyBooking" }],
  property: { type: Schema.Types.ObjectId, ref: "Property" },
  isGoSafeJourneyPartner: {
    type: Boolean,
    default: false
  },
  isPropertyListingComplete: {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model('User', userSchema);

export default User;