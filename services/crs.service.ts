/**
 * CRS Service
 * Handles all CRS-related API communication
 * Single Responsibility: External CRS operations
 */

import {
  CRSDTO,
  CreateCRSRequestDTO,
  UpdateCRSStatusRequestDTO,
  UpdateCRSStatusResponseDTO,
  CRSStatus,
  CRSAuditLogDTO,
} from "@/dto/crs.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for CRS errors
 */
export class CRSError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "CRSError";
  }
}

/**
 * Create authorization headers with token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new CRSError("No authentication token found", 401);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Parse API error response
 */
function parseApiError(error: unknown, statusCode: number): string {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as { detail?: string; message?: string };
    return errorObj.detail || errorObj.message || "An error occurred";
  }
  return "An error occurred";
}

/**
 * Fetch CRS documents for review (BA only)
 */
export async function fetchCRSForReview(
  teamId: number,
  status?: CRSStatus
): Promise<CRSDTO[]> {
  try {
    const url = status
      ? `${API_BASE_URL}/api/crs/review/team/${teamId}?status=${status}`
      : `${API_BASE_URL}/api/crs/review/team/${teamId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch my CRS requests (Client)
 */
export async function fetchMyCRSRequests(
  teamId: number,
  projectId?: number,
  status?: CRSStatus
): Promise<CRSDTO[]> {
  try {
    let url = `${API_BASE_URL}/api/crs/my-requests?team_id=${teamId}`;
    
    if (projectId) {
      url += `&project_id=${projectId}`;
    }
    
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Update CRS status
 */
export async function updateCRSStatus(
  crsId: number,
  statusUpdate: UpdateCRSStatusRequestDTO
): Promise<UpdateCRSStatusResponseDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs/${crsId}/status`, {
      method: "PATCH",
      headers: createAuthHeaders(),
      body: JSON.stringify(statusUpdate),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch a single CRS document by ID
 */
export async function fetchCRSById(crsId: number): Promise<CRSDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs/${crsId}`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Create a new CRS document
 */
export async function createCRS(
  crsData: CreateCRSRequestDTO
): Promise<CRSDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(crsData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Export CRS document in a given format
 */
export async function exportCRS(
  crsId: number,
  format: "pdf" | "markdown" | "csv" = "pdf"
): Promise<Blob> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/crs/${crsId}/export?format=${format}`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch audit logs for a CRS document
 */
export async function fetchCRSAudit(
  crsId: number
): Promise<CRSAuditLogDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs/${crsId}/audit`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new CRSError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CRSError) {
      throw error;
    }
    throw new CRSError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
