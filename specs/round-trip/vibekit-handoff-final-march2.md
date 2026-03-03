# VibeKit Handoff — March 2, 2026 (Final Update)

## What VibeKit Is

VibeKit is a design companion for AI-coded apps. Apps built with AI coding tools (Claude Code, Cursor) look generic. VibeKit lets you design interactively in a chat interface, iterate until it looks great, then export spec files your AI coding tool builds from.

Core value: **iterate on design in isolation** (fast, no codebase to break), export once, Claude Code builds from a clean spec. Then come back to VibeKit to iterate again — it reads your codebase and produces targeted design changes, preserving all business logic.

## Architecture: Full Pipeline

```
INITIAL DESIGN FLOW:
  User describes app → Stage 1 (Design Director) → Design Brief
  Design Brief → Selector → 2-4 Reference Files
  Brief + References → Stage 2 (Code Generator) → Preview JSX screens
  User iterates → Edit Pipeline → Updated preview screens
  User clicks Export → Stage 3 (Spec Writer) → CLAUDE.md + SCREEN_SPEC.md + vibekit.design.json
  Claude Code builds real app from specs

ROUND-TRIP FLOW (not yet built):
  User returns to VibeKit with existing codebase
  Stage 0 (Codebase Reader) → Preview JSX + Component Map
  User iterates design in VibeKit
  Stage 3b (Change Detector) → DESIGN_CHANGES.md (targeted diffs)
  Claude Code applies diffs to existing code, preserving business logic
```

### Stage 0 — Codebase Reader (NOT BUILT)
- Reads real React/Next.js page files and components
- Strips imports, TypeScript, API calls, auth, context providers
- Produces self-contained preview JSX (same format as Stage 2 output)
- Produces a **component map** linking preview sections to real source files
- Reconstructs approximate design brief from code analysis

### Stage 1 — Design Director (`prompts/stage1-design-director.md`)
- Receives user's app description
- Makes UX decisions: nav model, content relationship, mutation model, density, personality
- Sometimes asks clarifying questions
- Outputs design brief (JSON) + conversational text
- Has opinions — pushes back on bad UX choices

### Selector (`lib/ai/select-references.ts`)
- Maps design brief to 2-4 reference files
- Based on 3 axes: nav_model → content_relationship → mutation_model

### Stage 2 — Code Generator (`prompts/stage2-code-generator-v2.md`)
- Receives design brief + selected reference files
- Generates React/JSX code for each screen
- Uses CSS variable system (h()/ha() helpers)
- Output rendered live via react-live

### Edit Pipeline (`editPipeline()` in `lib/ai/pipeline.ts`)
- For follow-up messages, skips Stage 1
- Sends current screen code + edit request to Stage 2
- Key instruction: "incorporate the change, preserve app identity"

### Stage 3 — Spec Writer (`prompts/stage3-spec-writer.md`)
- Triggered on Export (initial design flow)
- Reads final screen code + design brief + skin CSS
- Produces CLAUDE.md + SCREEN_SPEC.md
- Code is source of truth over brief (iteration may have changed things)
- vibekit.design.json built programmatically (not by AI)

### Stage 3b — Change Detector (NOT BUILT)
- Triggered on Re-Export (round-trip flow)
- Compares original preview (from Stage 0) to current preview (after iteration)
- Uses component map to link changes to real source files
- Produces DESIGN_CHANGES.md with targeted diffs + implementation hints

---

## What's Built and Working

### Pipeline Infrastructure
- `prompts/` — 4 prompt files (stage1, stage2-v2, selector-logic, stage3-spec-writer)
- `references/` — 17 reference JSX files + index.ts
- `lib/ai/select-references.ts` — Brief → references mapping
- `lib/ai/load-references.ts` — Reference file loader
- `lib/ai/pipeline.ts` — runPipeline() + editPipeline()
- `lib/ai/export-pipeline.ts` — runExportPipeline() with Stage 3 AI call + programmatic design.json
- `lib/skin-css.ts` — Skin CSS as JS strings
- `components/companion/WireframePanel.tsx` — react-live renderer
- `components/companion/ScreenNavigator.tsx` — Screen tab switcher
- `components/companion/ExportModal.tsx` — Single "Export" button with loading spinner
- Click interception for data-navigate and data-overlay
- CSS variable short aliases in all-skins.css
- Recharts in react-live scope
- Iteration counter in DesignState

