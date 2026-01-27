/**
 * Chats Service
 * Handles all chat/session-related API communication
 * Single Responsibility: External chat operations
 */

import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type SessionStatus = "active" | "completed";
export type CRSPattern = "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";

export interface ChatMessageDTO {
  id: number;
  session_id: number;
  sender_id: number | null;
  sender_type: "client" | "ai" | "ba";
  content: string;
  timestamp: string;
}

export interface ChatSummaryDTO {
  id: number;
  project_id: number;
  user_id: number;
  crs_document_id: number | null;
  name: string;
  crs_pattern?: CRSPattern;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
  message_count: number;
}

export interface ChatDetailDTO {
  id: number;
  project_id: number;
  user_id: number;
  crs_document_id: number | null;
  name: string;
  crs_pattern?: CRSPattern;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
  messages: ChatMessageDTO[];
  message_count?: number;
}

export interface CreateChatRequestDTO {
  name: string;
  crs_document_id?: number;
  crs_pattern?: CRSPattern;
}

export interface UpdateChatRequestDTO {
  name?: string;
  status?: SessionStatus;
}

/**
 * Custom error class for chat errors
 */
export class ChatsError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ChatsError";
  }
}

/**
 * Create authorization headers with token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new ChatsError("No authentication token found", 401);
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
 * Fetch all chats for a project
 */
export async function fetchProjectChats(projectId: number): Promise<ChatSummaryDTO[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/chats`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ChatsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ChatsError) {
      throw error;
    }
    throw new ChatsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch a single chat detail
 */
export async function fetchChatById(
  projectId: number,
  chatId: number
): Promise<ChatDetailDTO | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/chats/${chatId}`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ChatsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ChatsError) {
      throw error;
    }
    throw new ChatsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Create a new chat session
 */
export async function createChat(
  projectId: number,
  chatData: CreateChatRequestDTO
): Promise<ChatDetailDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/chats`,
      {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(chatData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ChatsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ChatsError) {
      throw error;
    }
    throw new ChatsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Update an existing chat (name or status)
 */
export async function updateChat(
  projectId: number,
  chatId: number,
  updates: UpdateChatRequestDTO
): Promise<ChatDetailDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/chats/${chatId}`,
      {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ChatsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ChatsError) {
      throw error;
    }
    throw new ChatsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Delete a chat session
 */
export async function deleteChat(projectId: number, chatId: number): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/chats/${chatId}`,
      {
        method: "DELETE",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ChatsError(errorMessage, response.status, errorData);
    }
  } catch (error) {
    if (error instanceof ChatsError) {
      throw error;
    }
    throw new ChatsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
