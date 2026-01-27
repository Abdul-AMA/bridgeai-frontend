/**
 * useCRSAuditLogs Hook
 * Handles CRS audit log loading and formatting
 * Single Responsibility: CRS audit state and operations
 */

import { useState, useCallback, useEffect } from "react";
import { fetchCRSAudit } from "@/services/crs.service";
import { CRSError } from "@/services/errors.service";
import { CRSAuditLogDTO } from "@/dto/crs.dto";

interface FormattedAuditLog extends CRSAuditLogDTO {
  formattedDate: string;
}

interface UseCRSAuditLogsReturn {
  logs: FormattedAuditLog[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCRSAuditLogs(
  crsId: number | null,
  enabled = true
): UseCRSAuditLogsReturn {
  const [logs, setLogs] = useState<FormattedAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCRSAudit(id);
      const sorted = data.sort(
        (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
      );

      const formattedLogs: FormattedAuditLog[] = sorted.map((log) => {
        let formattedDate = log.changed_at || "Unknown Date";
        try {
          const date = new Date(log.changed_at);
          if (!Number.isNaN(date.getTime())) {
            formattedDate = date.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } catch {
          // use fallback formattedDate
        }
        return { ...log, formattedDate };
      });

      setLogs(formattedLogs);
    } catch (err) {
      const message = err instanceof CRSError ? err.message : "Failed to load audit trail";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled && crsId) {
      loadLogs(crsId);
    }
  }, [enabled, crsId, loadLogs]);

  const refresh = useCallback(async () => {
    if (crsId) {
      await loadLogs(crsId);
    }
  }, [crsId, loadLogs]);

  return { logs, isLoading, error, refresh };
}
