import { apiCall } from "./api";
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
  return apiCall<AdminOverviewStatsDTO>("/api/admin/overview");
}

export function getAdminUsers(
  params: AdminUsersParams = {}
): Promise<PaginatedResponseDTO<AdminUserListItemDTO>> {
  return apiCall<PaginatedResponseDTO<AdminUserListItemDTO>>(
    `/api/admin/users${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminUser(id: number): Promise<AdminUserDetailDTO> {
  return apiCall<AdminUserDetailDTO>(`/api/admin/users/${id}`);
}

export function suspendUser(
  id: number,
  req: AdminSuspendRequestDTO
): Promise<AdminUserStatusDTO> {
  return apiCall<AdminUserStatusDTO>(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

export function reactivateUser(id: number): Promise<AdminUserStatusDTO> {
  return apiCall<AdminUserStatusDTO>(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ action: "reactivate" }),
  });
}

export function changeUserRole(
  id: number,
  req: AdminChangeRoleRequestDTO
): Promise<AdminUserRoleDTO> {
  return apiCall<AdminUserRoleDTO>(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

export function getAdminTeams(
  params: AdminTeamsParams = {}
): Promise<PaginatedResponseDTO<AdminTeamListItemDTO>> {
  return apiCall<PaginatedResponseDTO<AdminTeamListItemDTO>>(
    `/api/admin/teams${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminTeam(id: number): Promise<AdminTeamDetailDTO> {
  return apiCall<AdminTeamDetailDTO>(`/api/admin/teams/${id}`);
}

export function suspendTeam(
  id: number,
  req: AdminSuspendRequestDTO
): Promise<AdminTeamStatusDTO> {
  return apiCall<AdminTeamStatusDTO>(`/api/admin/teams/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

export function reactivateTeam(id: number): Promise<AdminTeamStatusDTO> {
  return apiCall<AdminTeamStatusDTO>(`/api/admin/teams/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ action: "reactivate" }),
  });
}

export function getAdminAnalytics(
  params: AdminAnalyticsParams
): Promise<AdminTimeSeriesDTO> {
  return apiCall<AdminTimeSeriesDTO>(
    `/api/admin/analytics${buildQuery(params as unknown as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminLogs(params: AdminLogsParams): Promise<AdminLogPageDTO> {
  return apiCall<AdminLogPageDTO>(
    `/api/admin/logs${buildQuery(params as unknown as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminAudit(
  params: AdminAuditParams = {}
): Promise<PaginatedResponseDTO<AdminAuditLogDTO>> {
  return apiCall<PaginatedResponseDTO<AdminAuditLogDTO>>(
    `/api/admin/audit${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}

export function getAdminErrors(
  params: AdminErrorsParams = {}
): Promise<PaginatedResponseDTO<AdminErrorLogDTO>> {
  return apiCall<PaginatedResponseDTO<AdminErrorLogDTO>>(
    `/api/admin/errors${buildQuery(params as Record<string, string | number | boolean | undefined>)}`
  );
}
