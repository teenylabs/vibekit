# VibeKit: Two-Stage Pipeline Build Instructions

## Context

VibeKit is a design companion for vibe-coded apps. The current version uses a JSON wireframe renderer — the AI generates `<screen_spec>` JSON, and custom renderer components (TableRenderer, FormRenderer, CardGridRenderer, etc.) map that JSON to UI components. This produces generic-looking output.

We're replacing it with a **two-stage pipeline** where the AI generates actual React/JSX code that renders live via `react-live`. This produces beautiful, creative, app-type-appropriate designs.

The two-stage pipeline has been tested and validated. The prompts, reference files, and visual quality are confirmed good. Your job is to wire it up as real code in the existing VibeKit codebase.

---

## What Already Exists (Don't Rebuild)

- Two-panel layout (chat left, preview right) — `app/design/page.tsx`
- Chat panel with messages, input, typing indicator — `components/companion/ChatPanel.tsx`
- Skin switching via `data-skin` attribute — `styles/skins/all-skins.css`
- Export system (CLAUDE.md, SCREEN_SPEC.md, ZIP) — `components/companion/ExportModal.tsx`
- API key management — `components/companion/ApiKeyDialog.tsx`
- Collapsible chat panel
- 6 skins defined in CSS

## What You're Building

### Step 1: Add Pipeline Files to the Project

Create this directory structure and add the provided files:

```
vibekit/
├── prompts/
│   ├── stage1-design-director.md     ← PROVIDED (system prompt for Stage 1)
│   ├── stage2-code-generator-v2.md   ← PROVIDED (system prompt for Stage 2)
│   └── selector-logic.md            ← PROVIDED (reference for selection logic)
├── references/
│   ├── ref-browse-drill.jsx
│   ├── ref-workspace-sidebar.jsx
│   ├── ref-conversational.jsx
│   ├── ref-split-pane.jsx
│   ├── ref-form-sections.jsx
│   ├── ref-sequential-flow.jsx
│   ├── ref-feed-timeline.jsx
│   ├── ref-tab-sections.jsx
│   ├── ref-overlay-modal.jsx
│   ├── ref-expand-in-place.jsx
│   ├── ref-drag-kanban.jsx
│   ├── ref-inline-edit.jsx
│   ├── ref-dashboard-charts.jsx
│   ├── ref-landing-page.jsx
│   ├── ref-product-detail.jsx
│   ├── ref-pricing-table.jsx
│   └── ref-empty-loading-error.jsx
```

All 17 reference files and 3 prompt files will be provided as uploads.

### Step 2: Install react-live

```bash
npm install react-live
```

### Step 3: Build the Reference Selector (`lib/ai/select-references.ts`)

This maps a Stage 1 design brief to 2-4 reference files. Implement the logic from `selector-logic.md`:

```typescript
// lib/ai/select-references.ts

interface DesignBrief {
  app_type: string;
  nav_model: string;
  content_relationship: string;
  mutation_model: string;
  // ... other fields
}

const NAV_MAP: Record<string, string> = {
  browse_and_drill: "ref-browse-drill",
  workspace_switch: "ref-workspace-sidebar",
  sequential_flow: "ref-sequential-flow",
  conversational: "ref-conversational",
  feed_timeline: "ref-feed-timeline",
  tab_peers: "ref-tab-sections",
};

const CONTENT_MAP: Record<string, string | null> = {
  full_replace: null, // covered by browse_and_drill
  split_pane: "ref-split-pane",
  overlay_modal: "ref-overlay-modal",
  overlay_sheet: null, // similar to overlay_modal
  expand_in_place: "ref-expand-in-place",
  filter_refine: null, // covered by browse_and_drill
};

const MUTATION_MAP: Record<string, string | null> = {
  form_submit: "ref-form-sections",
  inline_edit: "ref-inline-edit",
  drag_and_drop: "ref-drag-kanban",
  conversational_input: "ref-conversational",
  direct_manipulation: null,
  toggle_switch: "ref-form-sections",
};

const APP_TYPE_EXTRAS: Record<string, string> = {
  consumer: "ref-browse-drill",
  saas: "ref-workspace-sidebar",
  chat: "ref-conversational",
  dashboard: "ref-dashboard-charts",
  marketing: "ref-landing-page",
  tool: "ref-form-sections",
  ecommerce: "ref-product-detail",
};

export function selectReferences(brief: DesignBrief): string[] {
  const refs: string[] = [];
  const seen = new Set<string>();

  // 1. Nav model reference (always include)
  const navRef = NAV_MAP[brief.nav_model];
  if (navRef) { refs.push(navRef); seen.add(navRef); }

  // 2. Content relationship (if different)
  const contentRef = CONTENT_MAP[brief.content_relationship];
  if (contentRef && !seen.has(contentRef)) { refs.push(contentRef); seen.add(contentRef); }

  // 3. Mutation model (if different)
  const mutationRef = MUTATION_MAP[brief.mutation_model];
  if (mutationRef && !seen.has(mutationRef)) { refs.push(mutationRef); seen.add(mutationRef); }

  // 4. App type extra if we have < 3 refs
  if (refs.length < 3) {
    const extra = APP_TYPE_EXTRAS[brief.app_type];
    if (extra && !seen.has(extra)) { refs.push(extra); }
  }

  return refs.slice(0, 4);
}
```

