"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatUI } from "@/components/chats/ChatUI";
import { ChatDetail, fetchProjectChat } from "@/lib/api-chats";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  // Unwrap params (Next.js now passes params as a promise)
  const { id } = use(params);

  const searchParams = useSearchParams();
  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const projectIdFromQuery = searchParams?.get("projectId");

  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        setError(null);

        let projectId = projectIdFromQuery ? Number(projectIdFromQuery) : undefined;

        // Fallback: infer projectId from stored return path if query param missing
        if (!projectId) {
          try {
            const stored = sessionStorage.getItem("chatReturnTo");
            const match = stored?.match(/projects\/(\d+)/);
            if (match) projectId = Number(match[1]);
          } catch {
            // ignore storage errors
          }
        }

        if (!projectId || Number.isNaN(projectId)) {
          setError("Missing project reference for this chat.");
          return;
        }

        const data = await fetchProjectChat(projectId, Number(id));
        setChat(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [id, projectIdFromQuery]);

  const chatForUI = useMemo(() => {
    if (!chat) return null;
    return {
      id: chat.id.toString(),
      name: chat.name,
      participants: ["You", "Project team"],
    };
  }, [chat]);

  if (loading) {
    return <p className="text-center mt-20">Loading chat...</p>;
  }

  if (error || !chatForUI) {
    return <p className="text-center mt-20 text-red-600">{error || "Chat not found"}</p>;
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-4xl bg-white shadow rounded-2xl flex flex-col h-[80vh]">
        <ChatUI chat={chatForUI} />
      </div>
    </div>
  );
}
