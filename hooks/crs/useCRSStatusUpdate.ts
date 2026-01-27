/**
 * useCRSStatusUpdate Hook
 * Handles CRS status updates
 * Single Responsibility: CRS status update operations
 */

import { useState, useCallback } from "react";
import { updateCRSStatus } from "../../services/crs.service";
import { CRSError } from "../../services/errors.service";
import { CRSStatus } from "../../dto/crs.dto";

interface UseCRSStatusUpdateReturn {
  isUpdating: boolean;
  error: string | null;
  updateStatus: (crsId: number, status: CRSStatus, rejectionReason?: string) => Promise<boolean>;
  clearError: () => void;
}

export function useCRSStatusUpdate(): UseCRSStatusUpdateReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (crsId: number, status: CRSStatus, rejectionReason?: string): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        await updateCRSStatus(crsId, {
          status,
          rejection_reason: rejectionReason,
        });
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof CRSError ? err.message : "Failed to update CRS status";
        setError(errorMessage);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isUpdating, error, updateStatus, clearError };
}
