"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ScreenCode } from "@/lib/ai/pipeline";
import { runExportPipeline, runReExportPipeline } from "@/lib/ai/export-pipeline";
import type { ComponentMap } from "@/lib/ai/import-pipeline";
import JSZip from "jszip";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designBrief: Record<string, unknown>;
  screenCodes: ScreenCode[];
  selectedSkin: string;
  navStructure: Record<string, unknown> | null;
  apiKey: string;
  skinCSS: string;
  iterationCount: number;
  importedFrom?: boolean;
  originalScreenCodes?: ScreenCode[] | null;
  componentMap?: ComponentMap | null;
  fontImportUrl?: string | null;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportModal({
  open,
  onOpenChange,
  designBrief,
  screenCodes,
  selectedSkin,
  navStructure,
  apiKey,
  skinCSS,
  iterationCount,
  importedFrom,
  originalScreenCodes,
  componentMap,
  fontImportUrl,
}: ExportModalProps) {
  const isReExport = importedFrom && originalScreenCodes != null;
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setError(null);

    try {
      const result = isReExport
        ? await runReExportPipeline({
            originalScreenCodes: originalScreenCodes!,
            currentScreenCodes: screenCodes,
            componentMap: componentMap || [],
            designBrief,
            activeSkin: selectedSkin,
            skinCSS,
            apiKey,
            fontImportUrl,
          })
        : await runExportPipeline({
            designBrief,
            screenCodes,
            navStructure,
            activeSkin: selectedSkin,
            skinCSS,
            iterationCount,
            apiKey,
            fontImportUrl,
          });

      const zip = new JSZip();
      const folder = zip.folder("vibekit-export")!;
      for (const file of result.files) {
        folder.file(file.filename, file.content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      triggerDownload(blob, "vibekit-export.zip");
      onOpenChange(false);
    } catch (err) {
      console.error("Export failed:", err);
      setError(
        err instanceof Error ? err.message : "Export failed. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isReExport ? "Export Design Changes" : "Export Your Design"}
          </DialogTitle>
          <DialogDescription>
            {isReExport
              ? "Download targeted changes for your existing codebase"
              : "Download spec files for Claude Code"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Button
            className="w-full"
            size="lg"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isReExport ? "Detecting changes..." : "Generating specs..."}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>

          {isExporting && (
            <p className="text-tiny text-muted-foreground text-center">
              {isReExport
              ? "Comparing changes and generating DESIGN_CHANGES.md"
              : "Analyzing your screens and writing build specs"}
            </p>
          )}

          {error && (
            <p className="text-small text-destructive text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
