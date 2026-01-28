/**
 * CRS Service
 * Unified service for all CRS-related API operations
 * Single Responsibility: CRS domain operations and API communication
 * 
 * Consolidated from:
 * - services/crs.service.ts (review/requests endpoints)
 * - lib/api-crs.ts (session/preview/export endpoints)
 */

import {
  CRSDTO,
  CreateCRSRequestDTO,
  UpdateCRSStatusRequestDTO,
  CRSStatus,
  CRSPattern,
  CRSAuditLogDTO,
} from "@/dto/crs.dto";
import { getAuthToken } from "./token.service";
import { CRSError, parseApiError } from "./errors.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * CRS Preview Response (not persisted)
 */
export interface CRSPreviewOut {
  content: string;
  summary_points: string[];
  overall_summary: string;
  is_complete: boolean;
  completeness_percentage: number;
  missing_required_fields: string[];
  missing_optional_fields: string[];
  filled_optional_count: number;
  weak_fields: string[];
  field_sources: Record<string, string>;
  project_id: number;
  session_id: number;
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

// ============================================================================
// SESSION-SPECIFIC CRS OPERATIONS
// ============================================================================

/**
 * Fetch the CRS document linked to a specific chat session
 * Returns null if no CRS exists for this session
 */
export async function fetchCRSForSession(sessionId: number): Promise<CRSDTO | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs/session/${sessionId}`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (response.status === 404) {
      return null; // No CRS for this session
    }

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
 * Get CRS preview for a session (not persisted, shows progress)
 * Supports pattern parameter to generate preview with specific CRS pattern
 */
export async function getPreviewCRS(
  sessionId: number,
  pattern?: CRSPattern
): Promise<CRSPreviewOut> {
  try {
    const url = pattern
      ? `${API_BASE_URL}/api/crs/sessions/${sessionId}/preview?pattern=${pattern}`
      : `${API_BASE_URL}/api/crs/sessions/${sessionId}/preview`;

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
 * Generate and persist a draft CRS from current conversation
 * Creates a draft status CRS even if incomplete
 * Supports pattern parameter to specify CRS pattern
 */
export async function generateDraftCRS(
  sessionId: number,
  pattern?: CRSPattern
): Promise<CRSDTO> {
  try {
    const url = pattern
      ? `${API_BASE_URL}/api/crs/sessions/${sessionId}/generate-draft?pattern=${pattern}`
      : `${API_BASE_URL}/api/crs/sessions/${sessionId}/generate-draft`;

    const response = await fetch(url, {
      method: "POST",
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

// ============================================================================
// PROJECT-SPECIFIC CRS OPERATIONS
// ============================================================================

/**
 * Fetch the latest CRS for a project
 */
export async function fetchLatestCRS(projectId: number): Promise<CRSDTO | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/crs/latest?project_id=${projectId}`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

    if (response.status === 404) {
      return null;
    }

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
 * Fetch all CRS versions for a project
 */
export async function fetchCRSVersions(projectId: number): Promise<CRSDTO[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/crs/versions?project_id=${projectId}`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

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

// ============================================================================
// REVIEW & REQUEST OPERATIONS (BA & CLIENT VIEWS)
// ============================================================================

/**
 * Fetch CRS documents for review (BA only)
 * If teamId is not provided, fetches from all teams where BA is a member
 */
export async function fetchCRSForReview(
  teamId?: number,
  status?: CRSStatus
): Promise<CRSDTO[]> {
  try {
    const params = new URLSearchParams();
    if (teamId) {
      params.append("team_id", teamId.toString());
    }
    if (status) {
      params.append("status", status);
    }

    const url = params.toString()
      ? `${API_BASE_URL}/api/crs/review?${params.toString()}`
      : `${API_BASE_URL}/api/crs/review`;

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

// ============================================================================
// CRS DOCUMENT OPERATIONS (CREATE, UPDATE, FETCH)
// ============================================================================

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
    const response = await fetch(`${API_BASE_URL}/api/crs/`, {
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
 * Update CRS status (approval workflow)
 * Backend uses PUT method, not PATCH
 */
export async function updateCRSStatus(
  crsId: number,
  statusUpdate: UpdateCRSStatusRequestDTO
): Promise<CRSDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs/${crsId}/status`, {
      method: "PUT",
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
 * Update CRS content directly (in-place editor)
 */
export async function updateCRSContent(
  crsId: number,
  content: string,
  expectedVersion?: number,
  fieldSources?: Record<string, string>
): Promise<CRSDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crs/${crsId}/content`, {
      method: "PUT",
      headers: createAuthHeaders(),
      body: JSON.stringify({
        content,
        expected_version: expectedVersion,
        field_sources: fieldSources,
      }),
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

// ============================================================================
// EXPORT & AUDIT OPERATIONS
// ============================================================================

/**
 * Export CRS document in specified format (PDF, Markdown, CSV)
 */
export async function exportCRS(
  crsId: number,
  format: "pdf" | "markdown" | "csv" = "pdf",
  requirementsOnly: boolean = false
): Promise<Blob> {
  const token = getAuthToken();
  if (!token) {
    throw new CRSError("No authentication token found", 401);
  }

  try {
    const params = new URLSearchParams({ format });
    if (requirementsOnly && format === "csv") {
      params.append("requirements_only", "true");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/crs/${crsId}/export?${params.toString()}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      error instanceof Error ? error.message : "Export failed"
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
