/**
 * API utilities for project-related operations
 */

import { apiCall } from "./api";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  team_id: number;
  created_by: number;
  created_by_name?: string | null;
  created_by_email?: string | null;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "archived";
  approved_by: number | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  team_id: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: string;
}

export interface ProjectRejection {
  rejection_reason: string;
}

/**
 * Fetch all pending project requests (BA only)
 */
export async function fetchPendingProjects(): Promise<Project[]> {
  return apiCall<Project[]>("/api/projects/pending");
}

/**
 * Approve a pending project request (BA only)
 */
export async function approveProject(projectId: number): Promise<Project> {
  return apiCall<Project>(`/api/projects/${projectId}/approve`, {
    method: "PUT",
  });
}

/**
 * Reject a pending project request (BA only)
 */
export async function rejectProject(
  projectId: number,
  rejectionReason: string
): Promise<Project> {
  return apiCall<Project>(`/api/projects/${projectId}/reject`, {
    method: "PUT",
    body: JSON.stringify({ rejection_reason: rejectionReason }),
  });
}

/**
 * Fetch a single project by ID
 */
export async function fetchProject(projectId: number): Promise<Project> {
  return apiCall<Project>(`/api/projects/${projectId}`);
}

/**
 * Fetch all projects (optionally filtered by team or status)
 */
export async function fetchProjects(
  teamId?: number,
  status?: string
): Promise<Project[]> {
  const params = new URLSearchParams();
  if (teamId) params.append("team_id", teamId.toString());
  if (status) params.append("status", status);
  
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiCall<Project[]>(`/api/projects${query}`);
}

/**
 * Create a new project
 */
export async function createProject(project: ProjectCreate): Promise<Project> {
  return apiCall<Project>("/api/projects/", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: number,
  updates: ProjectUpdate
): Promise<Project> {
  return apiCall<Project>(`/api/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
