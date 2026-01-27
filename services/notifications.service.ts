/**
 * Notifications Service
 * Handles all notification-related API communication
 * Single Responsibility: External notification operations
 */

import {
  NotificationDTO,
  NotificationListDTO,
  MarkAsReadResponseDTO,
  AcceptInvitationResponseDTO,
} from "@/dto/notifications.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for notification errors
 */
export class NotificationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "NotificationError";
  }
}

/**
 * Create authorization headers with token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new NotificationError("No authentication token found", 401);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Parse API error response
 */
function parseApiError(error: unknown, statusCode: number): string {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as { detail?: string; message?: string };
    return errorObj.detail || errorObj.message || "An error occurred";
  }
  return "An error occurred";
}

/**
 * Fetch all notifications for the current user
 */
export async function fetchNotifications(
  unreadOnly: boolean = false
): Promise<NotificationListDTO> {
  try {
    const params = new URLSearchParams();
    if (unreadOnly) {
      params.append("unread_only", "true");
    }

    const url = `${API_BASE_URL}/api/notifications${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new NotificationError("Unauthorized. Please log in again.", 401);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new NotificationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof NotificationError) {
      throw error;
    }
    throw new NotificationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Mark a specific notification as read
 */
export async function markNotificationAsRead(
  notificationId: number
): Promise<NotificationDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new NotificationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 404) {
        throw new NotificationError("Notification not found", 404);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new NotificationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof NotificationError) {
      throw error;
    }
    throw new NotificationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<MarkAsReadResponseDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: "PATCH",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new NotificationError("Unauthorized. Please log in again.", 401);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new NotificationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof NotificationError) {
      throw error;
    }
    throw new NotificationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Delete a specific notification
 */
export async function deleteNotification(
  notificationId: number
): Promise<MarkAsReadResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new NotificationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 404) {
        throw new NotificationError("Notification not found", 404);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new NotificationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof NotificationError) {
      throw error;
    }
    throw new NotificationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Accept a team invitation directly from notification
 */
export async function acceptInvitationFromNotification(
  notificationId: number
): Promise<AcceptInvitationResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/accept-invitation`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new NotificationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 404) {
        throw new NotificationError("Invitation not found", 404);
      }
      if (response.status === 409) {
        throw new NotificationError(
          "You are already a member of this team",
          409
        );
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new NotificationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof NotificationError) {
      throw error;
    }
    throw new NotificationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
