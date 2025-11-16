"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { apiCall } from "@/lib/api";

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface CardProject {
  id: number;
  name: string;
  lastUpdate: string;
  team: string[];
  status: string;
}

export default function ProjectsList() {
  const params = useParams();
  const teamId = params.id as string;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<CardProject[]>([]);
  const [allProjects, setAllProjects] = useState<CardProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch from GET /api/teams/{team_id}/projects
      const data = await apiCall<Project[]>(`/api/teams/${teamId}/projects`);
      
      // Transform API data to match CardGrid format
      const transformedProjects: CardProject[] = data.map((project) => ({
        id: project.id,
        name: project.name,
        lastUpdate: new Date(project.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        team: [],
        status: formatStatus(project.status),
      }));
      
      setAllProjects(transformedProjects);
      setProjects(transformedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  useEffect(() => {
    if (teamId) {
      fetchProjects();
    }
  }, [teamId]);

  // Filter projects based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProjects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProjects(filtered);
    } else {
      setProjects(allProjects);
    }
  }, [searchQuery, allProjects]);

  const handleProjectCreated = () => {
    fetchProjects();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all projects for your team in one place.
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center bg-[#fafafb] p-4 justify-between mb-7 gap-3 rounded">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <SearchBar 
              placeholder="Search projects by name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="primary" size="sm">Filters</Button>
          </div>
          <Button 
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Project
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchProjects}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No projects found matching your search" : "No projects yet"}
            </p>
            {!searchQuery && (
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Project
              </Button>
            )}
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && projects.length > 0 && (
          <CardGrid items={projects} showAvatars={false} />
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          teamId={teamId}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
}