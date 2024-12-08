import mongoose from 'mongoose';
import User from '../models/user.js';
import PropertyBooking from '../models/propertyBooking.js';
import Room from '../models/room.js';
import Property from '../models/property.js';
import { sendInvoiceEmail } from '../functions/sendMail.js';

export const updatePropertyBooking = async (req, res) => {
	const { id: _id } = req.params;
	const propertyBooking = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('No propertyBooking with that id');

	const updatedPropertyBooking = await PropertyBooking.findByIdAndUpdate(_id, propertyBooking, {
		new: true,
	});

	res.json(updatedPropertyBooking);
};

export const addPropertyBooking = async (req, res) => {
	const {formData, names, ...propertyBooking} = req.body;

	try {
		const newPropertyBooking = new PropertyBooking({
			...propertyBooking,
		});
		newPropertyBooking.guests = names;
		newPropertyBooking.guestData = formData;
		await newPropertyBooking.save();
		const clientMail = await User.findOne({ _id: req.body.clientId }).select('email');
		const partnerMail = await Room.findById(req.body.roomId)
			.populate({
				path: 'propertyId',
				populate: {
					path: 'ownerId',
					select: 'email',
				},
			})
			.exec();

		sendInvoiceEmail(clientMail.email, partnerMail.email, {
			bookingId: newPropertyBooking._id,
			noBookedRooms: newPropertyBooking.noBookedRooms,
		});
		res.status(201).json(newPropertyBooking);
	} catch (error) {
		console.log(error);
		res.status(409).json({ message: error.message });
	}
};

export const getPropertyBooking = async (req, res) => {
	const { id } = req.params;

	try {
		/* const propertyBooking = await PropertyBooking.findById(id).populate({
			path: 'roomId',
			populate: {
				path: 'propertyId',
			},
		}); */
		const propertyBooking = await PropertyBooking.findById(id)
			.populate({
				path: 'roomId',
				select: 'noGuestsInRoom price',
				populate: {
					path: 'propertyId',
					select: 'propertyName propertyType city rating about propertyImages',
				},
			})
			.select('bookingStatus checkInDate checkOutDate noBookedRooms noGuestsInRoom amount reviewed');
		res.status(200).json(propertyBooking);
	} catch (error) {
		res.status(404).json({ error });
	}
};

export const getPropertyBookings = async (req, res) => {
	const userId  = req.userId;
	const { page, checkInDate,checkOutDate } = req.query;

	try {
		// const LIMIT = 8;
		// const startIndex = (Number(page) - 1) * LIMIT;
		// const total = await PropertyBooking.countDocuments({});
		// const propertyBookings = await PropertyBooking.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

		// res.status(200).json({ data: propertyBookings, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
		const propertyBookings = await PropertyBooking.find({ clientId: userId });
		res.status(200).json(propertyBookings);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getFinance = async (req, res) => {
	const { rows, page, dateString } = req.query;
	let ownerId = req.userId;

	try {
		const date = new Date(dateString);
		const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
		const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		const startIndex = Number(page) * rows;

		const matchQuery = {
			checkInDate: {
				$gte: startOfMonth,
				$lte: endOfMonth,
			},
		};

		const totalQuery = { ...matchQuery };

		if (ownerId) {
			totalQuery['property.ownerId'] = new mongoose.Types.ObjectId(ownerId);
		}

		const total = await PropertyBooking.countDocuments(totalQuery);

		const bookings = await PropertyBooking.aggregate([
			{
				$match: {
					checkInDate: {
						$gte: startOfMonth,
						$lte: endOfMonth,
					},
				},
			},
			{
				$lookup: {
					from: 'rooms',
					localField: 'roomId',
					foreignField: '_id',
					as: 'room',
				},
			},
			{
				$unwind: '$room',
			},
			{
				$lookup: {
					from: 'properties',
					localField: 'room.propertyId',
					foreignField: '_id',
					as: 'property',
				},
			},
			{
				$unwind: '$property',
			},
			{
				$lookup: {
					from: 'users',
					localField: 'clientId',
					foreignField: '_id',
					as: 'clientDetails',
				},
			},
			{
				$unwind: '$clientDetails',
			},
			{
				$project: {
					orderId: 1,
					bookingId: 1,
					amount: 1,
					checkInDate: 1,
					bookingStatus: 1,
					createdAt: 1,
					propertyName: '$property.propertyName',
					ownerId: '$property.ownerId',
					clientDetails : '$clientDetails'
				},
			},
			{
				$match: ownerId
					? {
							$expr: { $eq: ['$ownerId', new mongoose.Types.ObjectId(ownerId)] },
					  }
					: {},
			},
			{
				$sort: {
					_id: -1,
				},
			},
			{
				$skip: startIndex,
			},
			{
				$limit: Number(rows),
			},
		]);

		res.status(200).json({
			data: bookings,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / Number(rows)),
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const addReview = async (req, res) => {
	const { id } = req.params;
	const { rating, feedback } = req.body;

	try {
		const bookings = await PropertyBooking.findById(id).populate('roomId');
		if (bookings) {
			bookings.reviewed = true;
			await bookings.save();
		}

		const property = await Property.findById(bookings.roomId.propertyId);
		if (property) {
			property.reviews.push({
				rating,
				feedback,
				reviewer: req.userId,
			});
			await property.save();
		}

		res.status(200).json({
			message: 'Review added successfully',
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
}

export const getReviews = async (req, res) => {
	try {
		const property = await Property.find({ownerId: req.userId})
		.populate({
			path: 'reviews',
			populate: {
				path: 'reviewer',
				select: 'fullName',
			},
		}).select('reviews');

		//extract review from all properties
		const reviews = property.map((prop) => prop.reviews).flat();

		res.status(200).json({ data: reviews });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
}