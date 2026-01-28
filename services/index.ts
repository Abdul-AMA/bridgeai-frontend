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
  updateProject,
  ProjectsError,
} from "./projects.service";

// Chats services
export {
  fetchProjectChats,
  fetchChatById,
  createChat,
  updateChat,
  deleteChat,
  ChatsError,
} from "./chats.service";
export type {
  ChatSummaryDTO,
  ChatDetailDTO,
  ChatMessageDTO,
  CreateChatRequestDTO,
  UpdateChatRequestDTO,
  SessionStatus,
  CRSPattern,
} from "./chats.service";

// Notification services
export {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  acceptInvitationFromNotification,
  NotificationError,
} from "./notifications.service";

// Invitation services
export {
  sendInvitation,
  getInvitationDetails,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  resendInvitation,
  getPendingInvitations,
  InvitationError,
} from "./invitations.service";

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
