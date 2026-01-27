/**
 * usePendingProjects Hook
 * Manages pending projects for approval/rejection
 * Single Responsibility: Pending projects state and operations
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchPendingProjects,
  approveProject,
  rejectProject,
  ProjectsError,
} from "../../services/projects.service";
import { ProjectDTO } from "../../dto/projects.dto";

interface UsePendingProjectsReturn {
  pendingProjects: ProjectDTO[];
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
  handleApprove: (projectId: number) => Promise<boolean>;
  handleReject: (projectId: number, reason: string) => Promise<boolean>;
  refreshProjects: () => Promise<void>;
}

export function usePendingProjects(enabled = true): UsePendingProjectsReturn {
  const [pendingProjects, setPendingProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPendingProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPendingProjects();
      setPendingProjects(data);
    } catch (err) {
      const errorMessage =
        err instanceof ProjectsError
          ? err.message
          : "Failed to load pending projects";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      loadPendingProjects();
    }
  }, [loadPendingProjects, enabled]);

  const handleApprove = useCallback(
    async (projectId: number): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);

      try {
        await approveProject(projectId);
        await loadPendingProjects();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ProjectsError
            ? err.message
            : "Failed to approve project";
        setError(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [loadPendingProjects]
  );

  const handleReject = useCallback(
    async (projectId: number, reason: string): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);

      try {
        await rejectProject(projectId, reason);
        await loadPendingProjects();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ProjectsError
            ? err.message
            : "Failed to reject project";
        setError(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [loadPendingProjects]
  );

  const refreshProjects = useCallback(async () => {
    await loadPendingProjects();
  }, [loadPendingProjects]);

  return {
    pendingProjects,
    isLoading,
    error,
    isProcessing,
    handleApprove,
    handleReject,
    refreshProjects,
  };
}
