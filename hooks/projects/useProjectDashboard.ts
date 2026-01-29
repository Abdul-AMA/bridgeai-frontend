/**
 * Project Dashboard Hook
 * Manages project dashboard statistics data fetching and state
 * Single Responsibility: Project dashboard data management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectDashboardStatsDTO } from "@/dto/projects.dto";
import {
  fetchProjectDashboardStats,
  ProjectsError,
} from "@/services/projects.service";

interface UseProjectDashboardResult {
  stats: ProjectDashboardStatsDTO | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing project dashboard statistics
 * @param projectId - The ID of the project
 * @returns Project dashboard stats with loading and error states
 */
export function useProjectDashboard(
  projectId: number
): UseProjectDashboardResult {
  const [stats, setStats] = useState<ProjectDashboardStatsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProjectDashboardStats(projectId);
      setStats(data);
    } catch (err) {
      if (err instanceof ProjectsError) {
        setError(err.message);
      } else {
        setError("Failed to load dashboard statistics");
      }
      console.error("Error loading project dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

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
