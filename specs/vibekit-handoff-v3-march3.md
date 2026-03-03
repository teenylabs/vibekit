# VibeKit Handoff — March 3, 2026 (v3)

## What VibeKit Is

VibeKit is a design companion for AI-coded apps. Apps built with AI coding tools (Claude Code, Cursor) look generic. VibeKit lets you design interactively in a chat interface, iterate until it looks great, then export spec files your AI coding tool builds from. Then come back to VibeKit to iterate again — it reads your codebase and produces targeted design changes, preserving all business logic.

## Architecture: Full Pipeline

```
INITIAL DESIGN FLOW:
  User describes app → Stage 1 (Design Director) → Design Brief
  Design Brief → Selector → 2-4 Reference Files
  Brief + References → Stage 2 (Code Generator) → Preview JSX screens
  User iterates → Edit Pipeline → Updated preview screens
  User clicks Export → Stage 3 (Spec Writer) → CLAUDE.md + SCREEN_SPEC.md + vibekit.design.json
  Claude Code builds real app from specs

ROUND-TRIP FLOW (Phase 1 — BUILT AND TESTED):
  User returns to VibeKit → clicks Import → drops files
  Stage 0 (Codebase Reader) → Preview JSX + Component Map
  User iterates design in VibeKit
  Stage 3b (Change Detector) → DESIGN_CHANGES.md (targeted diffs)
  Claude Code applies diffs to existing code, preserving business logic
```

---

## Current Status: Round-Trip Phase 1 WORKING

### What's Been Tested

**Test 1 — Import MoneyFlow (4 screens):**
- Imported overview.jsx, transactions.jsx, budgets.jsx, accounts.jsx
- Stage 0 produced valid preview JSX for all 4 screens
- Preview renders correctly: sidebar nav works, screen switching works, all data visible
- Styling preserved: h()/ha() helpers, CSS variables, Tailwind classes all carried through

**Test 2 — Iterate (add sparklines to budget cards):**
- Typed "add weekly spending sparklines to budget cards"
- Edit pipeline added sparklines to budgets screen preview
- Other screens unchanged
- Styling stayed consistent because the imported code already uses VibeKit's design system

**Test 3 — Re-Export:**
- Clicked Export → got DESIGN_CHANGES.md (not SCREEN_SPEC.md) ✅
- DESIGN_CHANGES.md correctly identified only budgets changed ✅
- Implementation hints are concrete: SVG viewBox, strokeWidth, opacity, color references ✅
- budgets.jsx in ZIP has sparkline code (27 references) ✅
- overview.jsx, transactions.jsx, accounts.jsx have zero sparkline references ✅

**Issues Found:**
1. Import UI is painful — requires copy-pasting code into textareas → FIX: file drag-and-drop
2. Import is slow (60-90s) — 4 sequential API calls → FIX: single API call for all files
3. DESIGN_CHANGES.md "Unchanged" section doesn't list the other 3 untouched screen files → FIX: append programmatically
4. Sparklines were all identical across budget cards (edit quality issue, acceptable for now)

### What's Being Built Now

**vibekit-import-ux-fixes-v2.md** — 4 fixes:
1. File drag-and-drop in ImportModal (replace textareas)
2. Single API call for import (bundle all files, cut time to 15-25s)
3. Parallelize Stage 3b calls in re-export
4. Append unchanged screen files list to DESIGN_CHANGES.md programmatically

---

## What's Built and Working

### Pipeline Infrastructure
- `prompts/stage0-codebase-reader.md` — Stage 0 (reads real code, produces preview JSX + component map)
- `prompts/stage1-design-director.md` — Stage 1 (design decisions)
- `prompts/stage2-code-generator-v2.md` — Stage 2 (code generation)
- `prompts/stage3-spec-writer.md` — Stage 3 (initial export specs)
- `prompts/stage3b-change-detector.md` — Stage 3b (targeted design diffs)
- `references/` — 17 reference JSX files + index.ts
- `lib/ai/select-references.ts` — Brief → references mapping
- `lib/ai/load-references.ts` — Reference file loader
- `lib/ai/pipeline.ts` — runPipeline() + editPipeline()
- `lib/ai/import-pipeline.ts` — runImportPipeline() (Stage 0)
- `lib/ai/export-pipeline.ts` — runExportPipeline() (initial) + runReExportPipeline() (round-trip)
- `lib/skin-css.ts` — Skin CSS as JS strings
- `components/companion/WireframePanel.tsx` — react-live renderer
- `components/companion/ScreenNavigator.tsx` — Screen tab switcher
- `components/companion/ExportModal.tsx` — Detects import mode, branches between initial/re-export
- `components/companion/ImportModal.tsx` — Import dialog (being upgraded to file upload)
- `app/design/page.tsx` — Main page with importedFrom, originalScreenCodes, componentMap state
- Click interception for data-navigate and data-overlay
- CSS variable short aliases in all-skins.css
- Recharts in react-live scope
- Iteration counter in DesignState