### Step 4: Build the Reference Loader (`lib/ai/load-references.ts`)

Loads the actual JSX content of selected reference files:

```typescript
// lib/ai/load-references.ts

// Import all reference files as raw strings
// Using webpack raw-loader or Next.js ?raw import

const referenceFiles: Record<string, string> = {};

// At build time, load all reference files into this map.
// One approach: use require.context or dynamic imports.
// Simplest for MVP: inline them or use fs.readFileSync at build time.

export async function loadReferences(refNames: string[]): Promise<string[]> {
  return refNames.map(name => {
    const content = referenceFiles[name];
    if (!content) {
      console.warn(`Reference not found: ${name}`);
      return "";
    }
    return content;
  }).filter(Boolean);
}
```

**Implementation note:** The simplest approach for MVP is to create a `references/index.ts` that exports all reference files as string constants. You can use the raw content directly. Each reference file is ~80-150 lines, so the total bundle is ~2,500 lines — well within reason.

### Step 5: Build the Pipeline Orchestrator (`lib/ai/pipeline.ts`)

This orchestrates the two-stage API flow:

```typescript
// lib/ai/pipeline.ts

import { selectReferences } from "./select-references";
import { loadReferences } from "./load-references";

const STAGE1_PROMPT = `...`; // Load from stage1-design-director.md
const STAGE2_TEMPLATE = `...`; // Load from stage2-code-generator-v2.md

interface PipelineResult {
  conversationalText: string;
  designBrief: object;
  screenCodes: Array<{ id: string; name: string; type: string; code: string }>;
  navStructure: object;
}

export async function runPipeline(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<PipelineResult> {

  // ── STAGE 1: Design Director ──
  const stage1Response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: STAGE1_PROMPT,
      messages: [...conversationHistory, { role: "user", content: userMessage }],
    }),
  });

  const stage1Data = await stage1Response.json();
  const stage1Text = stage1Data.content[0].text;

  // Parse design brief from <design_brief> tags
  const briefMatch = stage1Text.match(/<design_brief>([\s\S]*?)<\/design_brief>/);
  if (!briefMatch) {
    // Stage 1 is asking a clarifying question — return just the text
    return {
      conversationalText: stage1Text,
      designBrief: null,
      screenCodes: [],
      navStructure: null,
    };
  }

  const designBrief = JSON.parse(briefMatch[1]);
  const conversationalText = stage1Text.replace(/<design_brief>[\s\S]*?<\/design_brief>/, "").trim();

  // ── SELECTOR ──
  const refNames = selectReferences(designBrief);
  const refContents = await loadReferences(refNames);

  // ── STAGE 2: Code Generator ──
  // Build the Stage 2 prompt with injected brief and references
  let stage2Prompt = STAGE2_TEMPLATE
    .replace("{INJECT_DESIGN_BRIEF}", JSON.stringify(designBrief, null, 2));

  refContents.forEach((content, i) => {
    stage2Prompt = stage2Prompt.replace(
      `{INJECT_REFERENCE_${i + 1}}`,
      "```jsx\n" + content + "\n```"
    );
  });

  // Remove any remaining unreplaced reference slots
  stage2Prompt = stage2Prompt.replace(/\{INJECT_REFERENCE_\d+\}/g, "(no additional reference)");

  const stage2Response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: stage2Prompt,
      messages: [{ role: "user", content: "Generate the screens now." }],
    }),
  });

  const stage2Data = await stage2Response.json();
  const stage2Text = stage2Data.content[0].text;

  // Parse screen_code blocks
  const screenCodes = [];
  const codeRegex = /<screen_code\s+id="([^"]+)"\s+name="([^"]+)"\s+type="([^"]+)">([\s\S]*?)<\/screen_code>/g;
  let match;
  while ((match = codeRegex.exec(stage2Text)) !== null) {
    screenCodes.push({
      id: match[1],
      name: match[2],
      type: match[3],
      code: match[4].trim(),
    });
  }

  // Parse nav_structure
  const navMatch = stage2Text.match(/<nav_structure[^>]*>([\s\S]*?)<\/nav_structure>/);
  const navStructure = navMatch ? JSON.parse(navMatch[1]) : null;

  return { conversationalText, designBrief, screenCodes, navStructure };
}
```

