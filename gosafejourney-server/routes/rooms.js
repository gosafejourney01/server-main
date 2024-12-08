import express from 'express';
import auth from '../middleware/auth.js';
import { addRoom, deleteRoom, updateRoom, getRooms, getRoom } from '../controllers/rooms.js';

const router = express.Router();

router.post('/get', getRooms);
router.patch('/:id', auth, updateRoom);
router.post('/', auth, addRoom);
router.delete('/:id', auth, deleteRoom);
router.get('/:id', auth, getRoom);
export default router;
