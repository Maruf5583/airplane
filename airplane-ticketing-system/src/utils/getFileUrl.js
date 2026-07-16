const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Converts a relative backend path (e.g. "/uploads/branding/logo.png")
 * into a full URL pointing at the backend server.
 * If the path is already a full URL (http/https), it's returned as-is.
 */
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};