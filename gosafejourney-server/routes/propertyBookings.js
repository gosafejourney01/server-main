import express from 'express';
import auth from '../middleware/auth.js';
import { addPropertyBooking, updatePropertyBooking, getPropertyBooking, getPropertyBookings, getFinance, addReview, getReviews } from '../controllers/propertyBooking.js';

const router = express.Router();

router.get('/finance/', auth, getFinance);
router.patch('/:id', auth, updatePropertyBooking);
router.post('/', auth, addPropertyBooking);
router.get('/:id', auth, getPropertyBooking);
router.get('/', auth, getPropertyBookings);

router.post('/reviews/:id', auth, addReview);
router.get('/reviews/get', auth, getReviews); 
/* router.patch('/review', auth, updateReview); */

export default router;