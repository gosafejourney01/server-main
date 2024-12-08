import express from "express";
import auth from '../middleware/auth.js';
import { signin, signup, updateUser, verify, getUser, forgotPassword, resetPassword } from "../controllers/user.js";

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/:id', auth, updateUser);
router.post('/verify', verify);
router.get('/:id', getUser);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router;