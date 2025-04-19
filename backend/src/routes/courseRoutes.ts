import express from 'express';
import multer from 'multer';
import { auth, checkRole } from '../middleware/auth';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseThumbnail,
  addVideo,
  getCourses,
  getCourseById,
  enrollInCourse
} from '../controllers/courseController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', auth, checkRole(['tutor']), createCourse);
router.patch('/:id', auth, checkRole(['tutor']), updateCourse);
router.delete('/:id', auth, checkRole(['tutor']), deleteCourse);
router.post('/:id/thumbnail', auth, checkRole(['tutor']), upload.single('thumbnail'), uploadCourseThumbnail);
router.post('/:id/videos', auth, checkRole(['tutor']), upload.single('video'), addVideo);
router.post('/:id/enroll', auth, checkRole(['student']), enrollInCourse);

export default router; 