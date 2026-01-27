/**
 * useTeamMembers Hook
 * Manages team members state and operations
 * Single Responsibility: Team members business logic
 */

import { useState, useEffect, useCallback } from "react";
import {
  TeamMember,
  fetchTeamMembers,
  updateMemberRole,
  removeMember,
  TeamMembersError,
} from "../../services/teamMembers.service";

interface UseTeamMembersReturn {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  refreshMembers: () => Promise<void>;
  changeRole: (memberId: number, role: string) => Promise<boolean>;
  removeMemberById: (memberId: number) => Promise<boolean>;
  clearError: () => void;
}

export function useTeamMembers(teamId: string): UseTeamMembersReturn {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    if (!teamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeamMembers(teamId);
      setMembers(data);
    } catch (err) {
      const errorMessage =
        err instanceof TeamMembersError
          ? err.message
          : "Failed to load team members";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const refreshMembers = useCallback(async () => {
    await loadMembers();
  }, [loadMembers]);

  const changeRole = useCallback(
    async (memberId: number, role: string): Promise<boolean> => {
      setError(null);

      try {
        await updateMemberRole(teamId, memberId, role);
        await loadMembers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamMembersError
            ? err.message
            : "Failed to update member role";
        setError(errorMessage);
        return false;
      }
    },
    [teamId, loadMembers]
  );

  const removeMemberById = useCallback(
    async (memberId: number): Promise<boolean> => {
      setError(null);

      try {
        await removeMember(teamId, memberId);
        await loadMembers();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamMembersError ? err.message : "Failed to remove member";
        setError(errorMessage);
        return false;
      }
    },
    [teamId, loadMembers]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    members,
    isLoading,
    error,
    refreshMembers,
    changeRole,
    removeMemberById,
    clearError,
  };
}
