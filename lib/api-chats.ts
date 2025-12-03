/**
 * API utilities for chat-related operations
 */
import { apiCall } from "./api";

export interface ChatSummary {
  id: string;
  name: string;
  lastMessage?: string;
  date?: string;
  project_id?: number;
}

export interface ChatDetail {
  id: string;
  name: string;
  participants: string[];
  messages?: Array<{ sender: string; text: string; time: string }>;
}

const MOCK_CHATS: ChatSummary[] = [
  { id: "1", name: "Client Meeting", lastMessage: "Reviewed designs", date: "2025-09-16" },
  { id: "2", name: "Dev Discussion", lastMessage: "Merged feature branch", date: "2025-09-15" },
  { id: "3", name: "Team Standup", lastMessage: "Blocked tasks discussed", date: "2025-09-14" },
];

const MOCK_CHAT_DETAIL: ChatDetail = {
  id: "1",
  name: "Client Meeting",
  participants: ["You", "Project BA"],
  messages: [
    { sender: "Project BA", text: "Please review the CRS draft.", time: "10:00 AM" },
    { sender: "You", text: "Will do, thanks.", time: "10:02 AM" },
  ],
};

/**
 * Fetch chats for a given project. Falls back to mock data if the backend call fails.
 */
export async function fetchProjectChats(projectId: number): Promise<ChatSummary[]> {
  try {
    const data = await apiCall<ChatSummary[]>(`/api/projects/${projectId}/chats`);
    return data;
  } catch (err) {
    // Backend might not be available yet — return mock data so UI can be built.
    console.warn("fetchProjectChats failed, returning mock data:", err);
    return MOCK_CHATS.map((c) => ({ ...c, project_id: projectId }));
  }
}

/**
 * Fetch a single chat detail (project-scoped). Falls back to mock.
 */
export async function fetchProjectChat(projectId: number, chatId: string): Promise<ChatDetail | null> {
  try {
    const data = await apiCall<ChatDetail>(`/api/projects/${projectId}/chats/${chatId}`);
    return data;
  } catch (err) {
    console.warn("fetchProjectChat failed, returning mock chat:", err);
    // If chatId matches mock, return the mock detail, otherwise return a generated detail
    if (chatId === MOCK_CHAT_DETAIL.id) return MOCK_CHAT_DETAIL;
    return {
      id: chatId,
      name: `Chat ${chatId}`,
      participants: ["You", "Member A"],
      messages: [],
    };
  }
}

/**
 * Optionally fetch all chats for the current client across projects.
 */
export async function fetchAllClientChats(): Promise<ChatSummary[]> {
  try {
    return await apiCall<ChatSummary[]>(`/api/chats`);
  } catch (err) {
    console.warn("fetchAllClientChats failed, returning mock data:", err);
    return MOCK_CHATS;
  }
}