### State Shape (app/design/page.tsx)
```typescript
interface DesignState {
  screenCodes: ScreenCode[];
  navStructure: NavStructure;
  designBrief: DesignBrief;
  activeSkin: string;
  iterationCount: number;
  // Round-trip additions:
  importedFrom: boolean;              // true if imported from codebase
  originalScreenCodes: ScreenCode[];  // snapshot from import (for diff comparison)
  componentMap: ComponentMap;          // links preview sections to source files
}
```

### Export Behavior
- `importedFrom === false` → initial export → CLAUDE.md + SCREEN_SPEC.md + vibekit.design.json + skin CSS + screens
- `importedFrom === true` → re-export → DESIGN_CHANGES.md + vibekit.design.json + skin CSS + screens

---

## Design Quality Gap (7 Issues — All Prompt Engineering)

These affect Stage 2 output quality. No code changes needed, only prompt tuning:

1. **Sample data quality** — Pipeline uses generic data. Fix: require real brand names, specific dollars, diverse names
2. **Color distribution** — Pipeline only colors CTA + 1-2 badges. Fix: require 6+ primary color uses per screen
3. **Gradient backgrounds** — Pipeline uses flat colors. Fix: require gradients on hero cards, image overlays, logos
4. **Multi-property hover states** — Pipeline does bg change only. Fix: specify exact recipe (translateY + shadow for cards, scale for images, etc.)
5. **Typography hierarchy** — Pipeline uses 14-18px for everything. Fix: require 3:1+ ratio between largest and smallest text
6. **Intentional negative space** — Pipeline uses uniform gaps. Fix: require 2:1+ ratio between section and item spacing
7. **Finishing details** — Pipeline misses tabular-nums, letterSpacing, line-clamp, number formatting. Fix: mandatory checklist

### Export Quality Fixes (Applied)
1. ✅ Sample data in SCREEN_SPEC.md (partially — first item only, needs "include ALL items" fix)
2. ✅ Complex visual component details in SCREEN_SPEC.md
3. ✅ Hover states as inline CSS values in CLAUDE.md
4. ✅ "Reference Implementation" note prepended to CLAUDE.md
5. ✅ Single Export button (removed template-based options)

---

## Round-Trip Architecture

### Component Map
Links preview sections to real source files. Built by Stage 0 during import.

```typescript
interface ComponentMap {
  screens: ScreenMap[];
  shared: SharedComponentMap[];
}
interface ScreenMap {
  screen_id: string;
  screen_name: string;
  route: string;
  source_files: string[];
  sections: SectionMap[];
}
interface SectionMap {
  id: string;
  label: string;
  source_file: string;
  line_range: [number, number] | null;
  description: string;
}
```

### DESIGN_CHANGES.md Format
```markdown
# DESIGN_CHANGES.md — {App Name}

## Summary
{1-2 sentences}

## Changes
### {Section Label} → `{source_file}`
**Before:** ...
**After:** ...
**Implementation hints:**
- {concrete CSS/structural change}

## Unchanged Screen Files
Do not modify:
- `overview.jsx` — No changes
- `transactions.jsx` — No changes

## Unchanged Sections (within modified screens)
- Sidebar Navigation → `budgets.jsx`
- Page Header → `budgets.jsx`

## Updated Design Tokens
No changes. / {new CSS variables}
```

---

## Priority Roadmap

### ✅ Completed
1. Live preview (react-live, skin switching, screen navigation)
2. Basic iteration (edit pipeline with identity preservation)
3. Export flow (Stage 3 spec writer, single Export button, 5 quality fixes)
4. Round-trip Phase 1 (import → preview → iterate → re-export with DESIGN_CHANGES.md)

