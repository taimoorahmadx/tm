import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useSocket } from '../context/SocketContext';

interface VideoProgress {
  videoId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  lastWatched: string;
}

export const useVideoProgress = (courseId: string, videoId: string) => {
  const api = useApi();
  const { socket } = useSocket();
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial progress
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/api/courses/${courseId}/videos/${videoId}/progress`);
        setProgress(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch video progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [api, courseId, videoId]);

  // Listen for real-time progress updates from other devices
  useEffect(() => {
    if (!socket) return;

    const handleProgressUpdate = (data: VideoProgress) => {
      if (data.videoId === videoId && data.courseId === courseId) {
        setProgress(data);
      }
    };

    socket.on('video:progress:update', handleProgressUpdate);

    return () => {
      socket.off('video:progress:update', handleProgressUpdate);
    };
  }, [socket, courseId, videoId]);

  const updateProgress = useCallback(async (newProgress: number) => {
    if (!progress) return;

    setLoading(true);
    setError(null);
    try {
      const updatedProgress = await api.post(`/api/courses/${courseId}/videos/${videoId}/progress`, {
        progress: newProgress,
        completed: newProgress >= 90, // Mark as completed if progress is 90% or more
      });

      setProgress(updatedProgress);

      // Emit progress update to other devices
      if (socket) {
        socket.emit('video:progress:update', {
          courseId,
          videoId,
          progress: newProgress,
          completed: newProgress >= 90,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update video progress');
    } finally {
      setLoading(false);
    }
  }, [api, socket, courseId, videoId, progress]);

  const markAsCompleted = useCallback(async () => {
    if (!progress) return;

    setLoading(true);
    setError(null);
    try {
      const updatedProgress = await api.post(`/api/courses/${courseId}/videos/${videoId}/progress`, {
        progress: 100,
        completed: true,
      });

      setProgress(updatedProgress);

      // Emit completion to other devices
      if (socket) {
        socket.emit('video:progress:update', {
          courseId,
          videoId,
          progress: 100,
          completed: true,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark video as completed');
    } finally {
      setLoading(false);
    }
  }, [api, socket, courseId, videoId, progress]);

  return {
    progress,
    loading,
    error,
    updateProgress,
    markAsCompleted,
  };
}; 