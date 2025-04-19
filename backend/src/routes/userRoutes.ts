import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';
import {
  register,
  login,
  updateProfile,
  uploadProfilePicture,
  getProfile
} from '../controllers/userController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.post('/profile/picture', auth, upload.single('picture'), uploadProfilePicture);

export default router; 