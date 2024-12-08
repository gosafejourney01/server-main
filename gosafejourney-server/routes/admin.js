import express from 'express';
import { root } from '../controllers/admin.js';
import { updateDetails } from '../controllers/admin.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, root);
router.patch('/update',auth,  updateDetails);

export default router;