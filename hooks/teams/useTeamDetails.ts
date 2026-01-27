/**
 * useTeamDetails Hook
 * Fetches single team details
 * Single Responsibility: Team details state and operations
 */

import { useEffect, useState, useCallback } from "react";
import { fetchTeamById, TeamsError } from "../../services/teams.service";
import { TeamDTO } from "../../dto/teams.dto";

interface UseTeamDetailsReturn {
  team: TeamDTO | null;
  isLoading: boolean;
  error: string | null;
  refreshTeam: () => Promise<void>;
}

export function useTeamDetails(teamId: string): UseTeamDetailsReturn {
  const [team, setTeam] = useState<TeamDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeam = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeamById(teamId);
      setTeam(data);
    } catch (err) {
      const errorMessage =
        err instanceof TeamsError ? err.message : "Failed to load team";
      setError(errorMessage);
      setTeam(null);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      loadTeam();
    }
  }, [teamId, loadTeam]);

  const refreshTeam = useCallback(async () => {
    await loadTeam();
  }, [loadTeam]);

  return { team, isLoading, error, refreshTeam };
}
