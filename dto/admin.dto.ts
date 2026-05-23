export type AdminLogCategory =
  | "user_activity"
  | "ai_generation"
  | "auth"
  | "api_errors"
  | "audit_trail"
  | "token_usage"
  | "system";

export type AdminAnalyticsMetric =
  | "tokens"
  | "crs_generations"
  | "active_users"
  | "new_teams"
  | "ai_errors";

export interface PaginatedResponseDTO<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ---------- Overview ----------

export interface AdminRecentErrorDTO {
  id: number;
  error_code: string;
  path: string;
  message: string;
  created_at: string;
}

export interface AdminRecentActivityDTO {
  id: number;
  action: string;
  target_type: string;
  target_id: number;
  actor_email: string;
  reason: string | null;
  created_at: string;
}

export interface AdminOverviewStatsDTO {
  total_users: number;
  active_users: number;
  total_teams: number;
  active_teams: number;
  suspended_teams: number;
  total_crs_generated: number;
  total_ai_tokens: number;
  ai_error_count_7d: number;
  recent_errors: AdminRecentErrorDTO[];
  recent_activity: AdminRecentActivityDTO[];
}

// ---------- Users ----------

export interface AdminUserListItemDTO {
  id: number;
  full_name: string;
  email: string;
  role: string | null;
  is_active: boolean;
  suspended_by: number | null;
  suspension_reason: string | null;
  team_count: number;
  created_at: string;
}

export interface AdminUserTeamMembershipDTO {
  team_id: number;
  team_name: string;
  role: string;
  joined_at: string;
}

export interface AdminUserActivityDTO {
  id: number;
  category: string;
  timestamp: string;
  actor: string;
  event: string;
  detail: string | null;
}

export interface AdminUserDetailDTO {
  id: number;
  full_name: string;
  email: string;
  role: string | null;
  is_active: boolean;
  suspended_by: number | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  avatar_url: string | null;
  created_at: string;
  team_memberships: AdminUserTeamMembershipDTO[];
  total_crs_count: number;
  total_ai_tokens: number;
  recent_activity: AdminUserActivityDTO[];
}

export interface AdminUserStatusDTO {
  id: number;
  is_active: boolean;
  suspended_by: number | null;
  suspended_at: string | null;
  suspension_reason: string | null;
}

export interface AdminUserRoleDTO {
  id: number;
  role: string;
  updated_at: string | null;
}

// ---------- Teams ----------

export interface AdminTeamListItemDTO {
  id: number;
  name: string;
  creator_name: string;
  creator_email: string;
  status: string;
  suspension_reason: string | null;
  member_count: number;
  project_count: number;
  created_at: string;
}

export interface AdminTeamMemberDTO {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface AdminTeamDetailDTO {
  id: number;
  name: string;
  description: string | null;
  creator_name: string;
  creator_email: string;
  status: string;
  suspended_by: number | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  member_count: number;
  members: AdminTeamMemberDTO[];
  active_project_count: number;
  total_crs_count: number;
  total_ai_tokens: number;
  created_at: string;
  recent_activity: AdminRecentActivityDTO[];
}

export interface AdminTeamStatusDTO {
  id: number;
  status: string;
  suspended_by: number | null;
  suspended_at: string | null;
  suspension_reason: string | null;
}

// ---------- Actions ----------

export interface AdminSuspendRequestDTO {
  action: "suspend" | "reactivate";
  reason?: string;
}

export interface AdminChangeRoleRequestDTO {
  role: "client" | "ba";
}

// ---------- Analytics ----------

export interface AdminAnalyticsDatasetDTO {
  label: string;
  data: number[];
}

export interface AdminTimeSeriesDTO {
  metric: string;
  from_date: string;
  to_date: string;
  group_by: string | null;
  labels: string[];
  datasets: AdminAnalyticsDatasetDTO[];
}

export interface AdminAnalyticsQueryDTO {
  metric: AdminAnalyticsMetric;
  from_date: string;
  to_date: string;
  group_by?: string;
}

// ---------- Logs ----------

export interface AdminLogEntryDTO {
  id: number;
  category: string;
  timestamp: string;
  actor: string | null;
  event: string;
  detail: string | null;
}

export interface AdminLogPageDTO {
  category: string;
  items: AdminLogEntryDTO[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface AdminAuditLogDTO {
  id: number;
  crs_id: number;
  action: string;
  changed_by_email: string;
  old_status: string | null;
  new_status: string | null;
  summary: string | null;
  changed_at: string;
}

export interface AdminErrorLogDTO {
  id: number;
  error_code: string;
  path: string;
  method: string;
  message: string;
  user_id: number | null;
  created_at: string;
}
