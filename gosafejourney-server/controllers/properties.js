import mongoose from 'mongoose';
import Property from '../models/property.js';
import Room from '../models/room.js';
import { updateRoom } from './rooms.js';

export const getProperty = async (req, res) => {
	const { id } = req.params;
	try {
		const property = await Property.findById(id).populate('rooms').populate('propertyBookings');

		res.status(200).json({ ...property });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getProperties = async (req, res) => {
	const { page } = req.query;
	try {
		const LIMIT = 8;
		const startIndex = (Number(page) - 1) * LIMIT;
		const total = await Property.countDocuments({});
		const properties = await Property.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

		res.status(200).json({
			data: properties,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPropertiesBySearch = async (req, res) => {
	console.log('req query', req.query);
	try {
		const { location, checkInDate, checkOutDate, adults, kids, priceRange, stayTypes } = req.query;

		const query = {};
		if (location && location.toLowerCase() !== 'india') {
			query.city = { $regex: location, $options: 'i' };
		}

		if (stayTypes && Array.isArray(stayTypes)) {
			query.propertyType = { $in: stayTypes.map(type => new RegExp(type, 'i')) };
		}

		const properties = await Property.find(query).sort({ _id: -1 }).populate({
			path: 'reviews.reviewer',
			select: 'fullName',
		});

		const filteredProperties = await Promise.all(
			properties.map(async (property) => {
				let roomsQuery = { propertyId: property._id };
				if (priceRange) {
					roomsQuery.price = { $lte: priceRange };
				}

				const rooms = await Room.find(roomsQuery);

				if (rooms.length === 0) {
					return null; // Skip properties with no rooms within the price range
				}

				const minPrice = Math.min(...rooms.map((room) => room.price));
				return {
					...property.toObject(),
					price: minPrice,
				};
			})
		);

		const serializedProperties = filteredProperties.filter((property) => property !== null);

		res.status(200).json(serializedProperties);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: 'An error occurred.' });
	}
};

export const getPropertiesByUserId = async (req, res) => {
	const { id } = req.params;
	try {
		const properties = await Property.find({ ownerId: id });
		res.status(200).json(properties);
	} catch (error) {
		res.status(404).json({ error });
	}
};

export const updatePropertyByUserId = async (req, res) => {
	const { id } = req.params;
	try {
		const property = await Property.findByIdAndUpdate({ _id: id }, req.body, { new: true });
		res.status(200).json(property);
	} catch (error) {
		res.status(404).json({ error });
	}
};

export const createProperty = async (req, res) => {
	const property = req.body;
	const rooms = [];

	try {
		for (let i = 0; i < property.rooms.length; i++) {
			// Create each room and store it in the 'rooms' array
			const room = await Room.create({ ...property.rooms[i] });
			rooms.push(room._id);
		}

		const newProperty = new Property({ ...property, rooms: rooms });

		// Save the new property to the database
		await newProperty.save();

		// Assign the 'propertyId' to each room and update them in the database
		for (const roomId of rooms) {
			await Room.findByIdAndUpdate(roomId, { propertyId: newProperty._id });
		}

		res.status(201).json(newProperty);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const updateProperty = async (req, res) => {
	const { id: _id } = req.params;
	const property = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('No property with that id');

	const updatedProperty = await Property.findByIdAndUpdate(_id, property, { new: true });

	res.json(updatedProperty);
};
