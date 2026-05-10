import { useCallback, useEffect, useRef, useState } from "react";
import { RTMStatusDTO } from "@/dto/rtm.dto";
import { rtmService } from "@/services/rtm.service";

export function useRTMStatus(projectId: number) {
  const [status, setStatus] = useState<RTMStatusDTO | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
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
        const data = await rtmService.getRTMStatus(projectId);
        setStatus(data);
        if (!data.is_refreshing) stopPolling();
      } catch {
        // silent — keep polling
      }
    }, 3000);
  }, [projectId, stopPolling]);

  const load = useCallback(async () => {
    try {
      const data = await rtmService.getRTMStatus(projectId);
      setStatus(data);
      if (data.is_refreshing) startPolling();
    } catch {
      // silent
    }
  }, [projectId, startPolling]);

  const triggerRefresh = useCallback(async () => {
    setIsTriggering(true);
    try {
      await rtmService.triggerRefresh(projectId);
      startPolling();
    } catch {
      // 409 = already refreshing (silently accepted); other errors are non-fatal
    } finally {
      setIsTriggering(false);
    }
  }, [projectId, startPolling]);

  useEffect(() => {
    load();
    return stopPolling;
  }, [load, stopPolling]);

  return { status, triggerRefresh, isTriggering };
}
