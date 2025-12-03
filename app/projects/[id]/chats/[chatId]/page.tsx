"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatUI } from "@/components/chats/ChatUI";
import { fetchProjectChat } from "@/lib/api-chats";

interface ChatPageProps {
  params: { id: string; chatId: string };
}

export default function ProjectChatPage({ params }: ChatPageProps) {
  const { id: projectId, chatId } = params;
  const [chat, setChat] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjectChat(Number(projectId), chatId);
        setChat(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [projectId, chatId]);

  if (isLoading) return <p className="text-center mt-20">Loading chat...</p>;
  if (!chat) return <p className="text-center mt-20">Chat not found</p>;

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-4xl bg-white shadow rounded-2xl flex flex-col h-[80vh]">
        <ChatUI chat={chat} />
      </div>
    </div>
  );
}