### Step 6: Replace WireframePanel with react-live Renderer

Replace the current `WireframePanel.tsx` (which maps JSON → components) with a new version that renders Stage 2 JSX code live.

```typescript
// components/companion/WireframePanel.tsx (NEW VERSION)

import { LiveProvider, LivePreview, LiveError } from "react-live";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  screenCodes: Array<{ id: string; name: string; type: string; code: string }>;
  activeScreenId: string;
  selectedSkin: string;
}

export function WireframePanel({ screenCodes, activeScreenId, selectedSkin }: Props) {
  const activeScreen = screenCodes.find(s => s.id === activeScreenId);

  if (!activeScreen) {
    return <EmptyPreview />;
  }

  // The code from Stage 2 uses `export default function ...`
  // react-live needs just the component body or a render call.
  // Strip the import and export, wrap in a render call.
  const processedCode = processCodeForLive(activeScreen.code);

  // Provide React hooks and common utilities in scope
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    useCallback: React.useCallback,
  };

  return (
    <div data-skin={selectedSkin} style={{ height: "100%", overflow: "auto" }}>
      <LiveProvider code={processedCode} scope={scope} noInline={true}>
        <LivePreview />
        <LiveError style={{
          padding: 16,
          margin: 16,
          borderRadius: 8,
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: 13,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }} />
      </LiveProvider>
    </div>
  );
}

function processCodeForLive(code: string): string {
  // Remove import statements (react-live provides React in scope)
  let processed = code.replace(/^import\s+.*?;\s*$/gm, "");

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

function EmptyPreview() {
  return (
    <div style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#999",
      fontSize: 14,
    }}>
      Describe your app to see the design...
    </div>
  );
}
```

### Step 7: Update the Response Parser (`lib/ai/parse-response.ts`)

The current parser extracts `<screen_spec>` JSON. Update it to also handle the pipeline response format:

```typescript
// The pipeline returns a PipelineResult object directly,
// so the parser's job is simpler — it just needs to handle
// the case where Stage 1 returns a clarifying question
// (no design brief, just conversational text).

interface ParsedResponse {
  text: string;           // Conversational text for the chat
  screenCodes?: Array<{ id: string; name: string; type: string; code: string }>;
  navStructure?: object;
  designBrief?: object;
}
```

### Step 8: Update the Screen Navigator

The current `ScreenNavigator.tsx` shows tabs for switching between screens. Update it to work with the new `screenCodes` array instead of the old `screenSpec.screens`:

- Each screen code has `id`, `name`, `type` (page | dialog | sheet)
- Pages show as primary tabs
- Dialogs/sheets show as secondary (smaller) tabs
- Clicking a tab sets `activeScreenId`

### Step 9: Wire Up the Pipeline in design/page.tsx

Update the main page component to use the pipeline instead of the old direct API call:

1. When user sends a message, call `runPipeline()` instead of the old API call
2. If the result has `screenCodes`, update the preview with the new screens
3. If the result only has `conversationalText` (clarifying question), show it in chat
4. The design brief should be stored in state for export
5. Screen navigation works by changing `activeScreenId`

### Step 10: Update Export

The export system needs to output the new format:

- **SCREEN_SPEC.md**: Generated from the design brief + screen names/purposes (from Stage 1)
- **CLAUDE.md**: Include the CSS variable system, h()/ha() helpers, and design rules from the brief
- **Screen code files**: Optionally export each screen's JSX as a separate file in the ZIP
- **Design tokens**: Export the active skin's CSS variables as a standalone file

---

## Important Implementation Notes

### CSS Variable Names
The reference files and Stage 2 prompt use SHORT variable names: `--bg`, `--fg`, `--primary`, `--primary-fg`, `--muted`, `--muted-fg`, `--card`, `--border`, `--ring`, `--destructive`, `--destructive-fg`, `--accent`, `--accent-fg`.

**Check the existing skin CSS files** (`styles/skins/*.css`). If they use LONG names (`--background`, `--foreground`, etc.), you have two options:
1. Add short-name aliases to the skin CSS (recommended — just add `--bg: var(--background)` etc.)
2. Update the reference files to use long names (more work, higher risk of inconsistency)

