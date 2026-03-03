# VibeKit Round-Trip Phase 1: Manual Import MVP

## Context

Read `vibekit-handoff-final-march2.md` and `vibekit-roundtrip-architecture.md` for full context. 

VibeKit currently has a one-way flow: design → export → Claude Code builds. We're adding the return path: user imports their existing codebase back into VibeKit, iterates on the design, and re-exports targeted changes (DESIGN_CHANGES.md) that Claude Code applies without losing business logic.

Phase 1 is a manual import — the user pastes or uploads their page files. No CLI scanning yet.

## What to Build

### 1. Stage 0 Prompt — `prompts/stage0-codebase-reader.md`

Create the Stage 0 system prompt. This AI reads real React/Next.js source files and produces:
- Self-contained preview JSX (same format Stage 2 generates — h()/ha() helpers, useState only, all data inline, ends with `render(<Component />)`)
- A component map (JSON) linking preview sections to source files
- Design metadata (app name, nav model, density, app type)

Key instructions for the AI:
- Strip: imports, TypeScript, API calls, auth guards, context providers, server components, env vars, complex state (Redux/Zustand)
- Preserve: layout structure, all inline styles and CSS variable usage, Tailwind classes, typography, colors, component hierarchy, interactive states (active tabs, selected items)
- If code fetches data, invent realistic sample data matching the UI expectations
- Include nav/sidebar in each screen with correct item active
- Component map: for each visually distinct section, record source_file, approximate line_range, and description

Output format uses XML tags:
```
<preview_code>
(self-contained JSX)
</preview_code>

<component_map>
{
  "screen_id": "...",
  "screen_name": "...",
  "route": "...",
  "source_files": [...],
  "sections": [
    { "id": "...", "label": "...", "source_file": "...", "line_range": [n, n], "description": "..." }
  ]
}
</component_map>

<design_meta>
{
  "app_name": "...",
  "nav_model": "sidebar | topnav | tabs | none",
  "density": "compact | comfortable | spacious",
  "app_type": "consumer | saas | dashboard | tool | chat"
}
</design_meta>
```

### 2. Stage 3b Prompt — `prompts/stage3b-change-detector.md`

Create the change detector prompt. This AI receives:
- BEFORE preview code (from Stage 0 import)
- AFTER preview code (after user iterated in VibeKit)  
- Component map (from Stage 0)

It produces DESIGN_CHANGES.md with this format:

```markdown
# DESIGN_CHANGES.md — {App Name}

## Summary
{1-2 sentence overview}

## Changes

### {Section Label} → `{source_file}`
**Before:** {brief description}
**After:** {brief description}
**Implementation hints:**
- {specific CSS/style/structural change}
- {another change}

## Unchanged
Do not modify:
- {section} → `{source_file}`

## Updated Design Tokens
{new CSS variables if skin changed, or "No changes."}
```

Key instructions:
- Describe SEMANTIC changes, not text diffs
- Implementation hints should be concrete: "change w-56 to w-64", "replace card grid with table", "add search input with rounded-lg px-3 py-2 styling"
- The "Unchanged" section is critical — it tells Claude Code what NOT to touch
- If a new screen was added (no BEFORE), include a full spec for that screen (similar to SCREEN_SPEC.md format)
- If no changes detected for a screen, skip it entirely

### 3. Import Pipeline — `lib/ai/import-pipeline.ts`

New file. Handles the Stage 0 flow:

```typescript
interface ImportInput {
  files: { path: string; content: string }[];  // the user's source files
  apiKey: string;
}

interface ImportResult {
  screenCodes: { id: string; name: string; code: string }[];
  componentMap: ComponentMap;
  navStructure: { type: string; items: { label: string; icon: string; screen: string }[] };
  designBrief: { app_name: string; nav_model: string; density: string; app_type: string };
}
```

Logic:
1. Identify which files are pages vs shared components (heuristic: files in `app/` or `pages/` with default exports are pages, others are components)
2. For the first page, send all files as context — the AI needs to see the nav component and shared layout
3. Parse the AI response: extract preview_code, component_map, and design_meta from XML tags
4. For subsequent pages, include the nav structure from the first call so the AI renders it consistently
5. Collect all results into ImportResult

### 4. Re-Export Pipeline — modify `lib/ai/export-pipeline.ts`

