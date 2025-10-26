"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Member {
  name: string;
  email: string;
}

interface TeamSettingsGridProps {
  teamName?: string;
  teamDescription?: string;
  members?: Member[];
  pendingInvites?: Member[];
}

export function TeamSettingsGrid({
  teamName = "Awesome Team",
  teamDescription = "This is the team description",
  members = [
    { name: "Alice Smith", email: "alice@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ],
  pendingInvites = [
    { name: "Charlie Brown", email: "charlie@example.com" },
    { name: "Charlie Brown", email: "charlie@example.com" },
  ],
}: TeamSettingsGridProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Team Info Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Team Info</h2>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            Save Changes
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={teamName}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={teamDescription}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            />
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>

        {/* Current Members */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Members</h3>
          <ul className="flex flex-col gap-3">
            {members.map((member, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-[#341bab] text-white flex items-center justify-center font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-black">{member.name}</span>
                  <span className="text-sm text-gray-600">{member.email}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pending Invites */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Invites</h3>
          <ul className="flex flex-col gap-3">
            {pendingInvites.map((invite, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-2 rounded-md bg-yellow-50"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">
                  {invite.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-black">{invite.name}</span>
                  <span className="text-sm text-gray-600">{invite.email}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
