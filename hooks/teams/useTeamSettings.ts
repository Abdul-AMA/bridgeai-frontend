/**
 * useTeamSettings Hook
 * Manages team settings (name, description) updates
 * Single Responsibility: Team settings business logic
 */

import { useState, useCallback } from "react";
import { updateTeam, TeamsError } from "../../services/teams.service";

interface UseTeamSettingsReturn {
  isUpdating: boolean;
  error: string | null;
  updateTeamInfo: (
    teamId: string,
    name: string,
    description: string
  ) => Promise<boolean>;
  clearError: () => void;
}

export function useTeamSettings(): UseTeamSettingsReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTeamInfo = useCallback(
    async (
      teamId: string,
      name: string,
      description: string
    ): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        await updateTeam(parseInt(teamId, 10), { name, description });
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamsError ? err.message : "Failed to update team";
        setError(errorMessage);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUpdating,
    error,
    updateTeamInfo,
    clearError,
  };
}