Option 1 is safer. Add this to each skin's CSS:
```css
[data-skin="modern-saas"] {
  /* ... existing long-name variables ... */
  
  /* Short aliases for pipeline output */
  --bg: var(--background);
  --fg: var(--foreground);
  --primary-fg: var(--primary-foreground);
  --muted-fg: var(--muted-foreground);
  --card-fg: var(--card-foreground);
  --destructive-fg: var(--destructive-foreground);
  --accent-fg: var(--accent-foreground);
}
```

### react-live Limitations
- `react-live` uses `sucrase` for transpilation, not Babel. This means no TypeScript types in the generated code (the AI generates plain JSX, so this is fine).
- Imports don't work inside react-live. Everything the code needs must be in the `scope` object. The AI's code shouldn't have import statements — the Stage 2 prompt already tells it to include the h()/ha() helpers inline.
- `noInline={true}` is required because the code defines a function component and calls `render()` at the end.

### Recharts in react-live
If a screen uses Recharts (dashboard apps), add Recharts components to the scope:
```typescript
import { LineChart, Line, BarChart, Bar, ... } from "recharts";

const scope = {
  React, useState, useEffect,
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
};
```

### Error Handling
- If Stage 1 fails, show an error in chat ("Sorry, I couldn't generate a design. Try describing your app differently.")
- If Stage 2 fails, show the Stage 1 conversational text in chat + an error in the preview
- If react-live fails to render, the `LiveError` component shows the error message. This is expected occasionally — the AI sometimes generates code that doesn't compile. The user can say "that broke, can you fix it?" and the AI can regenerate.

### Token Budget
- Stage 1 system prompt: ~4K tokens
- Stage 2 system prompt: ~3K tokens
- Stage 2 design brief injection: ~1-2K tokens  
- Stage 2 reference injection (2-4 refs × ~2-4K each): ~8-16K tokens
- Stage 2 output (3-5 screens × 100-200 lines): ~4-8K tokens
- Total per generation: ~20-33K tokens — well within Claude's context window

### Build Order
Do these in this exact order. Test each step before moving to the next:

1. Add files (Step 1) — just copy files into the project
2. Install react-live (Step 2) — npm install
3. Build a minimal react-live proof-of-concept — hardcode one reference file as the code, render it in the preview panel. Verify skin switching works with CSS variables.
4. Build the selector (Step 3) and loader (Step 4)
5. Build the pipeline orchestrator (Step 5) 
6. Replace the wireframe panel (Step 6)
7. Update the response parser (Step 7) and navigator (Step 8)
8. Wire everything together (Step 9)
9. Update export (Step 10)

---

## Files Provided

### Prompts (3 files):
- `stage1-design-director.md` — Stage 1 system prompt (design principles, UX laws, interaction taxonomy, output format)
- `stage2-code-generator-v2.md` — Stage 2 system prompt (CSS variables, visual richness mandatories, mobile rules, quality checklist, reference injection slots)
- `selector-logic.md` — Reference selection logic documentation

### Reference Library (17 files):
- `ref-browse-drill.jsx` — Consumer browse grid → detail
- `ref-workspace-sidebar.jsx` — SaaS sidebar workspace
- `ref-conversational.jsx` — Chat/AI conversation
- `ref-split-pane.jsx` — Email-style list + detail
- `ref-form-sections.jsx` — Settings forms with sections
- `ref-sequential-flow.jsx` — Multi-step wizard
- `ref-feed-timeline.jsx` — Activity feed
- `ref-tab-sections.jsx` — Tabbed peer sections
- `ref-overlay-modal.jsx` — Modal dialogs
- `ref-expand-in-place.jsx` — Accordion/expand
- `ref-drag-kanban.jsx` — Kanban board
- `ref-inline-edit.jsx` — Click-to-edit table
- `ref-dashboard-charts.jsx` — Recharts data viz dashboard
- `ref-landing-page.jsx` — Marketing page with hero, features, testimonials
- `ref-product-detail.jsx` — E-commerce product page
- `ref-pricing-table.jsx` — Pricing tier comparison
- `ref-empty-loading-error.jsx` — Empty, loading, error, success states

### Test Harnesses (2 files — for quality reference):
- `vibekit-test-harness.html` — "AI Does It" consumer app with 6 skins
- `pocketbook-pipeline-test.html` — "Pocketbook" finance tracker with 6 skins

These show what the pipeline output should look like when rendered with proper CSS variables. Use them as quality benchmarks.
