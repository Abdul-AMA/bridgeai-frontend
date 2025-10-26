"use client";

import { ProjectPageGrid } from "@/components/projects/ProjectPageGrid";

interface ProjectPageProps {
  params: { id: string };
}

// Mock function: replace this with real API/fetch
const getProjectById = (id: string) => {
  const projects = [
    { id: "1", name: "Website Redesign", status: "Active" },
    { id: "2", name: "Mobile App Development", status: "Completed" },
    { id: "3", name: "Marketing Campaign", status: "Pending" },
  ];
  return projects.find((p) => p.id === id);
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectById(params.id);

  if (!project) return <p>Project not found</p>;

  // Mock user role (replace with real auth logic)
  const userRole: "BA" | "Client" = "BA";

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all aspects of this project.
            </p>
          </div>
        </div>

        <main className="flex-1 mt-4 overflow-auto">
          <ProjectPageGrid projectName={project.name} userRole={userRole} />
        </main>
      </div>
    </div>
  );
}
