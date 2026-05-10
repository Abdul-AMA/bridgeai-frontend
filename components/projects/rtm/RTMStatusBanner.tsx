"use client";

import { useState } from "react";
import { RefreshCw, Download, AlertTriangle, CheckCircle2, GitBranch, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RTMStatusDTO } from "@/dto/rtm.dto";
import { rtmService } from "@/services/rtm.service";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface RTMStatusBannerProps {
  projectId: number;
  status: RTMStatusDTO | null;
  isTriggering: boolean;
  onRefresh: () => void;
  userRole: "BA" | "Client";
}

function StatPill({
  value,
  label,
  warning,
}: {
  value: number;
  label: string;
  warning?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl px-5 py-3 transition-all",
        warning && value > 0
          ? "bg-amber-50 border border-amber-200"
          : "bg-gray-50 border border-gray-100"
      )}
    >
      <span
        className={cn(
          "text-2xl font-bold tracking-tighter",
          warning && value > 0 ? "text-amber-600" : "text-primary"
        )}
      >
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </span>
    </div>
  );
}

export function RTMStatusBanner({
  projectId,
  status,
  isTriggering,
  onRefresh,
  userRole,
}: RTMStatusBannerProps) {
  const isBA = userRole === "BA";
  const [exporting, setExporting] = useState(false);
  const isRefreshing = isTriggering || status?.is_refreshing;

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      const blob = await rtmService.exportRTM(projectId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rtm_${projectId}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    } finally {
      setExporting(false);
    }
  };

  const allVerified = (status?.unverified_count ?? 1) === 0;
  const allTested = (status?.untested_count ?? 1) === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: icon + title + stats */}
        <div className="flex items-center gap-6">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
            <GitBranch className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Requirements Traceability
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                  <span className="text-primary font-medium">Refreshing…</span>
                </>
              ) : status?.last_refreshed_at ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>
                    Updated{" "}
                    {formatDistanceToNow(new Date(status.last_refreshed_at), {
                      addSuffix: true,
                    })}
                  </span>
                </>
              ) : (
                <span>Not yet generated</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: stat pills */}
        <div className="flex items-center gap-3">
          <StatPill
            value={status?.requirement_count ?? 0}
            label="Requirements"
          />
          <StatPill
            value={status?.unverified_count ?? 0}
            label="Unverified"
            warning
          />
          <StatPill
            value={status?.untested_count ?? 0}
            label="Untested"
            warning
          />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {allVerified && allTested && (status?.requirement_count ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <CheckCircle2 className="w-3 h-3" />
              Full coverage
            </span>
          )}

          {(status?.unverified_count ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              <AlertTriangle className="w-3 h-3" />
              Gaps detected
            </span>
          )}

          {isBA && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={!!isRefreshing}
              className="gap-1.5"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                size="sm"
                disabled={exporting}
                className="gap-1.5 shadow-sm shadow-primary/20"
              >
                <Download className="w-3.5 h-3.5" />
                Export
                <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
