"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, KeyRound, PanelLeftClose, PanelLeftOpen, Upload } from "lucide-react";
import { ChatPanel } from "@/components/companion/ChatPanel";
import { WireframePanel } from "@/components/companion/WireframePanel";
import { SkinSelector } from "@/components/companion/SkinSelector";
import { ApiKeyDialog } from "@/components/companion/ApiKeyDialog";
import { ExportModal } from "@/components/companion/ExportModal";
import { ImportModal } from "@/components/companion/ImportModal";
import { runPipeline, editPipeline } from "@/lib/ai/pipeline";
import type { ScreenCode } from "@/lib/ai/pipeline";
import { runImportPipeline } from "@/lib/ai/import-pipeline";
import type { ComponentMap, ImportResult } from "@/lib/ai/import-pipeline";
import type { ChatMessage, CompanionState } from "@/lib/spec-types";
import { SKIN_CSS } from "@/lib/skin-css";

const API_KEY_STORAGE_KEY = "vibekit-claude-api-key";

type SkinType = CompanionState["selectedSkin"];

interface DesignState {
  selectedSkin: SkinType;
  messages: ChatMessage[];
  isLoading: boolean;
  screenCodes: ScreenCode[];
  activeScreenId: string | null;
  designBrief: Record<string, unknown> | null;
  navStructure: Record<string, unknown> | null;
  iterationCount: number;
  importedFrom: boolean;
  originalScreenCodes: ScreenCode[] | null;
  componentMap: ComponentMap | null;
  customSkin: string | null;
  fontImportUrl: string | null;
}

type DesignAction =
  | { type: "SET_SKIN"; skin: SkinType }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_SCREEN_CODES"; screenCodes: ScreenCode[] }
  | { type: "SET_ACTIVE_SCREEN"; screenId: string }
  | { type: "SET_DESIGN_BRIEF"; brief: Record<string, unknown> }
  | { type: "SET_NAV_STRUCTURE"; nav: Record<string, unknown> }
  | { type: "INCREMENT_ITERATION" }
  | { type: "IMPORT_PROJECT"; payload: ImportResult }
  | { type: "SET_CUSTOM_SKIN"; customSkin: string | null; fontImportUrl: string | null };

function designReducer(state: DesignState, action: DesignAction): DesignState {
  switch (action.type) {
    case "SET_SKIN":
      return { ...state, selectedSkin: action.skin };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_SCREEN_CODES":
      return { ...state, screenCodes: action.screenCodes };
    case "SET_ACTIVE_SCREEN":
      return { ...state, activeScreenId: action.screenId };
    case "SET_DESIGN_BRIEF":
      return { ...state, designBrief: action.brief };
    case "SET_NAV_STRUCTURE":
      return { ...state, navStructure: action.nav };
    case "INCREMENT_ITERATION":
      return { ...state, iterationCount: state.iterationCount + 1 };
    case "SET_CUSTOM_SKIN":
      return { ...state, customSkin: action.customSkin, fontImportUrl: action.fontImportUrl };
    case "IMPORT_PROJECT": {
      const { screenCodes, componentMap, navStructure, designBrief } = action.payload;
      return {
        ...state,
        screenCodes,
        originalScreenCodes: screenCodes.map((s) => ({ ...s })),
        componentMap,
        navStructure,
        designBrief,
        importedFrom: true,
        activeScreenId: screenCodes.length > 0 ? screenCodes[0].id : null,
        iterationCount: 0,
      };
    }
    default:
      return state;
  }
}

