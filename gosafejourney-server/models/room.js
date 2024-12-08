import mongoose, { Schema } from 'mongoose';

const bedDetailSchema = mongoose.Schema({
	bedType: {
		type: String,
		required: true,
		trim: true,
	},
	noBeds: {
		type: Number,
		required: true,
	},
});

const roomSchema = mongoose.Schema(
	{
		propertyId: {
			type: Schema.Types.ObjectId,
			ref: 'Property',
		},
		roomName: {
			type: String,
			required: true,
			trim: true,
		},
		roomType: {
			type: String,
			required: true,
			trim: true,
		},
		smoking: {
			type: String,
			required: true,
			trim: true,
		},
		noRooms: {
			type: Number,
			required: true,
		},
		bedDetails: [bedDetailSchema],
		noGuestsInRoom: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		images: [String],
	},
	{
		timestamps: true,
	}
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
