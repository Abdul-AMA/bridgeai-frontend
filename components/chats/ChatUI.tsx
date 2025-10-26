"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatUIProps {
  chat: {
    id: string;
    name: string;
    participants: string[];
  };
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

export function ChatUI({ chat }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "Alice", text: "Hey, did you review the document?", time: "10:00 AM" },
    { id: 2, sender: "Bob", text: "Yes, looks good. Let’s discuss in the meeting.", time: "10:05 AM" },
  ]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "You",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
        <p className="text-sm text-gray-500">{chat.participants.join(", ")}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-md shadow ${
                msg.sender === "You"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-base leading-relaxed">{msg.text}</p>
              <span className="text-xs opacity-70 block mt-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white flex gap-3">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} className="bg-indigo-600 text-white hover:bg-indigo-700">
          Send
        </Button>
      </div>
    </div>
  );
}