### 🔲 In Progress: Import UX Fixes
- File drag-and-drop (replace textareas)
- Single API call for import (speed: 60-90s → 15-25s)
- Parallelize re-export Stage 3b calls
- Unchanged screen files list in DESIGN_CHANGES.md

### 🔲 Next: Testing Strategy
- Need automated or semi-automated testing for the full loop
- Manual testing is too slow (import + edit + export = 3-5 minutes per test)
- Options: script-based pipeline test, fixture files, comparison assertions

### 🔲 Next: Design Quality (Stage 2 Prompt Engineering)
- All 7 improvements from Design Quality Gap section
- Pure prompt changes, no code

### 🔲 Later: Round-Trip Phase 2 (CLI Scanner)
- `npx vibekit scan ./my-project` → auto-imports project files
- Automated project structure scanning + import following

### 🔲 Later: Sample data truncation fix
- Stage 3 includes first item then `// ...`
- One-sentence prompt addition: "Include EVERY item"

### 🔲 P2: Missing Reference Files
- ref-calendar-schedule.jsx, ref-command-palette.jsx, ref-media-player.jsx

### 🔲 P3: Skin Description Feature
- User describes desired skin in natural language
- AI generates CSS variable values

---

## Key Files

### Prompts
- `prompts/stage0-codebase-reader.md` — Reads real code → preview JSX + component map
- `prompts/stage1-design-director.md` — UX decisions from user description
- `prompts/stage2-code-generator-v2.md` — Code generation (most important for quality)
- `prompts/stage3-spec-writer.md` — Initial export: CLAUDE.md + SCREEN_SPEC.md
- `prompts/stage3b-change-detector.md` — Re-export: DESIGN_CHANGES.md

### Pipeline
- `lib/ai/pipeline.ts` — runPipeline() + editPipeline()
- `lib/ai/import-pipeline.ts` — runImportPipeline()
- `lib/ai/export-pipeline.ts` — runExportPipeline() + runReExportPipeline()
- `lib/ai/select-references.ts` — Reference selector

### UI
- `app/design/page.tsx` — Main page, state management, all handlers
- `components/companion/WireframePanel.tsx` — react-live renderer
- `components/companion/ScreenNavigator.tsx` — Screen tabs
- `components/companion/ExportModal.tsx` — Export (detects initial vs re-export mode)
- `components/companion/ImportModal.tsx` — Import (being upgraded to file upload)

### Architecture Docs
- `vibekit-handoff-v3-march3.md` — This document (latest)
- `vibekit-roundtrip-architecture.md` — Deep round-trip architecture
- `vibekit-roundtrip-phase1-instructions.md` — Phase 1 build instructions (completed)
- `vibekit-import-ux-fixes-v2.md` — Current UX fix instructions
- `vibekit-export-quality-fixes.md` — 5 export quality fixes (applied)

### Test Artifacts
- MoneyFlow screen files (overview.jsx, transactions.jsx, budgets.jsx, accounts.jsx) — used for round-trip testing
- ProjectFlow export (CLAUDE.md, SCREEN_SPEC.md, dashboard.jsx, projects.jsx, tasks.jsx) — used for export testing
- `vibekit-test-harness.html` — AI Does It consumer app (quality benchmark)
- `pocketbook-pipeline-test.html` — Finance tracker (quality benchmark)

---

## Design Decisions

1. **Responsive web, not mobile-native** — No bottom tab bars or native transitions
2. **CSS variables for all colors** — h()/ha() helpers, instant skin switching
3. **Reference files show quality, not templates** — Stage 2 matches quality, composes originals
4. **Edit preserves identity** — "Incorporate" changes, don't redesign
5. **Design Director has opinions** — Pushes back diplomatically
6. **Three-stage initial pipeline** — Stage 1 (design) → Stage 2 (code) → Stage 3 (export specs)
7. **vibekit.design.json built programmatically** — No AI escaping bugs
8. **Design quality is prompt engineering** — Architecture done, prompts need tuning
9. **Round-trip uses targeted diffs** — DESIGN_CHANGES.md, not fresh SCREEN_SPEC.md
10. **Component map enables targeted diffs** — Links preview sections to real source files
11. **Re-export preserves business logic** — Changes are visual only, existing code untouched
12. **Import is codebase-first** — vibekit.design.json is stale after Claude Code builds, so always read real code
13. **Single API call for import** — Bundle all files, don't make sequential calls per page