### Reference Library (17 files)
Core patterns (12): browse-drill, workspace-sidebar, conversational, split-pane, form-sections, sequential-flow, feed-timeline, tab-sections, overlay-modal, expand-in-place, drag-kanban, inline-edit

Domain-specific (5): dashboard-charts, landing-page, product-detail, pricing-table, empty-loading-error

### Skins (6)
Modern SaaS (purple), Warm Amber, Cool Indigo, Dark Technical, Rose Garden, Forest

### Export Package (what the ZIP contains)
- `CLAUDE.md` — Design system rules with "Reference Implementation" note at top
- `SCREEN_SPEC.md` — Screen-by-screen blueprint with sample data
- `vibekit.design.json` — Machine-readable state
- `vibekit-skin.css` — Active skin CSS
- `screens/{id}.jsx` — Individual screen React code

---

## Test Results

### Export Tested With Two App Types

**MoneyFlow (finance dashboard):**
- Sidebar nav, 4 screens (overview, transactions, budgets, accounts)
- SVG line chart, progress bars, split-pane layouts
- Export produced good CLAUDE.md + SCREEN_SPEC.md
- Rebuilt from specs: ~80% accurate, gaps in chart implementation details and sample data
- Applied 5 fixes (see below), now ~95%+ with screen JSX as reference

**ProjectFlow (project management SaaS):**
- Sidebar nav, 4 screens (dashboard, projects, tasks, team)
- Metrics grid, split-pane with detail panels, inline editing, comments
- Edit pipeline: added search bar to tasks (worked, preserved app identity)
- Export produced good output with all fix improvements
- Sample data partially truncated (only first item + `// ...`) — one more prompt fix needed

### What Works ✅
- Pipeline generates appropriate designs for different app types
- Stage 1 asks smart questions and pushes back on bad UX
- Skin switching works
- Edit pipeline preserves app identity while incorporating changes
- Export produces CLAUDE.md + SCREEN_SPEC.md good enough for Claude Code rebuild
- Screen JSX files in export serve as definitive reference
- Single Export button (simplified from 3 options)

### Known Issues
- **Sample data truncation** — Stage 3 includes first item then `// ...`. Prompt fix written but not yet applied: "Include EVERY item, do not truncate with ellipsis."
- **Some clicks don't work in preview** — Complex event handling in react-live. Polish issue.
- **Pipeline is slow** — 3 sequential API calls (Stage 1 + 2 + 3 on export). 1-3 min for design, 30-60s for export.
- **Design quality gap** — Pipeline output is decent but not as polished as hand-crafted test harness apps. See detailed analysis below.

---

## Design Quality Gap (Detailed)

The hand-crafted test harness apps look significantly more polished than pipeline output. Seven specific gaps identified, all fixable with Stage 2 prompt engineering (no code changes):

### 1. Sample Data Quality
**Harness:** Real brand names ("Whole Foods Market" -$127.43), specific metrics ("2.5 hrs saved/day"), diverse names with roles ("In-House Counsel at Meridian")
**Pipeline:** Generic or bland data. Fix: Add "Data Quality Rules" requiring real brand names, specific dollar amounts with cents, diverse realistic names.

### 2. Color Distribution (10 placement points)
**Harness uses primary color in:** nav logo gradient, category badges, avatar circles, key metrics, active filter pills, "View all" links, step number circles, tab underline, CTA section gradient, trust badges
**Pipeline:** Usually only CTA button + 1-2 badges. Fix: "Every screen MUST have at least 6 distinct uses of primary color beyond the CTA."

### 3. Gradient and Layered Backgrounds
**Harness:** Balance hero card uses `linear-gradient(135deg, ha("--primary", 0.08), ha("--primary", 0.02))`. Hero sections have two radial gradient blobs (500px). Image overlays: `linear-gradient(to top, ha("--fg", 0.35), transparent 50%)`. Logo icon uses gradient.
**Pipeline:** Flat `h("--card")` everywhere. Fix: "Most important card MUST use gradient background. Every image MUST have gradient overlay. Logo MUST use gradient."

