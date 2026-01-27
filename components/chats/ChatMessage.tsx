"use client";

import { motion } from "framer-motion";
import { Bot, HelpCircle, FileText, User as UserIcon, Briefcase, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export type MessageType = "user" | "ai" | "ai-clarification" | "ai-crs" | "ba";

export interface ChatMessageData {
  id: number;
  session_id: number;
  sender_type: "client" | "ai" | "ba";
  sender_id: number | null;
  content: string;
  timestamp: string;
  pending?: boolean;
  failed?: boolean;
  _localId?: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
  isOwn: boolean;
  currentUserName?: string;
}

// Detect message type based on content patterns
function detectMessageType(message: ChatMessageData): MessageType {
  if (message.sender_type === "ba") return "ba";
  if (message.sender_type === "client") return "user";

  // AI message type detection
  if (message.sender_type === "ai") {
    const content = message.content.toLowerCase();

    // Check for CRS/template filler responses
    if (
      content.includes("✅") ||
      content.includes("crs document") ||
      content.includes("**summary:**") ||
      content.includes("generated a complete") ||
      content.includes("captured your requirements")
    ) {
      return "ai-crs";
    }

    // Check for clarification questions
    if (
      content.includes("i'd like to clarify") ||
      content.includes("clarify a few points") ||
      content.includes("can you provide more details") ||
      content.includes("could you clarify") ||
      content.includes("1.") && content.includes("2.") && content.includes("?")
    ) {
      return "ai-clarification";
    }

    return "ai";
  }

  return "user";
}

// Get icon for message type
function getMessageIcon(type: MessageType) {
  switch (type) {
    case "ai-clarification":
      return <HelpCircle className="w-4 h-4" />;
    case "ai-crs":
      return <FileText className="w-4 h-4" />;
    case "ai":
      return <Sparkles className="w-4 h-4" />;
    case "ba":
      return <Briefcase className="w-4 h-4" />;
    case "user":
    default:
      return <UserIcon className="w-4 h-4" />;
  }
}

export function ChatMessage({ message, isOwn, currentUserName }: ChatMessageProps) {
  const messageType = detectMessageType(message);
  const icon = getMessageIcon(messageType);
  const isUser = isOwn; // Map isOwn to isUser for the reference logic

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isUser
          ? "bg-chat-user text-primary"
          : messageType === 'ba'
            ? "bg-purple-100 text-purple-700"
            : "bg-white text-primary border border-primary/20"
          }`}
      >
        {icon}
      </div>

      {/* Message Bubble */}
      <div
        className={`flex-1 rounded-2xl px-5 py-4 shadow-sm ${isUser
          ? "bg-chat-user text-primary rounded-tr-sm max-w-[75%] md:max-w-xl"
          : "bg-chat-ai text-foreground/90 rounded-tl-sm border border-border/50 max-w-[80%] md:max-w-2xl"
          }`}
      >
        {/* Content */}
        <div className={`text-base leading-relaxed ${isUser ? 'text-primary' : 'text-foreground'}`}>
          <div className={`prose prose-sm max-w-none ${isUser ? '' : ''} prose-p:my-1 prose-ul:my-1 prose-li:my-0.5`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Timestamp & Status */}
        <div className={`flex items-center gap-2 text-[10px] mt-2 opacity-70 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.pending && (
            <span className="uppercase tracking-wide">sending...</span>
          )}
          {message.failed && (
            <span className="uppercase tracking-wide text-red-500 font-bold">failed</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white text-primary border border-primary/20 shadow-sm">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="bg-chat-ai border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-12">
        <motion.div
          className="w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
