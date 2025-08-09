// Centralized API helper for the frontend
// - Uses JWT from localStorage under key "authToken"
// - Adds Authorization header automatically
// - Provides a consistent base URL and a default placeholder image

export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:3000';

export const DEFAULT_IMAGE_URL = 'https://placehold.co/600x400';

export function getAuthToken() {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken && typeof storedToken === 'string') {
    return storedToken;
  }
  // Backward compatibility if token was stored inside a user object
  try {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return auth && auth.token ? auth.token : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (data && (data.error || data.message || data.details)) || `Request failed with ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

export function ensureAbsoluteImageUrl(url) {
  if (!url || typeof url !== 'string') return DEFAULT_IMAGE_URL;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If backend ever returns relative URLs and the asset host is unknown, use placeholder to avoid broken images
  return DEFAULT_IMAGE_URL;
}