Add a new function `runReExportPipeline()` that handles the round-trip export:

```typescript
interface ReExportInput {
  originalScreenCodes: { id: string; code: string }[];  // from Stage 0
  currentScreenCodes: { id: string; code: string }[];   // after iteration
  componentMap: ComponentMap;
  designBrief: any;
  activeSkin: string;
  skinCSS: string;
  apiKey: string;
}
```

Logic:
1. Compare original vs current screen codes — find which screens changed (simple string comparison is fine, if code strings differ the screen changed)
2. For each changed screen, call Stage 3b with the before/after code + that screen's component map
3. Combine all Stage 3b outputs into a single DESIGN_CHANGES.md
4. Build updated vibekit.design.json (same programmatic approach as initial export)
5. Return file array: DESIGN_CHANGES.md, vibekit.design.json, vibekit-skin.css, screens/*.jsx

### 5. Import UI — `components/companion/ImportModal.tsx`

New component. Triggered by an "Import Project" button (add to the companion header area, next to Export).

The modal has:
- Title: "Import Existing Project"
- Subtitle: "Paste your page files so VibeKit can preview your app"
- A file list where the user adds files:
  - Each entry: file path input (text, placeholder "app/dashboard/page.tsx") + code textarea (monospace, placeholder "Paste component code...")
  - "Add another file" button
  - Pre-populate with one empty entry
- "Import" button (primary) → calls import pipeline → loading spinner → closes modal and shows preview
- Error state if Stage 0 fails

### 6. State Changes — `app/design/page.tsx`

Add to DesignState:
- `importedFrom: boolean` — true if state was populated via import (affects export behavior)
- `originalScreenCodes: ScreenCode[] | null` — snapshot of screen codes from import (used for diff comparison on re-export)
- `componentMap: ComponentMap | null` — from Stage 0

Add actions:
- `IMPORT_PROJECT` — sets screenCodes, componentMap, originalScreenCodes, designBrief, navStructure, importedFrom=true
- Clear componentMap and originalScreenCodes when doing a fresh design (RESET action)

### 7. Export Mode Detection — modify ExportModal

The Export button should detect whether this is an initial export or a re-export:
- If `importedFrom === true` and `originalScreenCodes !== null` → call `runReExportPipeline()` → produces DESIGN_CHANGES.md
- If `importedFrom === false` → call `runExportPipeline()` → produces CLAUDE.md + SCREEN_SPEC.md (current behavior)

The user doesn't need to choose — VibeKit detects the mode automatically.

## What NOT to Build

- No CLI scanner (Phase 2)
- No automated project directory reading
- No Claude Code integration
- No diff-aware re-import (each import is from scratch)
- No file system access — everything is paste/upload in the browser

## Testing

### Test 1: Import the MoneyFlow Export
We previously exported a MoneyFlow finance dashboard. The screen JSX files are the "real codebase" for testing.

1. Open VibeKit
2. Click "Import Project"  
3. Paste the 4 screen files (overview.jsx, transactions.jsx, budgets.jsx, accounts.jsx) with their paths
4. Click Import
5. Verify: preview shows all 4 screens, sidebar navigation works, screens look like the originals
6. Check component map: does it correctly identify sections and map them to source files?

### Test 2: Iterate and Re-Export
1. After importing MoneyFlow, make a design change: "add a net worth comparison chart to the overview"
2. Verify preview updates
3. Click Export
4. Verify: ZIP contains DESIGN_CHANGES.md (not SCREEN_SPEC.md)
5. Open DESIGN_CHANGES.md: does it describe only the overview change? Does it list the other screens as unchanged? Does it include implementation hints?

### Test 3: Apply Changes
1. Take the DESIGN_CHANGES.md to Claude Code (or do it manually)
2. Apply the changes to the original screen files
3. Verify: the change was applied correctly and no other code was modified

## File Summary

| File | Action |
|------|--------|
| `prompts/stage0-codebase-reader.md` | Create |
| `prompts/stage3b-change-detector.md` | Create |
| `lib/ai/import-pipeline.ts` | Create |
| `lib/ai/export-pipeline.ts` | Modify (add runReExportPipeline) |
| `components/companion/ImportModal.tsx` | Create |
| `app/design/page.tsx` | Modify (add import state + actions) |
| `components/companion/ExportModal.tsx` | Modify (detect import mode) |
