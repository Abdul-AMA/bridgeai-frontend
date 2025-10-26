import { ChatUI } from "@/components/chats/ChatUI";

interface ChatPageProps {
  params: { id: string };
}

// Mock function to fetch chat data
const getChatById = (id: string) => {
  const chats = [
    { id: "1", name: "Project Kickoff", participants: ["Alice", "Bob"] },
    { id: "2", name: "Design Review", participants: ["Charlie", "Dana"] },
    { id: "3", name: "Client Meeting", participants: ["Eve", "Frank"] },
  ];
  return chats.find(c => c.id === id);
};

export default function ChatPage({ params }: ChatPageProps) {
  const chat = getChatById(params.id);

  if (!chat) return <p className="text-center mt-20">Chat not found</p>;

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-4xl bg-white shadow rounded-2xl flex flex-col h-[80vh]">
        <ChatUI chat={chat} />
      </div>
    </div>
  );
}
