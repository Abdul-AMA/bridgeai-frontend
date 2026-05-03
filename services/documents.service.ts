/**
 * Documents Service
 * Handles project knowledge base file uploads and management
 */

import { DocumentDTO, DocumentListDTO } from "@/dto/documents.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class DocumentsError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "DocumentsError";
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) throw new DocumentsError("No authentication token found", 401);
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = (body as { detail?: string }).detail || "Request failed";
    throw new DocumentsError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

export async function uploadDocument(
  projectId: number,
  file: File
): Promise<DocumentDTO> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/documents`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: form,
    }
  );
  return handleResponse<DocumentDTO>(res);
}

export async function listDocuments(projectId: number): Promise<DocumentDTO[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/documents`,
    { headers: getAuthHeaders() }
  );
  const data = await handleResponse<DocumentListDTO>(res);
  return data.items;
}

export async function deleteDocument(
  projectId: number,
  docId: number
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/documents/${docId}`,
    { method: "DELETE", headers: getAuthHeaders() }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = (body as { detail?: string }).detail || "Delete failed";
    throw new DocumentsError(msg, res.status);
  }
}
