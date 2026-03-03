"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (key: string) => void;
  existingKey: string;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  onSave,
  existingKey,
}: ApiKeyDialogProps) {
  const [key, setKey] = React.useState(existingKey);

  React.useEffect(() => {
    if (open) setKey(existingKey);
  }, [open, existingKey]);

  function handleSave() {
    const trimmed = key.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claude API Key</DialogTitle>
          <DialogDescription>
            Enter your Anthropic API key to enable the design assistant. Your
            key is stored locally in your browser and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-ant-..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!key.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
