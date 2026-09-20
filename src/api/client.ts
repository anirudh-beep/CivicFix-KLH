import { ApiError } from '../types/Api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...customOptions } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers = new Headers(customHeaders || {});
  
  // Attach CSRF token for mutating requests
  const method = (customOptions.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken && !headers.has('X-CSRFToken')) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }

  let requestBody: BodyInit | undefined = undefined;

  if (body instanceof FormData) {
    // Browser automatically sets Content-Type with multipart boundary
    requestBody = body;
  } else if (body !== undefined && body !== null) {
    headers.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...customOptions,
    method,
    headers,
    body: requestBody,
    credentials: 'include', // Strictly required for Django session authentication
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Parse JSON response safely
  let data: unknown;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (typeof data === 'object' && data !== null) {
      const errObj = data as Record<string, unknown>;
      errorMessage =
        (errObj.detail as string) ||
        (errObj.message as string) ||
        (errObj.error as string) ||
        errorMessage;
    } else if (typeof data === 'string' && data.length < 200) {
      errorMessage = data;
    }

    if (response.status === 401) {
      // Notify session manager
      window.dispatchEvent(new CustomEvent('civicfix:unauthorized'));
    }

    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}
