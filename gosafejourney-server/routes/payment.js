import express from 'express';
import { payment } from '../controllers/payment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, payment);

export default router;