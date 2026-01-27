/**
 * Invitations Service
 * Handles all team invitation-related API communication
 * Single Responsibility: External invitation operations
 */

import {
  SendInvitationRequestDTO,
  InvitationDTO,
  InvitationPublicDetailsDTO,
  AcceptInvitationResponseDTO,
  RejectInvitationResponseDTO,
  CancelInvitationResponseDTO,
  ResendInvitationResponseDTO,
  PendingInvitationDTO,
} from "@/dto/invitations.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for invitation errors
 */
export class InvitationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "InvitationError";
  }
}

/**
 * Create authorization headers with token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new InvitationError("No authentication token found", 401);
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
 * Send invitation to join a team
 */
export async function sendInvitation(
  teamId: string,
  invitation: SendInvitationRequestDTO
): Promise<InvitationDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/invite`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(invitation),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new InvitationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 404) {
        throw new InvitationError("Team not found", 404);
      }
      if (response.status === 409) {
        throw new InvitationError(
          "User is already a member or has a pending invitation",
          409
        );
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Get invitation details (public endpoint - no auth required)
 */
export async function getInvitationDetails(
  token: string
): Promise<InvitationPublicDetailsDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/invitation/${token}`, {
      method: "GET",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new InvitationError("Invitation not found or has expired", 404);
      }
      if (response.status === 410) {
        throw new InvitationError("This invitation has expired", 410);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Accept invitation (requires authentication)
 */
export async function acceptInvitation(
  token: string
): Promise<AcceptInvitationResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/invitation/${token}/accept`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = parseApiError(errorData, response.status);
        throw new InvitationError(
          errorMessage || "Invitation expired or email mismatch",
          400,
          errorData
        );
      }
      if (response.status === 401) {
        throw new InvitationError("Authentication required", 401);
      }
      if (response.status === 404) {
        throw new InvitationError("Invalid invitation token", 404);
      }
      if (response.status === 409) {
        throw new InvitationError(
          "You are already a member of this team",
          409
        );
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Reject invitation (requires authentication)
 */
export async function rejectInvitation(
  token: string
): Promise<RejectInvitationResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/invitation/${token}/reject`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new InvitationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 404) {
        throw new InvitationError("Invitation not found", 404);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Cancel an invitation (for team admins)
 */
export async function cancelInvitation(
  teamId: string,
  invitationId: string
): Promise<CancelInvitationResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/invitations/${invitationId}`,
      {
        method: "DELETE",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new InvitationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 403) {
        throw new InvitationError(
          "You don't have permission to cancel this invitation",
          403
        );
      }
      if (response.status === 404) {
        throw new InvitationError("Invitation not found", 404);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Resend an invitation (for team admins)
 */
export async function resendInvitation(
  teamId: string,
  invitationId: string
): Promise<ResendInvitationResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/invitations/${invitationId}/resend`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new InvitationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 403) {
        throw new InvitationError(
          "You don't have permission to resend this invitation",
          403
        );
      }
      if (response.status === 404) {
        throw new InvitationError("Invitation not found", 404);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Get pending invitations for a team
 */
export async function getPendingInvitations(
  teamId: string
): Promise<PendingInvitationDTO[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/invitations`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new InvitationError("Unauthorized. Please log in again.", 401);
      }
      if (response.status === 403) {
        throw new InvitationError(
          "You don't have permission to view invitations",
          403
        );
      }
      if (response.status === 404) {
        throw new InvitationError("Team not found", 404);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new InvitationError(errorMessage, response.status, errorData);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof InvitationError) {
      throw error;
    }
    throw new InvitationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