### 4. Multi-Property Hover States
**Harness:** Cards: translateY(-4px) + boxShadow. Images: scale(1.05) 0.5s. CTA buttons: opacity + translateY + primary shadow. Back links: color transition. Budget cards: translateY + shadow.
**Pipeline:** Maybe a background change, or nothing. Fix: Specify exact hover recipe per component type.

### 5. Dramatic Typography Hierarchy (5:1+ ratio)
**Harness:** Hero: clamp(2.5rem, 5vw, 3.75rem) weight 800. Balance: 36px weight 800. Stat numbers: 24px. Body: 14px. Meta: 10-11px.
**Pipeline:** Everything 14-18px. Fix: "Hero numbers: minimum 28px. Stat numbers: minimum 20px. Meta: 11-12px. Ratio between largest and smallest must be 3:1+."

### 6. Intentional Negative Space
**Harness:** Hero paddingTop: 80. Card grid gap: 28px. Inside card: padding 20. Between title/preview: 8px. Between sections: 24-40px.
**Pipeline:** Uniform gap-16 or gap-24 everywhere. Fix: "Hero sections paddingTop ≥ 64px. Section spacing ≥ 24px. Item spacing ≤ 12px. Ratio between section and item spacing must be 2:1+."

### 7. Finishing Details
**Harness:** tabular-nums on ALL numbers. letterSpacing -0.02em on headlines. line-clamp-2 on cards. Vertical dividers between metrics. Category-specific progress bar colors. Modal shadow 24px depth + fadeIn animation. Number formatting with sign/comma/decimals. Hidden scrollbars on filter pills.
**Pipeline:** Inconsistent. Fix: Mandatory "Finishing Touches Checklist" in Stage 2 prompt.

---

## Round-Trip Architecture (NOT BUILT)

### The Problem
After Claude Code builds the real app, the user wants to come back to VibeKit to iterate. But the codebase has diverged from the original design — Claude Code added routing, APIs, auth, business logic, and the user may have made manual edits. VibeKit needs to read the current codebase and show an approximate preview, then export targeted changes that don't destroy business logic.

### Key Design Decision: Targeted Diffs, Not Fresh Specs
Re-export produces DESIGN_CHANGES.md (targeted diffs mapped to source files), NOT a fresh SCREEN_SPEC.md. This is safer because:
- Claude Code knows exactly which files to modify
- Explicitly lists unchanged files
- Implementation hints give concrete CSS changes
- Business logic, API calls, auth are preserved

### Component Map — The Linchpin
Stage 0 builds a component map linking preview sections to real source files:
```json
{
  "screen_id": "dashboard",
  "sections": [
    {
      "id": "metrics_grid",
      "label": "Metrics Grid",
      "source_file": "components/MetricsGrid.tsx",
      "line_range": [15, 82],
      "description": "4-column grid of metric cards"
    }
  ]
}
```
When the user edits the preview, VibeKit knows which real files are affected. DESIGN_CHANGES.md maps changes to specific files with implementation hints.

### DESIGN_CHANGES.md Format
```markdown
# DESIGN_CHANGES.md — ProjectFlow

## Summary
Widened sidebar, replaced project cards with table view.

## Changes

### Sidebar Navigation → `components/Sidebar.tsx`
**Before:** w-56 sidebar with small avatar
**After:** w-64 sidebar with larger avatar and status dot
**Implementation hints:**
- Change w-56 to w-64
- Avatar: w-8 h-8 → w-10 h-10
- Add green status dot positioned bottom-right

### Active Projects → `app/dashboard/page.tsx` (lines 45-98)
**Before:** Stacked cards with progress bars
**After:** Table with sortable columns
**Implementation hints:**
- Replace space-y-3 card container with <table>
- Columns: Project, Status, Progress, Due, Team

## Unchanged
Do not modify:
- components/MetricsGrid.tsx
- components/ActivityFeed.tsx
```

