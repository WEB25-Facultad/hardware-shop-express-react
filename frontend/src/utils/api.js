const DEFAULT_BASE_URL = 'http://localhost:3000';

/**
 * Función base (Wrapper) para comunicarse con la API REST del backend.
 * Configura la URL base automáticamente, serializa los bodies a JSON
 * y maneja los errores HTTP de forma centralizada.
 * 
 * @param {string} endpoint - La ruta del endpoint de la API (ej., '/products')
 * @param {object} options - Opciones del Fetch (method, headers, body, etc.)
 * @returns {Promise<any>} Datos de la respuesta parseados a JSON
 */
export async function apiFetch(endpoint, options = {}) {
  // Soporte para variables de entorno (Vite) permitiendo cambiar la URL en Producción
  const baseUrl = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  // Headers estandarizados para que el backend siempre entienda que hablamos JSON
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

  // Auto-serialización: Si le pasamos un objeto JavaScript como Body, lo pasa a String JSON
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
      // Captura de errores inteligente
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