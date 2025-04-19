import { Request, Response } from 'express';
import { Chat } from '../models/Chat';
import { Course } from '../models/Course';

export const getChatByCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let chat = await Chat.findOne({ course: req.params.courseId })
      .populate('messages.sender', 'firstName lastName profilePicture')
      .populate('participants', 'firstName lastName profilePicture');

    if (!chat) {
      // Create new chat if it doesn't exist
      chat = new Chat({
        course: req.params.courseId,
        participants: [course.tutor, ...course.enrolledStudents],
        messages: []
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findOne({ course: req.params.courseId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = {
      sender: req.user._id,
      content,
      timestamp: new Date(),
      isRead: false
    };

    chat.messages.push(message);
    await chat.save();

    // Emit the message to all connected clients in the course room
    req.app.get('io').to(req.params.courseId).emit('newMessage', {
      ...message,
      sender: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        profilePicture: req.user.profilePicture
      }
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({ course: req.params.courseId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all unread messages as read for the current user
    chat.messages.forEach(message => {
      if (!message.isRead && message.sender.toString() !== req.user._id.toString()) {
        message.isRead = true;
      }
    });

    await chat.save();
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

export const getUnreadMessageCount = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({ course: req.params.courseId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const unreadCount = chat.messages.filter(
      message => !message.isRead && message.sender.toString() !== req.user._id.toString()
    ).length;

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error getting unread message count' });
  }
}; 