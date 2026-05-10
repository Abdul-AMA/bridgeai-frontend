import {
  GenerateTestCasesPayload,
  GenerateTestCasesResponse,
  RTMFilters,
  RTMStatusDTO,
  RequirementDTO,
  RequirementDetailDTO,
  TestCaseCreatePayload,
  TestCaseDTO,
  TestCaseUpdatePayload,
  TraceabilityLinkCreatePayload,
  TraceabilityLinkDTO,
} from "@/dto/rtm.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const rtmService = {
  async getRTMStatus(projectId: number): Promise<RTMStatusDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/status`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch RTM status");
    return res.json();
  },

  async triggerRefresh(projectId: number): Promise<void> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/refresh`,
      { method: "POST", headers: getAuthHeaders() }
    );
    if (!res.ok && res.status !== 409) throw new Error("Failed to trigger RTM refresh");
  },

  async getRequirements(
    projectId: number,
    filters?: RTMFilters
  ): Promise<RequirementDTO[]> {
    const params = new URLSearchParams();
    if (filters?.section) params.set("section", filters.section);
    if (filters?.coverage) params.set("coverage", filters.coverage);
    if (filters?.q) params.set("q", filters.q);
    const qs = params.toString();
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements${qs ? `?${qs}` : ""}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch requirements");
    return res.json();
  },

  async getRequirementDetail(
    projectId: number,
    reqId: string
  ): Promise<RequirementDetailDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements/${reqId}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch requirement detail");
    return res.json();
  },

  async addSourceLink(
    projectId: number,
    reqId: string,
    payload: TraceabilityLinkCreatePayload
  ): Promise<TraceabilityLinkDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements/${reqId}/links`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Failed to add source link");
    return res.json();
  },

  async removeSourceLink(
    projectId: number,
    reqId: string,
    linkId: number
  ): Promise<void> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements/${reqId}/links/${linkId}`,
      { method: "DELETE", headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to remove source link");
  },

  async generateTestCases(
    projectId: number,
    payload: GenerateTestCasesPayload
  ): Promise<GenerateTestCasesResponse> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/test-cases/generate`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Failed to generate test cases");
    return res.json();
  },

  async addTestCase(
    projectId: number,
    reqId: string,
    payload: TestCaseCreatePayload
  ): Promise<TestCaseDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements/${reqId}/test-cases`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Failed to add test case");
    return res.json();
  },

  async updateTestCase(
    projectId: number,
    reqId: string,
    tcId: number,
    payload: TestCaseUpdatePayload
  ): Promise<TestCaseDTO> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements/${reqId}/test-cases/${tcId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Failed to update test case");
    return res.json();
  },

  async deleteTestCase(
    projectId: number,
    reqId: string,
    tcId: number
  ): Promise<void> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/requirements/${reqId}/test-cases/${tcId}`,
      { method: "DELETE", headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to delete test case");
  },

  async exportRTM(projectId: number, format: "csv" | "pdf"): Promise<Blob> {
    const res = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/rtm/export?format=${format}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to export RTM");
    return res.blob();
  },
};
