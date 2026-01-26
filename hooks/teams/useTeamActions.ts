/**
 * useTeamActions Hook
 * Handles team management operations (edit, archive, delete, etc.)
 * Single Responsibility: Team actions state and operations
 */

import { useState, useCallback } from "react";
import {
  updateTeam,
  deleteTeam,
  archiveTeam,
  activateTeam,
  deactivateTeam,
  TeamsError,
} from "../../services/teams.service";
import { CreateTeamRequestDTO } from "../../dto/teams.dto";

interface UseTeamActionsReturn {
  isLoading: boolean;
  error: string | null;
  editTeam: (
    teamId: number,
    updates: Partial<CreateTeamRequestDTO>
  ) => Promise<boolean>;
  removeTeam: (teamId: number) => Promise<boolean>;
  archiveTeamAction: (teamId: number) => Promise<boolean>;
  unarchiveTeam: (teamId: number) => Promise<boolean>;
  activateTeamAction: (teamId: number) => Promise<boolean>;
  deactivateTeamAction: (teamId: number) => Promise<boolean>;
  clearError: () => void;
}

export function useTeamActions(): UseTeamActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTeam = useCallback(
    async (
      teamId: number,
      updates: Partial<CreateTeamRequestDTO>
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateTeam(teamId, updates);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamsError ? err.message : "Failed to update team";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeTeam = useCallback(async (teamId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteTeam(teamId);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof TeamsError ? err.message : "Failed to delete team";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const archiveTeamAction = useCallback(
    async (teamId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await archiveTeam(teamId);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamsError ? err.message : "Failed to archive team";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const unarchiveTeam = useCallback(async (teamId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await activateTeam(teamId);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof TeamsError ? err.message : "Failed to unarchive team";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activateTeamAction = useCallback(
    async (teamId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await activateTeam(teamId);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamsError ? err.message : "Failed to activate team";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deactivateTeamAction = useCallback(
    async (teamId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await deactivateTeam(teamId);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof TeamsError ? err.message : "Failed to deactivate team";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    editTeam,
    removeTeam,
    archiveTeamAction,
    unarchiveTeam,
    activateTeamAction,
    deactivateTeamAction,
    clearError,
  };
}
