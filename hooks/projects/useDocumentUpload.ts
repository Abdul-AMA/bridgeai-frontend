/**
 * useDocumentUpload Hook
 * Manages project knowledge base documents: upload, list, delete
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DocumentDTO } from "@/dto/documents.dto";
import {
  uploadDocument,
  listDocuments,
  deleteDocument,
  DocumentsError,
} from "@/services/documents.service";

const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown"];
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];
const MAX_SIZE_MB = 10;

interface UseDocumentUploadResult {
  documents: DocumentDTO[];
  uploading: boolean;
  error: string | null;
  upload: (file: File) => Promise<void>;
  remove: (docId: number) => Promise<void>;
  reload: () => Promise<void>;
}

export function useDocumentUpload(projectId: number): UseDocumentUploadResult {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reload = useCallback(async () => {
    if (!projectId) return;
    try {
      const docs = await listDocuments(projectId);
      setDocuments(docs);
    } catch (err) {
      if (err instanceof DocumentsError) {
        setError(err.message);
      }
    }
  }, [projectId]);

  // Poll until no document is in "processing" state
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      const docs = await listDocuments(projectId).catch(() => null);
      if (!docs) return;
      setDocuments(docs);
      const stillProcessing = docs.some((d) => d.status === "processing");
      if (!stillProcessing && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 3000);
  }, [projectId]);

  useEffect(() => {
    reload();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [reload]);

  const upload = useCallback(
    async (file: File) => {
      setError(null);

      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File exceeds ${MAX_SIZE_MB} MB limit`);
        return;
      }

      setUploading(true);
      try {
        const doc = await uploadDocument(projectId, file);
        // Optimistically add the new document (status=processing)
        setDocuments((prev) => [doc, ...prev]);
        startPolling();
      } catch (err) {
        if (err instanceof DocumentsError) {
          setError(err.message);
        } else {
          setError("Upload failed");
        }
      } finally {
        setUploading(false);
      }
    },
    [projectId, startPolling]
  );

  const remove = useCallback(
    async (docId: number) => {
      setError(null);
      try {
        await deleteDocument(projectId, docId);
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      } catch (err) {
        if (err instanceof DocumentsError) {
          setError(err.message);
        } else {
          setError("Delete failed");
        }
      }
    },
    [projectId]
  );

  return { documents, uploading, error, upload, remove, reload };
}
