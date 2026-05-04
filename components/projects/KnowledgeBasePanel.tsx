/**
 * KnowledgeBasePanel
 * Displays and manages project-level uploaded documents (RAG knowledge base)
 */

"use client";

import { useRef } from "react";
import { BookOpen, Upload, Trash2, Loader2, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentUpload } from "@/hooks/projects/useDocumentUpload";
import { DocumentDTO } from "@/dto/documents.dto";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeBasePanelProps {
  projectId: number;
}

function StatusBadge({ status }: { status: DocumentDTO["status"] }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
        <CheckCircle className="w-3 h-3" />
        Ready
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
        <Loader2 className="w-3 h-3 animate-spin" />
        Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
      <AlertCircle className="w-3 h-3" />
      Failed
    </span>
  );
}

export function KnowledgeBasePanel({ projectId }: KnowledgeBasePanelProps) {
  const { documents, uploading, error, upload, remove } = useDocumentUpload(projectId);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      upload(file);
      // Reset input so the same file can be re-uploaded if needed
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 px-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Knowledge Base
          {documents.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {documents.length}
            </span>
          )}
        </h3>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {documents.length === 0 && !uploading && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center">
          <div className="mb-3 p-3 rounded-2xl bg-primary/5 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-700">No documents yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload PDFs, Word docs, or text files — the AI will use them as context.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 flex items-center gap-1.5"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Upload first document
          </Button>
        </div>
      )}

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[220px]" title={doc.filename}>
                    {doc.filename}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={doc.status} />
                    {doc.status === "ready" && (
                      <span className="text-[10px] text-muted-foreground">
                        {doc.chunk_count} chunk{doc.chunk_count !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove(doc.id)}
                className="ml-3 shrink-0 p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                title="Remove document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      {documents.length > 0 && (
        <p className="px-1 text-xs text-muted-foreground">
          Ready documents are automatically used as context in all chats for this project.
        </p>
      )}
    </div>
  );
}
