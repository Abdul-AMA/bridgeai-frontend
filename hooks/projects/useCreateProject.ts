/**
 * useCreateProject Hook
 * Handles project creation logic
 * Single Responsibility: Project creation state and operations
 */

import { useState, useCallback } from "react";
import { createProject, ProjectsError } from "../../services/projects.service";
import { CreateProjectRequestDTO } from "../../dto/projects.dto";

interface UseCreateProjectReturn {
  isCreating: boolean;
  error: string | null;
  createNewProject: (projectData: CreateProjectRequestDTO) => Promise<boolean>;
  clearError: () => void;
}

export function useCreateProject(): UseCreateProjectReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewProject = useCallback(
    async (projectData: CreateProjectRequestDTO): Promise<boolean> => {
      setIsCreating(true);
      setError(null);

      try {
        await createProject(projectData);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ProjectsError
            ? err.message
            : "Failed to create project";
        setError(errorMessage);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isCreating,
    error,
    createNewProject,
    clearError,
  };
}
