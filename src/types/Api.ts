/**
 * Standard API Response & Error Types
 */

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
