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
import {
  changeUserRole,
  getAdminAnalytics,
  getAdminAudit,
  getAdminErrors,
  getAdminLogs,
  getAdminOverview,
  getAdminTeam,
  getAdminTeams,
  getAdminUser,
  getAdminUsers,
  reactivateTeam,
  reactivateUser,
  suspendTeam,
  suspendUser,
  type AdminAnalyticsParams,
  type AdminAuditParams,
  type AdminErrorsParams,
  type AdminLogsParams,
  type AdminTeamsParams,
  type AdminUsersParams,
} from "@/lib/api-admin";

export class AdminServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "AdminServiceError";
  }
}

function normalise(err: unknown): AdminServiceError {
  if (err instanceof AdminServiceError) return err;
  if (err instanceof Error) return new AdminServiceError(err.message);
  return new AdminServiceError("An unexpected error occurred");
}

export async function fetchAdminOverview(): Promise<AdminOverviewStatsDTO> {
  try {
    return await getAdminOverview();
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminUsers(
  params: AdminUsersParams = {}
): Promise<PaginatedResponseDTO<AdminUserListItemDTO>> {
  try {
    return await getAdminUsers(params);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminUser(id: number): Promise<AdminUserDetailDTO> {
  try {
    return await getAdminUser(id);
  } catch (err) {
    throw normalise(err);
  }
}

export async function adminSuspendUser(
  id: number,
  req: AdminSuspendRequestDTO
): Promise<AdminUserStatusDTO> {
  try {
    return await suspendUser(id, req);
  } catch (err) {
    throw normalise(err);
  }
}

export async function adminReactivateUser(id: number): Promise<AdminUserStatusDTO> {
  try {
    return await reactivateUser(id);
  } catch (err) {
    throw normalise(err);
  }
}

export async function adminChangeUserRole(
  id: number,
  req: AdminChangeRoleRequestDTO
): Promise<AdminUserRoleDTO> {
  try {
    return await changeUserRole(id, req);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminTeams(
  params: AdminTeamsParams = {}
): Promise<PaginatedResponseDTO<AdminTeamListItemDTO>> {
  try {
    return await getAdminTeams(params);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminTeam(id: number): Promise<AdminTeamDetailDTO> {
  try {
    return await getAdminTeam(id);
  } catch (err) {
    throw normalise(err);
  }
}

export async function adminSuspendTeam(
  id: number,
  req: AdminSuspendRequestDTO
): Promise<AdminTeamStatusDTO> {
  try {
    return await suspendTeam(id, req);
  } catch (err) {
    throw normalise(err);
  }
}

export async function adminReactivateTeam(id: number): Promise<AdminTeamStatusDTO> {
  try {
    return await reactivateTeam(id);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminAnalytics(
  params: AdminAnalyticsParams
): Promise<AdminTimeSeriesDTO> {
  try {
    return await getAdminAnalytics(params);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminLogs(params: AdminLogsParams): Promise<AdminLogPageDTO> {
  try {
    return await getAdminLogs(params);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminAudit(
  params: AdminAuditParams = {}
): Promise<PaginatedResponseDTO<AdminAuditLogDTO>> {
  try {
    return await getAdminAudit(params);
  } catch (err) {
    throw normalise(err);
  }
}

export async function fetchAdminErrors(
  params: AdminErrorsParams = {}
): Promise<PaginatedResponseDTO<AdminErrorLogDTO>> {
  try {
    return await getAdminErrors(params);
  } catch (err) {
    throw normalise(err);
  }
}
