/**
 * Team Members Service
 * Handles team members and invitations API communication
 * Single Responsibility: Team members external operations
 */

import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for team members operations
 */
export class TeamMembersError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "TeamMembersError";
  }
}

/**
 * Team member interface
 */
export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  role: string;
  is_active?: boolean;
  joined_at?: string;
  updated_at?: string;
  user: {
    id: number;
    email: string;
    full_name?: string;
    username?: string;
    role?: string;
  };
}

/**
 * Invitation interface
 */
export interface Invitation {
  id: string;
  email: string;
  role: string;
  team_id: string;
  status: "pending" | "accepted" | "expired" | "canceled";
  created_at: string;
  expires_at: string;
}

/**
 * Create authorization headers
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new TeamMembersError("No authentication token found", 401);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Parse API error response
 */
function parseApiError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as { detail?: string; message?: string };
    return errorObj.detail || errorObj.message || "An error occurred";
  }
  return "An error occurred";
}

/**
 * Fetch team members
 */
export async function fetchTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/members`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new TeamMembersError(
        parseApiError(errorData),
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamMembersError) {
      throw error;
    }
    throw new TeamMembersError(
      error instanceof Error ? error.message : "Failed to fetch team members"
    );
  }
}

/**
 * Update member role
 */
export async function updateMemberRole(
  teamId: string,
  memberId: number,
  role: string
): Promise<TeamMember> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/members/${memberId}`,
      {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({ role }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new TeamMembersError(
        parseApiError(errorData),
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamMembersError) {
      throw error;
    }
    throw new TeamMembersError(
      error instanceof Error ? error.message : "Failed to update member role"
    );
  }
}

/**
 * Remove team member
 */
export async function removeMember(
  teamId: string,
  memberId: number
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new TeamMembersError(
        parseApiError(errorData),
        response.status,
        errorData
      );
    }
  } catch (error) {
    if (error instanceof TeamMembersError) {
      throw error;
    }
    throw new TeamMembersError(
      error instanceof Error ? error.message : "Failed to remove member"
    );
  }
}

/**
 * Fetch team invitations
 */
export async function fetchTeamInvitations(teamId: string): Promise<Invitation[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/invitations`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      // Invitations endpoint might not be implemented
      if (response.status === 404) {
        return [];
      }
      const errorData = await response.json().catch(() => ({}));
      throw new TeamMembersError(
        parseApiError(errorData),
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamMembersError) {
      throw error;
    }
    // Silently return empty array if endpoint not available
    return [];
  }
}

/**
 * Cancel invitation
 */
export async function cancelInvitation(
  teamId: string,
  invitationId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/invitations/${invitationId}/cancel`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new TeamMembersError(
        parseApiError(errorData),
        response.status,
        errorData
      );
    }
  } catch (error) {
    if (error instanceof TeamMembersError) {
      throw error;
    }
    throw new TeamMembersError(
      error instanceof Error ? error.message : "Failed to cancel invitation"
    );
  }
}
