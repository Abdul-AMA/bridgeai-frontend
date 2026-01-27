/**
 * Base API Error Classes
 * Provides consistent error handling across all services
 * Single Responsibility: Centralized error types
 */

/**
 * Base API error class for all service errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Authentication-related errors
 */
export class AuthError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = "AuthError";
  }
}

/**
 * CRS-related errors
 */
export class CRSError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = "CRSError";
  }
}

/**
 * Chat-related errors
 */
export class ChatError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = "ChatError";
  }
}

/**
 * Team-related errors
 */
export class TeamError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = "TeamError";
  }
}

/**
 * Project-related errors
 */
export class ProjectError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = "ProjectError";
  }
}

/**
 * Parse API error response to extract message
 */
export function parseApiError(error: unknown, statusCode: number): string {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as { detail?: string; message?: string };
    return errorObj.detail || errorObj.message || "An error occurred";
  }
  return "An error occurred";
}
