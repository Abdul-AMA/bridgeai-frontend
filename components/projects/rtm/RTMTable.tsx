"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { RequirementDTO, RTMFilters } from "@/dto/rtm.dto";
import { SearchBar } from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

interface RTMTableProps {
  requirements: RequirementDTO[];
  isLoading: boolean;
  filters: RTMFilters;
  onFiltersChange: (f: RTMFilters) => void;
  onSelectRequirement: (reqId: string) => void;
  selectedReqId?: string | null;
}

const COVERAGE_OPTIONS = [
  { value: "", label: "All coverage" },
  { value: "unverified", label: "Unverified" },
  { value: "untested", label: "Untested" },
  { value: "complete", label: "Complete" },
] as const;

function CoverageBadge({ sources, tests }: { sources: number; tests: number }) {
  const isGap = sources === 0 || tests === 0;
  return (
    <Badge
      className={cn(
        "rounded-full font-semibold",
        isGap
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-green-50 text-green-700 border-green-200"
      )}
    >
      {isGap ? "Gap" : "Complete"}
    </Badge>
  );
}

export function RTMTable({
  requirements,
  isLoading,
  filters,
  onFiltersChange,
  onSelectRequirement,
  selectedReqId,
}: RTMTableProps) {
  const sections = Array.from(new Set(requirements.map((r) => r.section))).sort();
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the list changes (filter applied)
  useEffect(() => {
    setPage(1);
  }, [requirements.length, filters.q, filters.section, filters.coverage]);

  const totalPages = Math.max(1, Math.ceil(requirements.length / PAGE_SIZE));
  const paginated = requirements.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar
          placeholder="Search requirements…"
          value={filters.q ?? ""}
          onChange={(v) => onFiltersChange({ ...filters, q: v || undefined })}
        />

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={filters.section ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, section: e.target.value || undefined })
            }
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.coverage ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                coverage: (e.target.value as RTMFilters["coverage"]) || undefined,
              })
            }
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {COVERAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner message="Loading requirements…" />
          </div>
        ) : requirements.length === 0 ? (
          <EmptyState
            title="No requirements found"
            message="Try adjusting your filters or refresh the RTM to extract requirements from the CRS."
            className="py-16"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Section
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Sources
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Tests
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Coverage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((req) => {
                    const isSelected = selectedReqId === req.req_id;
                    return (
                      <tr
                        key={req.id}
                        onClick={() => onSelectRequirement(req.req_id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary/5 hover:bg-primary/10"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 rounded-md px-1.5 py-0.5">
                            {req.req_id}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{req.section}</td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{req.description}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "inline-block w-6 h-6 rounded-full text-xs font-bold leading-6",
                            req.source_count === 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          )}>
                            {req.source_count}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "inline-block w-6 h-6 rounded-full text-xs font-bold leading-6",
                            req.test_case_count === 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          )}>
                            {req.test_case_count}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <CoverageBadge
                            sources={req.source_count}
                            tests={req.test_case_count}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, requirements.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">{requirements.length}</span>{" "}
                  requirements
                </p>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "…" ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400">
                          …
                        </span>
                      ) : (
                        <Button
                          key={p}
                          variant={page === p ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setPage(p as number)}
                          className="h-7 w-7 p-0 text-xs"
                        >
                          {p}
                        </Button>
                      )
                    )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
