"use client";

import { use, useState, useEffect } from "react";
import { ProjectPageGrid } from "@/components/projects/ProjectPageGrid";
import { apiCall, getCurrentUser } from "@/lib/api";

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  team_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectChatsPage({ params }: Props) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<"BA" | "Client">("Client");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectData, userData] = await Promise.all([
          apiCall<Project>(`/api/projects/${id}`),
          getCurrentUser<User>(),
        ]);
        setProject(projectData);
        setUserRole(userData.role === "ba" ? "BA" : "Client");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <p className="text-center mt-20">Loading project...</p>;
  if (error || !project) return <p className="text-center mt-20">{error || "Project not found"}</p>;

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage all aspects of this project.</p>
          </div>
        </div>

        <main className="flex-1 mt-4 overflow-auto">
          <ProjectPageGrid
            projectId={project.id}
            projectName={project.name}
            projectDescription={project.description || ""}
            userRole={userRole}
            initialTab="chats"
          />
        </main>
      </div>
    </div>
  );
}
