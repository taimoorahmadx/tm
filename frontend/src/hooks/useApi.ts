import { useAuth } from '../context/AuthContext';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const useApi = () => {
  const { token } = useAuth();

  const api = async (endpoint: string, options: ApiOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options;

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    });

    if (requireAuth && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  return {
    get: (endpoint: string, options?: ApiOptions) =>
      api(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, data?: any, options?: ApiOptions) =>
      api(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }),
    put: (endpoint: string, data?: any, options?: ApiOptions) =>
      api(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    patch: (endpoint: string, data?: any, options?: ApiOptions) =>
      api(endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (endpoint: string, options?: ApiOptions) =>
      api(endpoint, { ...options, method: 'DELETE' }),
  };
}; 