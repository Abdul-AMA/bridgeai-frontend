/**
 * useCRSExport Hook
 * Handles CRS export operations
 * Single Responsibility: CRS export side effects
 */

import { useState, useCallback } from "react";
import { exportCRS, CRSError } from "../../services/crs.service";

interface UseCRSExportReturn {
  isExporting: boolean;
  error: string | null;
  exportDocument: (crsId: number, version: number, format: "pdf" | "markdown" | "csv") => Promise<void>;
  clearError: () => void;
}

export function useCRSExport(): UseCRSExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportDocument = useCallback(
    async (crsId: number, version: number, format: "pdf" | "markdown" | "csv") => {
      setIsExporting(true);
      setError(null);

      try {
        const extension = format === "markdown" ? "md" : format;
        const filename = `crs-v${version}.${extension}`;
        const blob = await exportCRS(crsId, format);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        const message = err instanceof CRSError ? err.message : "Export failed";
        setError(message);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isExporting, error, exportDocument, clearError };
}
