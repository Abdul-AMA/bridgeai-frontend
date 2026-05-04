import { ProjectContextSummaryDTO } from "@/dto/summary.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return { Authorization: `Bearer ${token}` };
}

export const summaryService = {
  async getSummary(projectId: number): Promise<ProjectContextSummaryDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/context-summary`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch project summary");
    return res.json();
  },

  async regenerateSummary(projectId: number): Promise<ProjectContextSummaryDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/context-summary/regenerate`,
      { method: "POST", headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to trigger summary regeneration");
    return res.json();
  },
};
