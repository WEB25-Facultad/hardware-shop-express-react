const DEFAULT_BASE_URL = 'http://localhost:3000';

/**
 * Base fetch function to communicate with the backend REST API.
 * Configures the base URL, serializes bodies to JSON, and handles HTTP errors.
 * 
 * @param {string} endpoint - The API endpoint path (e.g., '/products')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Response JSON data
 */
export async function apiFetch(endpoint, options = {}) {
  // Allow overriding base URL dynamically or fallback to env or default
  const baseUrl = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    let data = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const error = new Error(
        data && typeof data === 'object' && data.message 
          ? data.message 
          : `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`Fetch API Error for ${url}:`, err);
    throw err;
  }
}

export default apiFetch;
