"use client";

import { AlertCircle, BrainCircuit, Loader2, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useProjectSummary } from "@/hooks/projects/useProjectSummary";

interface ProjectContextCardProps {
  projectId: number;
}

export function ProjectContextCard({ projectId }: ProjectContextCardProps) {
  const { summary, regenerating, error, regenerate } = useProjectSummary(projectId);

  const isGenerating = summary?.is_generating || regenerating;
  const hasContent = summary?.content != null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 px-1 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-primary" />
          Project Context
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-sm"
          onClick={regenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isGenerating ? "Refreshing…" : hasContent ? "Regenerate" : "Generate now"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Generating spinner (no content yet) */}
      {isGenerating && !hasContent && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center">
          <Loader2 className="mb-3 w-6 h-6 animate-spin text-primary" />
          <p className="text-sm font-medium text-gray-700">Generating summary…</p>
          <p className="mt-1 text-xs text-muted-foreground">This may take up to 30 seconds.</p>
        </div>
      )}

      {/* Empty state */}
      {!isGenerating && !hasContent && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center">
          <div className="mb-3 p-3 rounded-2xl bg-primary/5 text-primary">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-700">No summary yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload documents or send a message — the AI will generate a project summary automatically.
          </p>
        </div>
      )}

      {/* Summary content */}
      {hasContent && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              Refreshing summary in background…
            </div>
          )}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {summary.content}
          </p>
          {summary.generated_at && (
            <p className="text-xs text-muted-foreground">
              Last updated{" "}
              {formatDistanceToNow(new Date(summary.generated_at), { addSuffix: true })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
