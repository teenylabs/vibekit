"use client";

import * as React from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Layers, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ScreenNavigator } from "./ScreenNavigator";
import type { ScreenCode } from "@/lib/ai/pipeline";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

interface WireframePanelProps {
  screenCodes: ScreenCode[];
  activeScreenId: string | null;
  selectedSkin: string;
  onScreenSelect: (screenId: string) => void;
  customSkin?: string | null;
  fontImportUrl?: string | null;
}

const LIVE_SCOPE = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  // Recharts components for dashboard apps
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area,
};

const LIVE_ERROR_STYLE: React.CSSProperties = {
  padding: 16,
  margin: 16,
  borderRadius: 8,
  background: "#fef2f2",
  color: "#dc2626",
  fontSize: 13,
  fontFamily: "monospace",
  whiteSpace: "pre-wrap",
};

export function WireframePanel({
  screenCodes,
  activeScreenId,
  selectedSkin,
  onScreenSelect,
  customSkin,
  fontImportUrl,
}: WireframePanelProps) {
  const [openOverlayId, setOpenOverlayId] = React.useState<string | null>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const activeScreen = screenCodes.find(s => s.id === activeScreenId);
  const overlayScreen = openOverlayId
    ? screenCodes.find(s => s.id === openOverlayId)
    : null;

  // Close overlay when active screen changes
  React.useEffect(() => {
    setOpenOverlayId(null);
  }, [activeScreenId]);

  // Click interceptor: ONLY handles data-overlay and data-navigate attributes.
  // All other clicks pass through untouched so internal React handlers work.
  const handlePreviewClick = React.useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check for data-overlay
    const overlayEl = target.closest("[data-overlay]") as HTMLElement | null;
    if (overlayEl) {
      const overlayId = overlayEl.getAttribute("data-overlay");
      if (overlayId) {
        console.log("[VibeKit Preview] data-overlay:", overlayId);
        setOpenOverlayId(overlayId);
      }
      return;
    }

    // Check for data-navigate
    const navigateEl = target.closest("[data-navigate]") as HTMLElement | null;
    if (navigateEl) {
      const navigateId = navigateEl.getAttribute("data-navigate");
      if (navigateId) {
        const targetScreen = screenCodes.find(s => s.id === navigateId);
        if (targetScreen) {
          console.log("[VibeKit Preview] data-navigate:", navigateId);
          if (targetScreen.type === "dialog" || targetScreen.type === "sheet") {
            setOpenOverlayId(navigateId);
          } else {
            onScreenSelect(navigateId);
          }
        } else {
          console.warn(`[VibeKit Preview] data-navigate="${navigateId}" — no matching screen found. Available: ${screenCodes.map(s => s.id).join(", ")}`);
        }
      }
    }
    // No data-navigate or data-overlay — do nothing, let the event propagate normally
  }, [screenCodes, onScreenSelect]);

  // Debug: log processed code on screen change so we can inspect what the AI generated
  React.useEffect(() => {
    if (activeScreen) {
      console.log(`[VibeKit Preview] Active screen: "${activeScreen.id}" (${activeScreen.type})`);
      console.log(`[VibeKit Preview] Has data-navigate: ${activeScreen.code.includes("data-navigate")}`);
      console.log(`[VibeKit Preview] Has data-overlay: ${activeScreen.code.includes("data-overlay")}`);
      console.log(`[VibeKit Preview] Has onClick: ${activeScreen.code.includes("onClick")}`);
      console.log(`[VibeKit Preview] Has useState: ${activeScreen.code.includes("useState")}`);
      console.log("[VibeKit Preview] Raw code (first 500 chars):", activeScreen.code.slice(0, 500));
    }
  }, [activeScreen]);

  const processedCode = activeScreen ? processCodeForLive(activeScreen.code) : "";

  if (screenCodes.length === 0) {
    return (
      <div
        data-skin={selectedSkin}
        className="h-full flex flex-col bg-background text-foreground"
      >
        <div className="flex items-center justify-center h-full p-6">
          <EmptyState
            icon={Layers}
            title="No design yet"
            description="Describe your app in the chat to see your design here."
            className="border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      data-skin={selectedSkin}
      className="h-full flex flex-col bg-background text-foreground"
    >
      <ScreenNavigator
        screens={screenCodes}
        activeScreenId={activeScreenId}
        onScreenSelect={onScreenSelect}
      />
      <div className="overflow-y-auto overflow-x-hidden flex-1 relative">
        {/* Custom skin injection */}
        {customSkin && (
          <>
            {fontImportUrl && <link href={fontImportUrl} rel="stylesheet" />}
            <style dangerouslySetInnerHTML={{ __html: customSkin }} />
          </>
        )}
        {/* Main page preview with click interceptor */}
        {activeScreen && (
          <div ref={previewRef} onClick={handlePreviewClick}>
            <LiveProvider code={processedCode} scope={LIVE_SCOPE} noInline={true}>
              <LivePreview />
              <LiveError style={LIVE_ERROR_STYLE} />
            </LiveProvider>
          </div>
        )}

        {/* Overlay: dialog or sheet */}
        {overlayScreen && (
          <OverlayRenderer
            screen={overlayScreen}
            onClose={() => setOpenOverlayId(null)}
          />
        )}
      </div>
    </div>
  );
}

// ── Overlay Renderer ──

function OverlayRenderer({
  screen,
  onClose,
}: {
  screen: ScreenCode;
  onClose: () => void;
}) {
  const processedCode = processCodeForLive(screen.code);
  const isSheet = screen.type === "sheet";

  return (
    <div className="absolute inset-0 z-40 flex animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {isSheet ? (
        /* Sheet — slides in from right */
        <div className="relative z-50 ml-auto bg-card border-l border-border shadow-lg w-[60%] h-full overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card">
            <h2 className="text-h3 font-semibold">{screen.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <LiveProvider code={processedCode} scope={LIVE_SCOPE} noInline={true}>
            <LivePreview />
            <LiveError style={LIVE_ERROR_STYLE} />
          </LiveProvider>
        </div>
      ) : (
        /* Dialog — centered modal */
        <div className="relative z-50 m-auto bg-card border border-border rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[80%] overflow-y-auto animate-in zoom-in-95 fade-in duration-150">
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card rounded-t-lg">
            <h2 className="text-h3 font-semibold">{screen.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <LiveProvider code={processedCode} scope={LIVE_SCOPE} noInline={true}>
            <LivePreview />
            <LiveError style={LIVE_ERROR_STYLE} />
          </LiveProvider>
        </div>
      )}
    </div>
  );
}

// ── Code Processing ──

function processCodeForLive(code: string): string {
  // Remove import statements (react-live provides React in scope)
  let processed = code.replace(/^import\s+.*?;?\s*$/gm, "");

  // Convert `export default function Foo()` to just `function Foo()`
  // and add a render call at the end
  const exportMatch = processed.match(/export\s+default\s+function\s+(\w+)/);
  if (exportMatch) {
    const componentName = exportMatch[1];
    processed = processed.replace(/export\s+default\s+function/, "function");
    processed += `\n\nrender(<${componentName} />);`;
  }

  return processed;
}
