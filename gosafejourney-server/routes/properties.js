import express from 'express';
import auth from '../middleware/auth.js';
import { getProperties, getPropertiesBySearch, createProperty, getProperty, updateProperty, getPropertiesByUserId, updatePropertyByUserId } from '../controllers/properties.js';

const router = express.Router();

router.get('/', auth, getProperties);
router.get('/search', getPropertiesBySearch);
router.post('/', auth, createProperty);
router.get('/:id', getProperty);
router.patch('/:id', auth, updateProperty);
router.get('/user/:id', getPropertiesByUserId);
router.patch('/user/:id', updatePropertyByUserId);

export default router;