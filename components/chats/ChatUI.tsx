"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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

  // CRS modals
  const [openDraft, setOpenDraft] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [draftText, setDraftText] = useState<string>(
    "This is a mock CRS draft generated from the chat. Replace with backend document when available."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCRS = async () => {
    setIsGenerating(true);
    // Placeholder: call backend to generate CRS and save
    await new Promise((r) => setTimeout(r, 900));
    setIsGenerating(false);
    setOpenGenerate(false);
    // Open review modal so client can review before sending
    setOpenDraft(true);
  };

  const handleSendToBA = async () => {
    // Placeholder: save/send draft to BA
    setOpenDraft(false);
    alert("CRS draft saved and ready to send to BA (mock)");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
          <p className="text-sm text-gray-500">{chat.participants.join(", ")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpenGenerate(true)} variant="primary">
            Generate CRS document
          </Button>
          <Button onClick={() => setOpenDraft(true)} variant="secondary">
            View CRS draft
          </Button>
        </div>
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
        <Button onClick={handleSend} variant="primary">
          Send
        </Button>
      </div>

      {/* Generate CRS Dialog */}
      <Dialog open={openGenerate} onOpenChange={setOpenGenerate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate CRS Document</DialogTitle>
            <DialogDescription>
              This will generate a CRS document draft based on the chat conversation. You can review it before sending to BA.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-600">A draft will be generated and stored in the database (mock).</p>
          </div>
          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenGenerate(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGenerateCRS} variant="primary">{isGenerating ? "Generating..." : "Generate"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRS Draft Dialog */}
      <Dialog open={openDraft} onOpenChange={setOpenDraft}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CRS Draft & Statistics</DialogTitle>
            <DialogDescription>
              Review the latest CRS draft and some basic statistics. This is a mock preview while backend is not ready.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-lg w-1/3">
                <p className="text-sm font-semibold">Sections</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg w-1/3">
                <p className="text-sm font-semibold">Completion</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg w-1/3">
                <p className="text-sm font-semibold">Last Updated</p>
                <p className="text-2xl font-bold">2m ago</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Draft Preview</label>
              <textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} className="w-full min-h-[200px] rounded-md border p-3 text-black" />
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenDraft(false)} variant="outline">Close</Button>
            <Button onClick={handleSendToBA} variant="primary">Save & Send to BA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
