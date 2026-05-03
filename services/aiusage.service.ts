import { AIUsageHistoryDTO, AIUsageSummaryDTO } from "@/dto/aiusage.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class AiUsageError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AiUsageError";
  }
}

function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) throw new AiUsageError("No authentication token found", 401);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return (data as { detail?: string; message?: string }).detail ||
      (data as { message?: string }).message ||
      "An error occurred";
  } catch {
    return "An error occurred";
  }
}

export async function fetchUsageSummary(days = 30): Promise<AIUsageSummaryDTO> {
  const response = await fetch(
    `${API_BASE_URL}/api/usage/me/summary?days=${days}`,
    { method: "GET", headers: createAuthHeaders() }
  );
  if (!response.ok) {
    throw new AiUsageError(await parseError(response), response.status);
  }
  return response.json();
}

export async function fetchUsageHistory(
  page = 1,
  limit = 20
): Promise<AIUsageHistoryDTO> {
  const response = await fetch(
    `${API_BASE_URL}/api/usage/me/history?page=${page}&limit=${limit}`,
    { method: "GET", headers: createAuthHeaders() }
  );
  if (!response.ok) {
    throw new AiUsageError(await parseError(response), response.status);
  }
  return response.json();
}
