import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { uploadToS3, deleteFromS3 } from '../utils/s3';
import { generateTranscript } from '../utils/transcription';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    const course = new Course({
      ...courseData,
      tutor: req.user._id
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const course = await Course.findOne({
      _id: req.params.id,
      tutor: req.user._id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    Object.keys(updates).forEach(update => {
      course[update] = updates[update];
    });

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      tutor: req.user._id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete course thumbnail from S3
    if (course.thumbnailUrl) {
      await deleteFromS3(course.thumbnailUrl);
    }

    // Delete course videos from S3
    for (const video of course.videos) {
      if (video.url) {
        await deleteFromS3(video.url);
      }
      if (video.thumbnailUrl) {
        await deleteFromS3(video.thumbnailUrl);
      }
    }

    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};

export const uploadCourseThumbnail = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const course = await Course.findOne({
      _id: req.params.id,
      tutor: req.user._id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete old thumbnail if exists
    if (course.thumbnailUrl) {
      await deleteFromS3(course.thumbnailUrl);
    }

    const fileUrl = await uploadToS3(req.file, 'course-thumbnails');
    course.thumbnailUrl = fileUrl;
    await course.save();

    res.json({ thumbnailUrl: course.thumbnailUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading thumbnail' });
  }
};

export const addVideo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const course = await Course.findOne({
      _id: req.params.id,
      tutor: req.user._id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Upload video to S3
    const videoUrl = await uploadToS3(videoFile, 'course-videos');

    // Generate thumbnail (you might want to implement this)
    const thumbnailUrl = ''; // TODO: Implement thumbnail generation

    // Add video to course
    course.videos.push({
      title,
      description,
      url: videoUrl,
      thumbnailUrl,
      duration: 0, // TODO: Implement duration calculation
      order: course.videos.length
    });

    await course.save();
    res.json(course.videos[course.videos.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video' });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query: any = { isPublished: true };

    if (search) {
      query.$text = { $search: search as string };
    }

    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate('tutor', 'firstName lastName profilePicture')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'firstName lastName profilePicture bio')
      .populate('enrolledStudents', 'firstName lastName profilePicture');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
};

export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course' });
  }
}; 