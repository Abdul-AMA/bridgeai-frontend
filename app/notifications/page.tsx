/**
 * Notifications Page
 * Displays user notifications with filtering
 * Refactored for SOLID principles and best practices
 */

"use client";

import { useState, useCallback } from "react";
import { Bell } from "lucide-react";
import { useNotificationsList } from "@/hooks";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { NotificationsFilter } from "@/components/notifications/NotificationsFilter";
import { TeamInvitationModal } from "@/components/notifications/TeamInvitationModal";

export default function NotificationsPage() {
  const {
    notifications,
    isLoading,
    error,
    filter,
    setFilter,
    refetchNotifications,
  } = useNotificationsList();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeInviteToken, setActiveInviteToken] = useState<string | null>(
    null
  );
  const [activeInviteNotificationId, setActiveInviteNotificationId] = useState<
    number | undefined
  >(undefined);

  const handleOpenInvitation = useCallback(
    (token: string, notificationId: number) => {
      setActiveInviteToken(token);
      setActiveInviteNotificationId(notificationId);
      setInviteModalOpen(true);
    },
    []
  );

  const handleCloseInvitation = useCallback((open: boolean) => {
    setInviteModalOpen(open);
    if (!open) {
      setActiveInviteToken(null);
      setActiveInviteNotificationId(undefined);
    }
  }, []);

  const handleResolved = useCallback(() => {
    refetchNotifications();
  }, [refetchNotifications]);

  return (
    <div className="p-6 mt-15">
      {/* Invitation Modal */}
      <TeamInvitationModal
        open={inviteModalOpen}
        onOpenChange={handleCloseInvitation}
        invitationToken={activeInviteToken}
        notificationId={activeInviteNotificationId}
        onResolved={handleResolved}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <NotificationsFilter filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingSpinner className="py-12" message="Loading notifications..." />
      )}

      {/* Error State */}
      {error && !isLoading && <ErrorState message={error} />}

      {/* Empty State */}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No notifications</p>
        </div>
      )}

      {/* Notifications List */}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => {
                if (
                  notification.metadata?.action_type === "invitation_received" &&
                  notification.metadata?.invitation_token
                ) {
                  handleOpenInvitation(
                    notification.metadata.invitation_token,
                    notification.id
                  );
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
