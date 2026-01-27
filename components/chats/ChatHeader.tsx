/**
 * ChatHeader Component
 * Displays chat session information and connection status
 */

"use client";

import { ArrowLeft, WifiOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectionState, ChatSessionDTO, CurrentUserDTO } from "@/dto";
import { ExportButton } from "@/components/shared/ExportButton";
import { PreviewCRSButton } from "@/components/chats/PreviewCRSButton";

interface ChatHeaderProps {
  chat: ChatSessionDTO;
  currentUser: CurrentUserDTO;
  connectionState: ConnectionState;
  returnTo?: string;
  canGenerateCRS: boolean;
  crsId?: number;
  chatTranscript: string;
  onGenerateCRS: () => void;
  onViewCRS: () => void;
  isRejected: boolean;
  isApproved: boolean;
}

export function ChatHeader({
  chat,
  currentUser,
  connectionState,
  returnTo,
  canGenerateCRS,
  crsId,
  chatTranscript,
  onGenerateCRS,
  onViewCRS,
  isRejected,
  isApproved,
}: ChatHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (returnTo) {
      try {
        sessionStorage.removeItem("chatReturnTo");
      } catch {
        // ignore
      }
      router.push(returnTo);
    } else {
      router.back();
    }
  };

  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          aria-label="Back to project"
          onClick={handleBackClick}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
          <p className="text-sm text-gray-500">
            {currentUser.full_name ? `${currentUser.full_name} - ` : ""}Project chat #{chat.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
            connectionState === "open"
              ? "bg-green-50 text-green-700"
              : connectionState === "connecting"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {connectionState === "connecting" && <Loader2 className="h-3 w-3 animate-spin" />}
          {connectionState !== "open" && <WifiOff className="h-3 w-3" />}
          <span>
            {connectionState === "open"
              ? "Connected"
              : connectionState === "connecting"
              ? "Connecting..."
              : "Disconnected"}
          </span>
        </div>

        <ExportButton
          projectId={chat.project_id}
          content={chatTranscript}
          filename={`chat-${chat.id}-${chat.name.replace(/\s+/g, "-").toLowerCase()}`}
          crsId={crsId}
        />

        <PreviewCRSButton
          sessionId={chat.id}
          sessionStatus={chat.status}
          variant="outline"
          size="default"
        />

        {canGenerateCRS && (
          <Button onClick={onGenerateCRS} variant="primary">
            {isRejected ? "Regenerate CRS" : "Generate CRS document"}
          </Button>
        )}

        <Button onClick={onViewCRS} variant="secondary">
          View CRS {isApproved && "(Approved)"}
        </Button>
      </div>
    </div>
  );
}
