import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectContextSummaryDTO } from "@/dto/summary.dto";
import { summaryService } from "@/services/summary.service";

export function useProjectSummary(projectId: number) {
  const [summary, setSummary] = useState<ProjectContextSummaryDTO | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current !== null) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const data = await summaryService.getSummary(projectId);
        setSummary(data);
        if (!data.is_generating) stopPolling();
      } catch {
        // silent — keep polling
      }
    }, 3000);
  }, [projectId, stopPolling]);

  const load = useCallback(async () => {
    try {
      const data = await summaryService.getSummary(projectId);
      setSummary(data);
      if (data.is_generating) startPolling();
    } catch {
      setError("Could not load project summary.");
    }
  }, [projectId, startPolling]);

  const regenerate = useCallback(async () => {
    setRegenerating(true);
    setError(null);
    try {
      const data = await summaryService.regenerateSummary(projectId);
      setSummary(data);
      startPolling();
    } catch {
      setError("Could not trigger regeneration. Please try again.");
    } finally {
      setRegenerating(false);
    }
  }, [projectId, startPolling]);

  useEffect(() => {
    load();
    return stopPolling;
  }, [load, stopPolling]);

  return { summary, regenerating, error, regenerate };
}
