/**
 * useCRSDashboard Hook
 * Manages CRS dashboard for BA (Business Analyst)
 * Single Responsibility: CRS review state and operations
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchCRSForReview,
  updateCRSStatus,
  CRSError,
} from "../../services/crs.service";
import {
  CRSDTO,
  CRSStatus,
  UpdateCRSStatusRequestDTO,
} from "../../dto/crs.dto";

interface UseCRSDashboardReturn {
  crsDocuments: CRSDTO[];
  filteredDocuments: CRSDTO[];
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
  selectedStatus: CRSStatus | "all";
  setSelectedStatus: (status: CRSStatus | "all") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleStatusUpdate: (
    crsId: number,
    statusUpdate: UpdateCRSStatusRequestDTO
  ) => Promise<boolean>;
  refreshDocuments: () => Promise<void>;
}

export function useCRSDashboard(teamId: number, enabled = true): UseCRSDashboardReturn {
  const [crsDocuments, setCRSDocuments] = useState<CRSDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CRSStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadCRSDocuments = useCallback(async () => {
    if (!teamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const status = selectedStatus === "all" ? undefined : selectedStatus;
      const data = await fetchCRSForReview(teamId, status);
      setCRSDocuments(data);
    } catch (err) {
      const errorMessage =
        err instanceof CRSError ? err.message : "Failed to load CRS documents";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [teamId, selectedStatus]);

  useEffect(() => {
    if (enabled) {
      loadCRSDocuments();
    } else {
      setIsLoading(false);
    }
  }, [loadCRSDocuments, enabled]);

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return crsDocuments;

    return crsDocuments.filter((doc) => {
      const matchesSearch =
        doc.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [crsDocuments, searchTerm]);

  const handleStatusUpdate = useCallback(
    async (
      crsId: number,
      statusUpdate: UpdateCRSStatusRequestDTO
    ): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);

      try {
        await updateCRSStatus(crsId, statusUpdate);
        await loadCRSDocuments();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof CRSError ? err.message : "Failed to update CRS status";
        setError(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [loadCRSDocuments]
  );

  const refreshDocuments = useCallback(async () => {
    await loadCRSDocuments();
  }, [loadCRSDocuments]);

  return {
    crsDocuments,
    filteredDocuments,
    isLoading,
    error,
    isProcessing,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    handleStatusUpdate,
    refreshDocuments,
  };
}
