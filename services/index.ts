/**
 * Services Export
 * Central export point for all services
 */

// Auth services
export { loginUser, registerUser, getCurrentUser, AuthenticationError } from "./auth.service";
export {
  storeAuthToken,
  storeUserRole,
  getAuthToken,
  getUserRole,
  clearAuthData,
  notifyAuthStateChange,
} from "./token.service";

// Error services
export {
  ApiError,
  AuthError,
  CRSError,
  ChatError,
  TeamError,
  ProjectError,
  parseApiError,
} from "./errors.service";

// Team services
export {
  fetchTeams,
  fetchTeamById,
  createTeam,
  inviteTeamMember,
  deleteTeam,
  updateTeam,
  updateTeamStatus,
  archiveTeam,
  activateTeam,
  deactivateTeam,
  TeamsError,
} from "./teams.service";

// Project services
export {
  fetchTeamProjects,
  createProject,
  fetchPendingProjects,
  approveProject,
  rejectProject,
  fetchProjectById,
  ProjectsError,
} from "./projects.service";

// CRS services
export {
  fetchCRSForSession,
  getPreviewCRS,
  generateDraftCRS,
  fetchLatestCRS,
  fetchCRSVersions,
  fetchCRSForReview,
  fetchMyCRSRequests,
  fetchCRSById,
  createCRS,
  updateCRSStatus,
  exportCRS,
  fetchCRSAudit,
} from "./crs.service";
export type { CRSPreviewOut } from "./crs.service";

// Chat services
export { getPreviewCRS as getChatPreviewCRS } from "./chat.service";
