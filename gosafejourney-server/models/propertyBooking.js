import mongoose from 'mongoose';

const guestDataSchema = mongoose.Schema({
	salutation: String,
	firstName: String,
	lastName: String,
	email: String,
	phone: String,
	gst: Boolean,
	registrationNo: String,
	company: String,
	companyAddress: String,
  });

const propertyBookingSchema = mongoose.Schema(
	{
		paymentId: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
			required: true,
		},
		signature: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		clientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		bookingStatus: {
			type: String,
			default: 'Active',
		},
		checkInDate: { type: Date, default: new Date() },
		checkOutDate: { type: Date, default: new Date() },
		roomId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Room',
			required: true,
		},
		noBookedRooms: {
			type: Number,
			required: true,
		},
		reviewed: {
			type: Boolean,
			default: false,
		},
		guestData: guestDataSchema,
		guests: [String]
	},
	{
		timestamps: true,
	}
);

const PropertyBooking = mongoose.model('PropertyBooking', propertyBookingSchema);

export default PropertyBooking;
