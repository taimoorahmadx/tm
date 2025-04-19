import express from 'express';
import { auth } from '../middleware/auth';
import {
  getChatByCourse,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessageCount
} from '../controllers/chatController';

const router = express.Router();

// All chat routes require authentication
router.use(auth);

router.get('/course/:courseId', getChatByCourse);
router.post('/course/:courseId/messages', sendMessage);
router.patch('/course/:courseId/messages/read', markMessagesAsRead);
router.get('/course/:courseId/messages/unread', getUnreadMessageCount);

export default router; 