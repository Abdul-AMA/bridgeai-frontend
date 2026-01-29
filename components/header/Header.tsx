"use client";

import { useHeaderLogic } from "@/hooks/header/useHeaderLogic";
import { HeaderLogo } from "./HeaderLogo";
import { TeamSelector } from "./TeamSelector";
import { UserMenu } from "./UserMenu";
import { AuthButtons } from "./AuthButtons";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  currentTeamId?: string;
  setCurrentTeamId?: (id: string) => void;
}

export function Header({
  currentTeamId: initialTeamId,
  setCurrentTeamId,
}: HeaderProps) {
  const {
    isAuthenticated,
    currentUser,
    currentTeamId,
    currentTeamName,
    teams,
    loadingTeams,
    handleTeamSelect,
    handleLogout,
    handleProfileClick,
    shouldShowTeamSelector,
  } = useHeaderLogic(initialTeamId, setCurrentTeamId);

  return (
    <header className="fixed top-0 left-0 w-full h-12 px-4 sm:px-3 bg-white border-b z-50 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <HeaderLogo />

        {isAuthenticated && shouldShowTeamSelector && (
          <TeamSelector
            currentTeamName={currentTeamName}
            currentTeamId={currentTeamId}
            teams={teams}
            loading={loadingTeams}
            onTeamSelect={handleTeamSelect}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated === null ? (
          // Loading state - show nothing or a skeleton to prevent flash
          <div className="w-20 h-8" />
        ) : isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <NotificationBell />

            <UserMenu
              user={currentUser}
              onLogout={handleLogout}
              onProfileClick={handleProfileClick}
            />
          </>
        ) : (
          <AuthButtons />
        )}
      </div>
    </header>
  );
}
