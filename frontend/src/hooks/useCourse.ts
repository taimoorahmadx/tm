import { useState, useCallback } from 'react';
import { useApi } from './useApi';

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  transcript?: string;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  tutor: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  videos: Video[];
  enrolledStudents: string[];
  category: string;
  tags: string[];
  rating: number;
  totalRatings: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useCourse = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = useCallback(async (courseData: Partial<Course>) => {
    setLoading(true);
    setError(null);
    try {
      const course = await api.post('/api/courses', courseData);
      return course;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateCourse = useCallback(async (courseId: string, courseData: Partial<Course>) => {
    setLoading(true);
    setError(null);
    try {
      const course = await api.patch(`/api/courses/${courseId}`, courseData);
      return course;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/courses/${courseId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const uploadThumbnail = useCallback(async (courseId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      const response = await api.post(`/api/courses/${courseId}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.thumbnailUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload thumbnail');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const addVideo = useCallback(async (courseId: string, videoData: { title: string; description: string; file: File }) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      formData.append('video', videoData.file);
      const video = await api.post(`/api/courses/${courseId}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return video;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getCourses = useCallback(async (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get(`/api/courses?${queryParams.toString()}`);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getCourseById = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const course = await api.get(`/api/courses/${courseId}`);
      return course;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const enrollInCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/api/courses/${courseId}/enroll`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return {
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadThumbnail,
    addVideo,
    getCourses,
    getCourseById,
    enrollInCourse,
  };
}; 