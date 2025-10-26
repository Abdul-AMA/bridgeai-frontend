"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Users, File, Clock } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useRouter } from "next/navigation";

interface ProjectPageGridProps {
  projectName: string;
  projectDescription?: string; // now required
  userRole: "BA" | "Client";
}

// Mock data
const mockChats = [
  { id: "1", name: "Client Meeting", lastMessage: "Reviewed designs", date: "2025-09-16" },
  { id: "2", name: "Dev Discussion", lastMessage: "Merged feature branch", date: "2025-09-15" },
  { id: "3", name: "Team Standup", lastMessage: "Blocked tasks discussed", date: "2025-09-14" },
];

const mockRequests = [
  { id: "1", title: "Request 1", status: "Pending", date: "2025-09-16" },
  { id: "2", title: "Request 2", status: "Completed", date: "2025-09-15" },
];

const mockDocuments = [
  { id: "1", title: "Project Specification v2.1", date: "2025-09-14" },
  { id: "2", title: "Client Proposal", date: "2025-09-13" },
  { id: "3", title: "Meeting Notes", date: "2025-09-12" },
];

export function ProjectPageGrid({ projectName, projectDescription, userRole }: ProjectPageGridProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "chats" | "settings">("dashboard");

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {["dashboard", "chats", "settings"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-[#341bab] text-black"
                : "text-gray-500 hover:text-black hover:cursor-pointer"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab === "dashboard" ? "Dashboard" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && <DashboardTab userRole={userRole} />}
      {activeTab === "chats" && <ChatsTab chats={mockChats} />}
      {activeTab === "settings" && (
        <SettingsTab projectName={projectName} projectDescription={projectDescription} />
      )}
    </div>
  );
}

// Dashboard Tab Content
function DashboardTab({ userRole }: { userRole: "BA" | "Client" }) {
  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      {/* Top Row: Two Stat Cards + Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        {userRole === "Client" && (
          <StatCard
            title="Chats"
            value={mockChats.length}
            statusCounts={{ Active: 1, Completed: 1, Pending: 0 }}
            icon={<MessageCircle />}
          />
        )}
        {userRole === "BA" && (
          <StatCard
            title="Requests"
            value={mockRequests.length}
            statusCounts={{ Active: 1, Completed: 1, Pending: 0 }}
            icon={<Clock />}
          />
        )}
        <StatCard
          title="Documents"
          value={mockRequests.length}
          statusCounts={{ Active: 1, Completed: 1, Pending: 0 }}
          icon={<Clock />}
        />


        {/* Quick Actions */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Start Chat
          </Button>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Add Team Member
          </Button>
        </section>
      </div>

      {/* Bottom: Recent Chats & Documents */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="flex flex-col gap-6">
          {/* Recent Chats / Requests */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              {userRole === "BA" ? "Recent Chats" : "Recent Requests"}
            </h2>
            <ul className="space-y-3">
              {(userRole === "BA" ? mockChats : mockRequests).map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <p className="text-black font-medium">{item.name || item.title}</p>
                  {item.status && <StatusBadge status={item.status} />}
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Documents */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
            <ul className="space-y-3">
              {mockDocuments.map((doc) => (
                <li key={doc.id} className="text-black">{doc.title}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// Chats Tab Content
function ChatsTab({ chats }: { chats: typeof mockChats }) {
  const router = useRouter();

  const handleChatClick = (id: string) => {
    router.push(`/chats/${id}`);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-y-auto max-h-[70vh]">
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <div>
                <p className="font-medium text-black">{chat.name}</p>
                <p className="text-gray-500 text-sm">{chat.lastMessage}</p>
              </div>
              <p className="text-gray-400 text-xs">{chat.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Settings Tab Content
function SettingsTab({ projectName, projectDescription }: { projectName: string; projectDescription: string }) {
  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Project Info</h2>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            Save Changes
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={projectName}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={projectDescription}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// StatCard component
interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: { [key: string]: number };
  icon?: React.ReactNode;
}

export function StatCard({ title, value, statusCounts, icon }: StatCardProps) {
  const statusColors: { [key: string]: string } = {
    Active: "bg-green-200 text-black",
    Completed: "bg-blue-200 text-black",
    Pending: "bg-yellow-200 text-black",
    Cancelled: "bg-red-200 text-black",
  };

  const cardBgColors: { [key: string]: string } = {
    Projects: "bg-[#eceded]",
    Chats: "bg-[#eceded]",
    Requests: "bg-[#eceded]",
    Documents: "bg-[#eceded]",
  };

  return (
    <div className={`relative p-5 rounded-2xl ${cardBgColors[title] || "bg-gray-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl text-black">{icon}</div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <div className="text-3xl font-bold text-black">{value}</div>
      </div>
      {statusCounts && (
        <div className="flex flex-col gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center text-sm">
              <span className="text-black">{status}</span>
              <span
                className={`px-2 py-1 rounded-full font-semibold text-xs ${
                  statusColors[status] || "bg-gray-300 text-black"
                }`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
