/**
 * useTeamInvitations Hook
 * Manages team invitations state and operations
 * Single Responsibility: Team invitations business logic
 */

import { useState, useEffect, useCallback } from "react";
import {
  Invitation,
  fetchTeamInvitations,
  cancelInvitation as cancelInvitationService,
  TeamMembersError,
} from "../../services/teamMembers.service";

interface UseTeamInvitationsReturn {
  invitations: Invitation[];
  pendingInvitations: Invitation[];
  isLoading: boolean;
  error: string | null;
  refreshInvitations: () => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useTeamInvitations(teamId: string): UseTeamInvitationsReturn {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    if (!teamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeamInvitations(teamId);
      setInvitations(data);
    } catch (err) {
      const errorMessage =
        err instanceof TeamMembersError
          ? err.message
          : "Failed to load invitations";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const refreshInvitations = useCallback(async () => {
    await loadInvitations();
  }, [loadInvitations]);

  const cancelInvitation = useCallback(
    async (invitationId: string): Promise<boolean> => {
      setError(null);

      try {
        await cancelInvitationService(teamId, invitationId);
        await loadInvitations();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamMembersError
            ? err.message
            : "Failed to cancel invitation";
        setError(errorMessage);
        return false;
      }
    },
    [teamId, loadInvitations]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );

  return {
    invitations,
    pendingInvitations,
    isLoading,
    error,
    refreshInvitations,
    cancelInvitation,
    clearError,
  };
}
