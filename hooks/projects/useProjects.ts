/**
 * useProjects Hook
 * Manages team projects listing with filtering
 * Single Responsibility: Projects listing state and operations
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchTeamProjects, ProjectsError } from "../../services/projects.service";
import { ProjectDTO } from "../../dto/projects.dto";

interface UseProjectsReturn {
  projects: ProjectDTO[];
  filteredProjects: ProjectDTO[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  refreshProjects: () => Promise<void>;
}

export function useProjects(teamId: number): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loadProjects = useCallback(async () => {
    if (!teamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeamProjects(teamId);
      setProjects(data);
    } catch (err) {
      const errorMessage =
        err instanceof ProjectsError
          ? err.message
          : "Failed to load projects";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, selectedStatus]);

  const refreshProjects = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    refreshProjects,
  };
}
