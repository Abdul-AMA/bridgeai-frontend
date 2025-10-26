"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Clock, File, MessageCircle, Plus, Users } from "lucide-react";

export function DashboardGrid() {
  const [isAddProjectOpen, setAddProjectOpen] = useState(false);
  const [isStartChatOpen, setStartChatOpen] = useState(false);
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);

  // Example projects list for dropdown
  const projects = [
    { id: 1, name: "Website Redesign" },
    { id: 2, name: "Mobile App Development" },
    { id: 3, name: "Database Migration" },
  ];

  return (
    <div className="flex mb-14 flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      {/* Row 1: Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Projects"
          value={24}
          statusCounts={{ Active: 12, Completed: 8, Pending: 4 }}
          icon={<File />}
        />
        <StatCard
          title="Chats"
          value={18}
          statusCounts={{ Active: 10, Completed: 5, Pending: 3 }}
          icon={<MessageCircle />}
        />
        <StatCard
          title="Requests"
          value={7}
          statusCounts={{ Active: 3, Completed: 3, Pending: 1 }}
          icon={<Clock />}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          {/* Recent Projects */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex justify-between items-center">
                  <p className="font-medium">{p.name}</p>
                  <StatusBadge status="active" />
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Chats */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <p>Ahmed Hassan</p>
                <StatusBadge status="active" />
              </li>
              <li className="flex justify-between items-center">
                <p>Sarah Johnson</p>
                <StatusBadge status="pending" />
              </li>
            </ul>
          </section>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1 flex flex-col gap-6">
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setAddProjectOpen(true)}
              >
                <Plus className="w-4 h-4" /> Add Project
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setStartChatOpen(true)}
              >
                <MessageCircle className="w-4 h-4" /> Start Chat
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setAddMemberOpen(true)}
              >
                <Users className="w-4 h-4" /> Add Team Member
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {isAddProjectOpen && (
        <Modal onClose={() => setAddProjectOpen(false)} title="Add Project">
          <input
            type="text"
            placeholder="Project Name"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded mb-2"
          />
          <Button 
            className="cursor-pointer"
            onClick={() => setAddProjectOpen(false)}
          >
            Create
          </Button>
        </Modal>
      )}

      {isStartChatOpen && (
        <Modal onClose={() => setStartChatOpen(false)} title="Start Chat">
          <select className="w-full p-2 border rounded mb-2">
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Chat Name"
            className="w-full p-2 border rounded mb-2"
          />
          <Button 
            className="cursor-pointer"
            onClick={() => setStartChatOpen(false)}
          >
            Start
          </Button>
        </Modal>
      )}

      {isAddMemberOpen && (
        <Modal onClose={() => setAddMemberOpen(false)} title="Add Team Member">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          <Button 
            className="cursor-pointer"
            onClick={() => setAddMemberOpen(false)}
            >
              Send Invite
            </Button>
        </Modal>
      )}
    </div>
  );
}

// Generic Modal Component
function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: { [key: string]: number };
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  statusCounts,
  icon,
}: StatCardProps) {
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
  };

  return (
    <div
      className={`relative p-5 rounded-2xl ${cardBgColors[title] || "bg-gray-200"}`}
    >
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
            <div
              key={status}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-black">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
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
