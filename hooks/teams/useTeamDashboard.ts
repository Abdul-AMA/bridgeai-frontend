/**
 * Team Dashboard Hook
 * Manages team dashboard statistics data fetching and state
 * Single Responsibility: Team dashboard data management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { TeamDashboardStatsDTO } from "@/dto/teams.dto";
import {
  fetchTeamDashboardStats,
  TeamsError,
} from "@/services/teams.service";

interface UseTeamDashboardResult {
  stats: TeamDashboardStatsDTO | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing team dashboard statistics
 * @param teamId - The ID of the team
 * @returns Team dashboard stats with loading and error states
 */
export function useTeamDashboard(teamId: number): UseTeamDashboardResult {
  const [stats, setStats] = useState<TeamDashboardStatsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!teamId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTeamDashboardStats(teamId);
      setStats(data);
    } catch (err) {
      if (err instanceof TeamsError) {
        setError(err.message);
      } else {
        setError("Failed to load dashboard statistics");
      }
      console.error("Error loading team dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    stats,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
