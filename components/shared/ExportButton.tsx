"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportProject, downloadBlob, type ExportFormat } from "@/lib/api-exports";

interface ExportButtonProps {
  projectId: number;
  content: string;
  filename?: string;
}

export function ExportButton({
  projectId,
  content,
  filename = "export",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setError(null);

    try {
      const extension = format === "pdf" ? "pdf" : "md";
      const finalFilename = `${filename}.${extension}`;

      const blob = await exportProject(projectId, {
        filename: finalFilename,
        format,
        content,
      });

      downloadBlob(blob, finalFilename);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      setError(message);
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting || !content}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleExport("markdown")}
            disabled={isExporting}
          >
            Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
          >
            PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