### Implementation Phases

**Phase 1: Manual Import MVP**
- User pastes/uploads page files + nav component
- Stage 0 AI converts to preview JSX + component map
- User iterates in VibeKit
- Re-export produces DESIGN_CHANGES.md
- Build: Import UI, Stage 0 prompt, component map storage, Stage 3b prompt, modified export pipeline

**Phase 2: CLI Scanner**
- `npx vibekit scan ./my-project` → vibekit-import.json
- Automated project scanning, import following, code bundling

**Phase 3: Integrated Round-Trip**
- VibeKit ↔ Claude Code direct communication
- Changes flow both directions automatically

### Open Questions
1. Token budget: Can Stage 0 handle a complex page with 5+ imported components in one call?
2. Preview accuracy: How close does it need to be for the user to recognize their app?
3. New screens: If user adds a screen in VibeKit that doesn't exist in codebase, DESIGN_CHANGES.md needs a "New Screens" section with full specs.
4. Deleted screens: Flag for user, don't auto-delete files.
5. Line range drift: After Claude Code applies changes, line numbers shift. Use section descriptions for matching, not line numbers.

---

## Priority Roadmap

### ✅ Completed
1. Live preview (react-live, skin switching, screen navigation)
2. Basic iteration (edit pipeline with identity preservation)
3. Export flow (Stage 3 spec writer, single Export button, 5 quality fixes applied)

### 🔲 Current Priority: Round-Trip Phase 1 (Manual Import MVP)
- Import UI (paste/upload page files)
- Stage 0 prompt (codebase reader)
- Stage 0 pipeline function
- Component map data structure
- Stage 3b prompt (change detector)
- Re-export pipeline producing DESIGN_CHANGES.md
- Test: import a real project built from VibeKit export, iterate, re-export, apply changes

### 🔲 Next: Design Quality (Stage 2 Prompt Engineering)
- All 7 improvements from Design Quality Gap section
- Pure prompt changes, no code
- Can be done anytime

### 🔲 Later: Round-Trip Phase 2 (CLI Scanner)
- `npx vibekit scan` command
- Automated project structure scanning
- Import following and code bundling

### 🔲 Later: Sample data truncation fix
- One-sentence addition to Stage 3 prompt
- "Include EVERY item, do not truncate"

### 🔲 P2: Missing Reference Files
- ref-calendar-schedule.jsx
- ref-command-palette.jsx
- ref-media-player.jsx

### 🔲 P3: Skin Description Feature
- User describes desired skin in natural language
- AI generates CSS variable values

---

## Key Files

### VibeKit Next.js Project
- `app/design/page.tsx` — Main companion page + iteration counter
- `components/companion/WireframePanel.tsx` — react-live renderer
- `components/companion/ScreenNavigator.tsx` — Screen tabs
- `components/companion/ExportModal.tsx` — Single Export button
- `lib/ai/pipeline.ts` — runPipeline() + editPipeline()
- `lib/ai/export-pipeline.ts` — runExportPipeline()
- `lib/ai/select-references.ts` — Reference selector
- `lib/skin-css.ts` — Skin CSS strings
- `prompts/stage1-design-director.md` — Stage 1
- `prompts/stage2-code-generator-v2.md` — Stage 2 (most important for quality)
- `prompts/stage3-spec-writer.md` — Stage 3
- `styles/skins/all-skins.css` — Skin CSS variables

### Architecture Docs
- `vibekit-roundtrip-architecture.md` — Full round-trip spec (Stage 0, component map, DESIGN_CHANGES.md)
- `vibekit-session-handoff-march2-updated.md` — Previous handoff (superseded by this doc)
- `vibekit-export-instructions.md` — Claude Code instructions for export feature
- `vibekit-export-quality-fixes.md` — 5 fixes applied to export

### Test Artifacts
- `vibekit-test-harness.html` — AI Does It consumer app (quality benchmark)
- `pocketbook-pipeline-test.html` — Finance tracker (quality benchmark)
- `moneyflow-rebuild.jsx` — Rebuild test from export specs

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