const initialState: DesignState = {
  selectedSkin: "modern-saas",
  messages: [
    {
      id: "system-welcome",
      role: "system",
      content:
        "Describe the app you want to build. I'll design it as we talk.",
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  screenCodes: [],
  activeScreenId: null,
  designBrief: null,
  navStructure: null,
  iterationCount: 0,
  importedFrom: false,
  originalScreenCodes: null,
  componentMap: null,
  customSkin: null,
  fontImportUrl: null,
};

export default function DesignPage() {
  const [state, dispatch] = React.useReducer(designReducer, initialState);
  const [apiKey, setApiKey] = React.useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(true);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  // Load API key from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
    setApiKey(stored);
    if (!stored) setShowApiKeyDialog(true);
    setMounted(true);
  }, []);

  function handleSaveApiKey(key: string) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
  }

  async function handleImportProject(files: { path: string; content: string }[]) {
    const currentKey = apiKey || localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    if (!currentKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsImporting(true);
    try {
      const result = await runImportPipeline({ files, apiKey: currentKey });
      dispatch({ type: "IMPORT_PROJECT", payload: result });
      setShowImportModal(false);

      const importMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        role: "system",
        content: `Imported ${result.screenCodes.length} screen(s) from your codebase. You can now iterate on the design and re-export targeted changes.`,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_MESSAGE", message: importMessage });
    } catch (err) {
      console.error("Import failed:", err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Import failed: ${err instanceof Error ? err.message : "Please try again."}`,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_MESSAGE", message: errorMessage });
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSendMessage(content: string) {
    // 1. Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    dispatch({ type: "ADD_MESSAGE", message: userMessage });

    // 2. Check for API key — read fresh from localStorage in case state is stale
    const currentKey = apiKey || localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    console.log("[VibeKit] handleSendMessage called, apiKey present:", !!currentKey);
    if (!currentKey) {
      setShowApiKeyDialog(true);
      return;
    }

    // 3. Set loading
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      // 4. Choose pipeline: edit (follow-up) or full (first generation)
      let result;
      if (state.designBrief && state.screenCodes.length > 0) {
        // Follow-up edit — skip Stage 1, send current screens + edit to Stage 2
        console.log("[VibeKit] Edit mode — calling editPipeline");
        result = await editPipeline(content, state.screenCodes, state.designBrief, currentKey);
        dispatch({ type: "INCREMENT_ITERATION" });
      } else {
        // First message — run full two-stage pipeline
        const conversationHistory = state.messages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content }));
        console.log("[VibeKit] Calling runPipeline with", conversationHistory.length, "history messages");
        result = await runPipeline(content, conversationHistory, currentKey);
      }

      // 6. Add assistant message (conversational text from Stage 1)
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.conversationalText || "Here's the design I've put together.",
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_MESSAGE", message: assistantMessage });
      setChatOpen(true);

      // 7. If we got screen codes (Stage 2 completed), update the preview
      if (result.screenCodes.length > 0) {
        console.log("[VibeKit] Screen codes received:", result.screenCodes.map(s => ({ id: s.id, name: s.name, type: s.type })));
        // Log first 500 chars of each screen's code to check for data-navigate/data-overlay
        for (const sc of result.screenCodes) {
          const hasNavigate = sc.code.includes("data-navigate");
          const hasOverlay = sc.code.includes("data-overlay");
          console.log(`[VibeKit] Screen "${sc.id}": data-navigate=${hasNavigate}, data-overlay=${hasOverlay}`);
          if (!hasNavigate && !hasOverlay) {
            console.log(`[VibeKit] Screen "${sc.id}" code preview:`, sc.code.slice(0, 300));
          }
        }
        dispatch({ type: "SET_SCREEN_CODES", screenCodes: result.screenCodes });
        dispatch({
          type: "SET_ACTIVE_SCREEN",
          screenId: result.screenCodes[0].id,
        });
      }

      // 8. Store design brief and nav structure
      if (result.designBrief) {
        dispatch({ type: "SET_DESIGN_BRIEF", brief: result.designBrief });
      }
      if (result.navStructure) {
        dispatch({ type: "SET_NAV_STRUCTURE", nav: result.navStructure });
      }
      if (result.customSkin) {
        dispatch({ type: "SET_CUSTOM_SKIN", customSkin: result.customSkin, fontImportUrl: result.fontImportUrl });
        dispatch({ type: "SET_SKIN", skin: "custom" });
      }
    } catch (err) {
      console.error("Pipeline failed:", err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't generate a design. Please try describing your app differently.",
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_MESSAGE", message: errorMessage });
      setChatOpen(true);
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }

  function handleScreenSelect(screenId: string) {
    dispatch({ type: "SET_ACTIVE_SCREEN", screenId });
  }

  // Don't render until mounted (avoid hydration mismatch from localStorage)
  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <div className="flex flex-row items-center justify-between h-14 px-4 border-b bg-card">
        <div className="flex items-center gap-2">
          {!chatOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setChatOpen(true)}
              title="Open chat"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          )}
          <span className="text-h3 font-bold">VibeKit</span>
        </div>
        <SkinSelector
          selectedSkin={state.selectedSkin}
          onSkinChange={(skin) => dispatch({ type: "SET_SKIN", skin })}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiKeyDialog(true)}
          >
            <KeyRound className="h-4 w-4 mr-1" />
            API Key
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            disabled={!state.designBrief}
            onClick={() => setShowExportModal(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main panels */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Chat panel — collapsible */}
        <div
          className={`border-r flex flex-col transition-all duration-300 ${
            chatOpen ? "w-[40%]" : "w-0 overflow-hidden"
          }`}
        >
          <div className="flex items-center justify-end p-1 border-b shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setChatOpen(false)}
              title="Close chat"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          <ChatPanel
            messages={state.messages}
            isLoading={state.isLoading}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Preview panel — expands when chat is closed */}
        <div className="flex-1 flex flex-col relative">
          <WireframePanel
            screenCodes={state.screenCodes}
            activeScreenId={state.activeScreenId}
            selectedSkin={state.selectedSkin}
            onScreenSelect={handleScreenSelect}
            customSkin={state.customSkin}
            fontImportUrl={state.fontImportUrl}
          />
        </div>
      </div>

      {/* API Key Dialog */}
      <ApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onSave={handleSaveApiKey}
        existingKey={apiKey}
      />

      {/* Import Modal */}
      <ImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={handleImportProject}
        isLoading={isImporting}
      />

      {/* Export Modal */}
      {state.designBrief && (
        <ExportModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          designBrief={state.designBrief}
          screenCodes={state.screenCodes}
          selectedSkin={state.selectedSkin}
          navStructure={state.navStructure}
          apiKey={apiKey}
          skinCSS={state.customSkin || SKIN_CSS[state.selectedSkin] || ""}
          iterationCount={state.iterationCount}
          importedFrom={state.importedFrom}
          originalScreenCodes={state.originalScreenCodes}
          componentMap={state.componentMap}
          fontImportUrl={state.fontImportUrl}
        />
      )}
    </div>
  );
}
