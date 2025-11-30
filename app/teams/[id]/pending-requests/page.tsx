"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PendingRequestsTable } from "@/components/pending-requests/PendingRequestsTable";
import { ProjectDetailsDialog } from "@/components/pending-requests/ProjectDetailsDialog";
import {
  fetchPendingProjects,
  approveProject,
  rejectProject,
  Project,
} from "@/lib/api-projects";
import { getCurrentUser } from "@/lib/api";

interface PendingRequestsPageProps {
  params: Promise<{ id: string }>;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
  full_name: string;
}

export default function PendingRequestsPage({ params }: PendingRequestsPageProps) {
  const { id: teamId } = use(params);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user and verify BA role
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await getCurrentUser<User>();
        if (user.role !== "ba") {
          router.push(`/teams/${teamId}/dashboard`);
          return;
        }
        // User is BA, continue to fetch projects
        await fetchProjects();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify user");
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [router, teamId]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPendingProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (projectId: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await approveProject(projectId);
      setSuccessMessage("Project approved successfully");
      
      // Remove approved project from list
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve project");
    }
  };

  const handleReject = async (projectId: number, reason: string) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await rejectProject(projectId, reason);
      setSuccessMessage("Project rejected successfully");
      
      // Remove rejected project from list
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject project");
    }
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading pending requests...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Pending Project Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve or reject client project requests
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Projects Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "request" : "requests"} pending review
          </p>
        </div>

        {/* Table */}
        <PendingRequestsTable
          projects={projects}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
        />

        {/* Details Dialog */}
        <ProjectDetailsDialog
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      </div>
    </div>
  );
}
