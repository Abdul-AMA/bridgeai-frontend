import { apiCall } from './api';

export interface Notification {
  id: number;
  user_id: number;
  type: 'project_approval' | 'team_invitation';
  reference_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: {
    // For project notifications
    project_id?: number;
    project_name?: string;
    project_status?: string;
    project_description?: string;
    // For team invitation notifications
    team_id?: number;
    team_name?: string;
    invitation_token?: string;
    invitation_role?: string;
    action_type?: 'invitation_received' | 'invitation_accepted';
  };
}

export interface NotificationList {
  notifications: Notification[];
  unread_count: number;
  total_count: number;
}

export const notificationAPI = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (unreadOnly: boolean = false): Promise<NotificationList> => {
    const params = new URLSearchParams();
    if (unreadOnly) {
      params.append('unread_only', 'true');
    }
    
    const url = `/api/notifications${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url, {
      method: 'GET'
    });
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (notificationId: number): Promise<Notification> => {
    return apiCall(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    return apiCall('/api/notifications/read-all', {
      method: 'PATCH'
    });
  },

  /**
   * Delete a specific notification
   */
  deleteNotification: async (notificationId: number): Promise<{ message: string }> => {
    return apiCall(`/api/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Accept a team invitation directly from notification
   */
  acceptInvitationFromNotification: async (notificationId: number): Promise<{ message: string; team_id: number; role: string }> => {
    return apiCall(`/api/notifications/${notificationId}/accept-invitation`, {
      method: 'POST'
    });
  }
};
