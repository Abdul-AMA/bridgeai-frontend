import { useCallback, useEffect, useState } from "react";
import { RTMFilters, RequirementDTO } from "@/dto/rtm.dto";
import { rtmService } from "@/services/rtm.service";

export function useRTM(projectId: number) {
  const [requirements, setRequirements] = useState<RequirementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RTMFilters>({});

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rtmService.getRequirements(projectId, filters);
      setRequirements(data);
    } catch {
      setError("Could not load requirements.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    load();
  }, [load]);

  return { requirements, isLoading, error, filters, setFilters, reload: load };
}
