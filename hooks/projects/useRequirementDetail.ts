import { useCallback, useState } from "react";
import {
  RequirementDetailDTO,
  TestCaseCreatePayload,
  TestCaseDTO,
  TestCaseUpdatePayload,
  TraceabilityLinkCreatePayload,
  TraceabilityLinkDTO,
} from "@/dto/rtm.dto";
import { rtmService } from "@/services/rtm.service";

export function useRequirementDetail(projectId: number) {
  const [detail, setDetail] = useState<RequirementDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (reqId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await rtmService.getRequirementDetail(projectId, reqId);
        setDetail(data);
      } catch {
        setError("Could not load requirement detail.");
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const addLink = useCallback(
    async (reqId: string, payload: TraceabilityLinkCreatePayload): Promise<TraceabilityLinkDTO> => {
      const link = await rtmService.addSourceLink(projectId, reqId, payload);
      setDetail((prev) =>
        prev ? { ...prev, source_links: [...prev.source_links, link] } : prev
      );
      return link;
    },
    [projectId]
  );

  const removeLink = useCallback(
    async (reqId: string, linkId: number): Promise<void> => {
      await rtmService.removeSourceLink(projectId, reqId, linkId);
      setDetail((prev) =>
        prev
          ? { ...prev, source_links: prev.source_links.filter((l) => l.id !== linkId) }
          : prev
      );
    },
    [projectId]
  );

  const addTestCase = useCallback(
    async (reqId: string, payload: TestCaseCreatePayload): Promise<TestCaseDTO> => {
      const tc = await rtmService.addTestCase(projectId, reqId, payload);
      setDetail((prev) =>
        prev ? { ...prev, test_cases: [...prev.test_cases, tc] } : prev
      );
      return tc;
    },
    [projectId]
  );

  const updateTestCase = useCallback(
    async (
      reqId: string,
      tcId: number,
      payload: TestCaseUpdatePayload
    ): Promise<TestCaseDTO> => {
      const updated = await rtmService.updateTestCase(projectId, reqId, tcId, payload);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              test_cases: prev.test_cases.map((tc) => (tc.id === tcId ? updated : tc)),
            }
          : prev
      );
      return updated;
    },
    [projectId]
  );

  const deleteTestCase = useCallback(
    async (reqId: string, tcId: number): Promise<void> => {
      await rtmService.deleteTestCase(projectId, reqId, tcId);
      setDetail((prev) =>
        prev
          ? { ...prev, test_cases: prev.test_cases.filter((tc) => tc.id !== tcId) }
          : prev
      );
    },
    [projectId]
  );

  return {
    detail,
    isLoading,
    error,
    load,
    addLink,
    removeLink,
    addTestCase,
    updateTestCase,
    deleteTestCase,
  };
}
