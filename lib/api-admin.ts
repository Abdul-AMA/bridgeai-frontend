import { clearAccessToken, getAccessToken } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function adminApiCall<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new Error("No authentication token found.");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken();
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      if (typeof window !== "undefined") window.location.href = "/admin/login";
      throw new Error("Unauthorized.");
    }
    let msg = response.statusText || `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err.detail) msg = typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail);
    } catch {}
    throw new Error(msg);
  }

  return response.json() as Promise<T>;
}
import type {
  AdminAuditLogDTO,
  AdminChangeRoleRequestDTO,
  AdminErrorLogDTO,
  AdminLogPageDTO,
  AdminOverviewStatsDTO,
  AdminSuspendRequestDTO,
  AdminTeamDetailDTO,
  AdminTeamListItemDTO,
  AdminTeamStatusDTO,
  AdminTimeSeriesDTO,
  AdminUserDetailDTO,
  AdminUserListItemDTO,
  AdminUserRoleDTO,
  AdminUserStatusDTO,
  PaginatedResponseDTO,
} from "@/dto/admin.dto";

export interface AdminUsersParams {
  page?: number;
  page_size?: number;
  role?: string;
  status?: string;
  team_id?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface AdminTeamsParams {
  page?: number;
  page_size?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface AdminAnalyticsParams {
  metric: string;
  from_date: string;
  to_date: string;
  group_by?: string;
}

export interface AdminLogsParams {
  category: string;
  page?: number;
  page_size?: number;
  from_date?: string;
  to_date?: string;
  actor?: string;
  keyword?: string;
}

export interface AdminAuditParams {
  page?: number;
  page_size?: number;
  from_date?: string;
  to_date?: string;
  actor?: string;
}

export interface AdminErrorsParams {
  page?: number;
  page_size?: number;
  from_date?: string;
  to_date?: string;
  keyword?: string;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      q.set(key, String(val));
    }
  }
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

export function getAdminOverview(): Promise<AdminOverviewStatsDTO> {
  return adminApiCall<AdminOverviewStatsDTO>("/api/admin/overview");
}

export function getAdminUsers(
  params: AdminUsersParams = {}
): Promise<PaginatedResponseDTO<AdminUserListItemDTO>> {
  return adminApiCall<PaginatedResponseDTO<AdminUserListItemDTO>>(
    `/api/admin/users${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminUser(id: number): Promise<AdminUserDetailDTO> {
  return adminApiCall<AdminUserDetailDTO>(`/api/admin/users/${id}`);
}

export function suspendUser(
  id: number,
  req: AdminSuspendRequestDTO
): Promise<AdminUserStatusDTO> {
  return adminApiCall<AdminUserStatusDTO>(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

export function reactivateUser(id: number): Promise<AdminUserStatusDTO> {
  return adminApiCall<AdminUserStatusDTO>(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ action: "reactivate" }),
  });
}

export function changeUserRole(
  id: number,
  req: AdminChangeRoleRequestDTO
): Promise<AdminUserRoleDTO> {
  return adminApiCall<AdminUserRoleDTO>(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

export function getAdminTeams(
  params: AdminTeamsParams = {}
): Promise<PaginatedResponseDTO<AdminTeamListItemDTO>> {
  return adminApiCall<PaginatedResponseDTO<AdminTeamListItemDTO>>(
    `/api/admin/teams${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminTeam(id: number): Promise<AdminTeamDetailDTO> {
  return adminApiCall<AdminTeamDetailDTO>(`/api/admin/teams/${id}`);
}

export function suspendTeam(
  id: number,
  req: AdminSuspendRequestDTO
): Promise<AdminTeamStatusDTO> {
  return adminApiCall<AdminTeamStatusDTO>(`/api/admin/teams/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

export function reactivateTeam(id: number): Promise<AdminTeamStatusDTO> {
  return adminApiCall<AdminTeamStatusDTO>(`/api/admin/teams/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ action: "reactivate" }),
  });
}

export function getAdminAnalytics(
  params: AdminAnalyticsParams
): Promise<AdminTimeSeriesDTO> {
  return adminApiCall<AdminTimeSeriesDTO>(
    `/api/admin/analytics${buildQuery(params as unknown as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminLogs(params: AdminLogsParams): Promise<AdminLogPageDTO> {
  return adminApiCall<AdminLogPageDTO>(
    `/api/admin/logs${buildQuery(params as unknown as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminAudit(
  params: AdminAuditParams = {}
): Promise<PaginatedResponseDTO<AdminAuditLogDTO>> {
  return adminApiCall<PaginatedResponseDTO<AdminAuditLogDTO>>(
    `/api/admin/audit${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminErrors(
  params: AdminErrorsParams = {}
): Promise<PaginatedResponseDTO<AdminErrorLogDTO>> {
  return adminApiCall<PaginatedResponseDTO<AdminErrorLogDTO>>(
    `/api/admin/errors${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}
