"use client";

import * as React from "react";
import { Loader2, Upload, X, FileCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FileEntry {
  path: string;
  content: string;
  size: number;
}

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (files: { path: string; content: string }[]) => void;
  isLoading: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function ImportModal({
  open,
  onOpenChange,
  onImport,
  isLoading,
}: ImportModalProps) {
  const [files, setFiles] = React.useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList) {
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFiles((prev) => {
          // Deduplicate by filename
          if (prev.some((f) => f.path === file.name)) return prev;
          return [...prev, { path: file.name, content, size: file.size }];
        });
      };
      reader.readAsText(file);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleRemoveFile(path: string) {
    setFiles((prev) => prev.filter((f) => f.path !== path));
  }

  function handleImport() {
    if (files.length === 0) return;
    onImport(files.map(({ path, content }) => ({ path, content })));
  }

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Existing Project</DialogTitle>
          <DialogDescription>
            Drop your page files so VibeKit can preview your app
          </DialogDescription>
        </DialogHeader>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-body text-muted-foreground">
            Drop .tsx/.jsx files here or click to browse
          </p>
          <p className="text-tiny text-muted-foreground mt-1">
            Supports .tsx, .jsx, .ts, .js files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".tsx,.jsx,.ts,.js"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-small font-mono flex-1 truncate">
                  {file.path}
                </span>
                <span className="text-tiny text-muted-foreground shrink-0">
                  {formatSize(file.size)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleRemoveFile(file.path)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={isLoading || files.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              `Import ${files.length > 0 ? `${files.length} file${files.length === 1 ? "" : "s"}` : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
