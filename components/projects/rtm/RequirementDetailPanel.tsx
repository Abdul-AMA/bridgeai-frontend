"use client";

import { useEffect, useState } from "react";
import { X, Trash2, Wand2, MessageSquare, Link2, CheckSquare, ChevronRight } from "lucide-react";
import {
  RequirementDetailDTO,
  TestCaseDTO,
} from "@/dto/rtm.dto";
import { rtmService } from "@/services/rtm.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils";

interface RequirementDetailPanelProps {
  projectId: number;
  reqId: string;
  userRole: "BA" | "Client";
  onClose: () => void;
  onRequirementUpdated?: () => void;
}

function SourceTypeBadge({ type }: { type: string }) {
  return (
    <Badge
      className={cn(
        "rounded-full text-[10px] font-semibold shrink-0",
        type === "chat_message"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-purple-50 text-purple-700 border-purple-200"
      )}
    >
      {type === "chat_message" ? "Chat" : "Document"}
    </Badge>
  );
}

function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</h3>
      {count !== undefined && (
        <span className="ml-auto text-xs font-semibold text-gray-400 tabular-nums">{count}</span>
      )}
    </div>
  );
}

export function RequirementDetailPanel({
  projectId,
  reqId,
  userRole,
  onClose,
  onRequirementUpdated,
}: RequirementDetailPanelProps) {
  const [detail, setDetail] = useState<RequirementDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTcId, setEditingTcId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const isBA = userRole === "BA";

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    rtmService
      .getRequirementDetail(projectId, reqId)
      .then(setDetail)
      .catch(() => setError("Could not load requirement."))
      .finally(() => setIsLoading(false));
  }, [projectId, reqId]);

  const handleGenerateTestCases = async () => {
    if (!detail) return;
    setGenerating(true);
    try {
      const resp = await rtmService.generateTestCases(projectId, {
        requirement_ids: [detail.id],
        generate_all_untested: false,
      });
      const newTcs = resp.generated.flatMap((g) => g.test_cases);
      setDetail((prev) =>
        prev ? { ...prev, test_cases: [...prev.test_cases, ...newTcs] } : prev
      );
      onRequirementUpdated?.();
    } catch {
      setError("Test case generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTestCase = async (tcId: number) => {
    if (!detail) return;
    await rtmService.deleteTestCase(projectId, reqId, tcId);
    setDetail((prev) =>
      prev ? { ...prev, test_cases: prev.test_cases.filter((tc) => tc.id !== tcId) } : prev
    );
    onRequirementUpdated?.();
  };

  const handleSaveEditTitle = async (tc: TestCaseDTO) => {
    const updated = await rtmService.updateTestCase(projectId, reqId, tc.id, {
      title: editTitle,
    });
    setDetail((prev) =>
      prev
        ? { ...prev, test_cases: prev.test_cases.map((t) => (t.id === tc.id ? updated : t)) }
        : prev
    );
    setEditingTcId(null);
  };

  const handleRemoveLink = async (linkId: number) => {
    await rtmService.removeSourceLink(projectId, reqId, linkId);
    setDetail((prev) =>
      prev
        ? { ...prev, source_links: prev.source_links.filter((l) => l.id !== linkId) }
        : prev
    );
    onRequirementUpdated?.();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary bg-primary/10 rounded-md px-2 py-1">
            {reqId}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner message="Loading requirement…" />
        </div>
      )}

      {error && (
        <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {detail && !isLoading && (
        <ScrollArea className="flex-1">
          <div className="px-4 py-4 space-y-5">
            {/* Requirement text */}
            <section className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{detail.full_text}</p>
              <p className="mt-1.5 text-xs text-gray-400">
                Section: <span className="font-medium text-gray-500">{detail.section}</span>
              </p>
            </section>

            {/* Source links */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <SectionHeader
                  icon={<Link2 className="h-3.5 w-3.5" />}
                  label="Source Evidence"
                  count={detail.source_links.length}
                />
              </div>

              {detail.source_links.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  No sources linked — this requirement is <span className="font-semibold">unverified</span>.
                </div>
              ) : (
                <ul className="space-y-2">
                  {detail.source_links.map((lk) => (
                    <li
                      key={lk.id}
                      className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1.5">
                          <SourceTypeBadge type={lk.source_type} />
                          <p className="text-xs text-gray-700 leading-relaxed">{lk.excerpt}</p>
                          {lk.is_auto_generated && (
                            <span className="text-[10px] text-gray-400 font-medium">Auto-linked</span>
                          )}
                        </div>
                        {isBA && !lk.is_auto_generated && (
                          <button
                            onClick={() => handleRemoveLink(lk.id)}
                            className="shrink-0 rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Test cases */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <SectionHeader
                  icon={<CheckSquare className="h-3.5 w-3.5" />}
                  label="Test Cases"
                  count={detail.test_cases.length}
                />
                {isBA && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleGenerateTestCases}
                    disabled={generating}
                    className="h-7 gap-1.5 text-xs px-2.5 shadow-sm shadow-primary/20"
                  >
                    <Wand2 className="h-3 w-3" />
                    {generating ? "Generating…" : "Generate"}
                  </Button>
                )}
              </div>

              {detail.test_cases.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  No test cases yet — this requirement is <span className="font-semibold">untested</span>.
                </div>
              ) : (
                <ul className="space-y-2">
                  {detail.test_cases.map((tc) => (
                    <li
                      key={tc.id}
                      className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {editingTcId === tc.id ? (
                          <div className="flex flex-1 items-center gap-2">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                              onClick={() => handleSaveEditTitle(tc)}
                              className="text-xs text-primary font-semibold hover:underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTcId(null)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p
                            className="text-sm font-medium text-gray-800 cursor-pointer hover:text-primary transition-colors"
                            onDoubleClick={() => {
                              setEditingTcId(tc.id);
                              setEditTitle(tc.title);
                            }}
                            title="Double-click to edit"
                          >
                            {tc.title}
                          </p>
                        )}
                        {isBA && editingTcId !== tc.id && (
                          <button
                            onClick={() => handleDeleteTestCase(tc.id)}
                            className="shrink-0 rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {tc.preconditions && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          <span className="font-semibold text-gray-600">Pre:</span>{" "}
                          {tc.preconditions}
                        </p>
                      )}

                      {tc.steps.length > 0 && (
                        <ol className="mt-1.5 space-y-0.5 pl-4 list-decimal text-xs text-gray-600">
                          {tc.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      )}

                      <p className="mt-1.5 text-xs text-gray-500">
                        <span className="font-semibold text-gray-600">Expected:</span>{" "}
                        {tc.expected_result}
                      </p>

                      {tc.is_auto_generated && (
                        <div className="mt-1.5">
                          <Badge className="rounded-full text-[10px] bg-gray-50 text-gray-400 border-gray-200">
                            AI-generated
                          </Badge>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Comments */}
            <section>
              <div className="mb-2">
                <SectionHeader
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                  label="Comments"
                  count={detail.comments.length}
                />
              </div>

              {detail.comments.length === 0 ? (
                <p className="text-xs text-gray-400 italic px-1">No comments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.comments.map((c) => (
                    <li key={c.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                      <p className="text-xs text-gray-700 leading-relaxed">{c.content}</p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* bottom spacing for scroll */}
            <div className="h-2" />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
