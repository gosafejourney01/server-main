import mongoose from "mongoose";
import Room from "../models/room.js";

export const updateRoom = async (req, res) => {
  const { id: _id } = req.params;
  const room = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No room with that id');

  const updatedRoom = await Room.findByIdAndUpdate(_id, room, { new: true });

  res.json(updatedRoom);
}

export const addRoom = async (req, res) => {
  const room = req.body;
  const newRoom = new Room({ ...room, createdAt: new Date().toISOString() });

  try {
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const deleteRoom = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No room with that id');

  await Room.findByIdAndDelete(_id);

  res.json({ message: 'Room deleted successfully' });
}

export const  getRooms = async (req, res) => {
  const rooms = [];
  try {
    for (let i = 0; i < req.body.roomId.length; i++) {
      const room = await Room.findById(req.body.roomId[i]).populate({
        path: 'propertyId',
        // select: 'propertyName'
      });
      rooms.push(room);
    }
    res.status(200).json(rooms);
  } catch (error) {
    res.status(404).json({ error });
  }
}

export const getRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ error });
  }
}
