"use client";

import { useState, useCallback } from "react";
import { GitBranch } from "lucide-react";
import { useRTM } from "@/hooks/projects/useRTM";
import { useRTMStatus } from "@/hooks/projects/useRTMStatus";
import { rtmService } from "@/services/rtm.service";
import { RTMStatusBanner } from "./rtm/RTMStatusBanner";
import { RTMTable } from "./rtm/RTMTable";
import { RequirementDetailPanel } from "./rtm/RequirementDetailPanel";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

interface TraceabilityTabProps {
  projectId: number;
  userRole: "BA" | "Client";
}

export function TraceabilityTab({ projectId, userRole }: TraceabilityTabProps) {
  const { status, triggerRefresh, isTriggering, reloadStatus } = useRTMStatus(projectId);
  const { requirements, isLoading, filters, setFilters, reload } = useRTM(projectId);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const handleRequirementUpdated = () => {
    reload();
  };

  const handleGenerateAll = useCallback(async () => {
    setIsGeneratingAll(true);
    try {
      // Loop until no more untested requirements (backend caps at 10 per call)
      for (let i = 0; i < 20; i++) {
        const resp = await rtmService.generateTestCases(projectId, {
          requirement_ids: [],
          generate_all_untested: true,
        });
        if (resp.generated.length === 0) break;
      }
    } catch {
      // non-fatal
    } finally {
      setIsGeneratingAll(false);
      reload();
      reloadStatus();
    }
  }, [projectId, reload, reloadStatus]);

  const hasNoRequirements =
    !isLoading &&
    requirements.length === 0 &&
    !filters.q &&
    !filters.section &&
    !filters.coverage &&
    (status?.requirement_count ?? 0) === 0;

  return (
    <div className="flex flex-col gap-4">
      <RTMStatusBanner
        projectId={projectId}
        status={status}
        isTriggering={isTriggering}
        onRefresh={triggerRefresh}
        userRole={userRole}
        onGenerateAll={handleGenerateAll}
        isGeneratingAll={isGeneratingAll}
      />

      {hasNoRequirements && !isLoading ? (
        <EmptyState
          icon={<GitBranch className="w-10 h-10" />}
          title="No requirements yet"
          message="The RTM is generated from your CRS document. Refresh to extract requirements once a CRS has been created."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={triggerRefresh}
              disabled={!!isTriggering}
              className="gap-1.5"
            >
              Generate RTM
            </Button>
          }
          className="py-16"
        />
      ) : (
        <div className="flex gap-4">
          <div className={selectedReqId ? "flex-1 min-w-0" : "w-full"}>
            <RTMTable
              requirements={requirements}
              isLoading={isLoading}
              filters={filters}
              onFiltersChange={setFilters}
              onSelectRequirement={(id) =>
                setSelectedReqId((prev) => (prev === id ? null : id))
              }
              selectedReqId={selectedReqId}
            />
          </div>

          {selectedReqId && (
            <div className="w-[420px] shrink-0">
              <RequirementDetailPanel
                projectId={projectId}
                reqId={selectedReqId}
                userRole={userRole}
                onClose={() => setSelectedReqId(null)}
                onRequirementUpdated={handleRequirementUpdated}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
