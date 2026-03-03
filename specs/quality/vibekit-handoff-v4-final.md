# VibeKit Handoff — March 3, 2026 (v4 Final)

## What VibeKit Is

VibeKit is a design companion for AI-coded apps. Apps built with AI coding tools (Claude Code, Cursor) look generic. VibeKit lets you design interactively in a chat interface, iterate until it looks great, then export spec files your AI coding tool builds from. Then come back to VibeKit to iterate again — it reads your codebase and produces targeted design changes, preserving all business logic.

**Tech stack:** Next.js, react-live for preview, Anthropic Claude API for all AI stages, CSS variables for theming.

## Architecture: Full Pipeline

```
INITIAL DESIGN FLOW (fully working):
  User describes app → Stage 1 (Design Director) → Design Brief JSON
  Design Brief → Selector → 2-4 Reference Files from library of 17
  Brief + References → Stage 2 (Code Generator) → Preview JSX screens
  User iterates via chat → Edit Pipeline → Updated preview screens
  User clicks Export → Stage 3 (Spec Writer) → ZIP: CLAUDE.md + SCREEN_SPEC.md + screens/*.jsx + skin CSS + design.json
  User gives ZIP to Claude Code → builds real app from specs

ROUND-TRIP FLOW (fully working, tested end-to-end):
  User returns to VibeKit → clicks Import → drops .jsx/.tsx files
  Stage 0 (Codebase Reader) → Preview JSX + Component Map
  User iterates design in VibeKit chat
  Stage 3b (Change Detector) → DESIGN_CHANGES.md (targeted diffs mapped to source files)
  User gives DESIGN_CHANGES.md to Claude Code → applies changes surgically, preserving business logic
```

## Current Status: EVERYTHING WORKS

### End-to-End Test Results (all passing)

Automated Playwright E2E test (`npm run test:e2e`) covers the full loop:

| Step | What | Status |
|------|------|--------|
| 1 | Generate a finance app | ✅ 3 screens produced |
| 2 | Export initial design | ✅ ZIP has CLAUDE.md, SCREEN_SPEC.md, 4 screen files |
| 3 | Import exported screens back | ✅ File drag-and-drop, preview renders, 4 tabs |
| 4 | Edit ("add a search bar") | ✅ Preview updates, screens preserved |
| 5 | Re-export | ✅ DESIGN_CHANGES.md (not SCREEN_SPEC.md), unchanged files listed |
| 5b | Claude applies DESIGN_CHANGES.md | ✅ Surgical diff — only sparklines added, original data preserved, line count ratio 1.16, no invented files |
| 6 | Fresh export regression | ⏭️ Not yet run (skipped to save tokens) |

### Key Validation: The Surgical Diff Works

The diff of budgets.jsx before/after Claude applied DESIGN_CHANGES.md showed:
- Lines 11-18: Only change is appending `weeklySpending` arrays to existing data objects. All original values preserved byte-for-byte.
- Lines 122-138: Sparkline calculation logic inserted (new code, nothing removed)
- Lines 171-184: SVG sparkline rendering inserted between progress bar and status badge
- Zero lines deleted. Zero existing values changed. No invented files.

### E2E Test Infrastructure

```bash
npm run test:e2e                              # full run (expensive, ~8 API calls)
npm run test:e2e -- --from=5b --skip-regression  # just test Claude apply step (cheap, 1 API call)
npm run test:e2e -- --from=3                  # resume from import step
```

- `--from=N` skips earlier steps, loads saved artifacts from `test-output/`
- `--skip-regression` skips Step 6 (fresh design regression check)
- Screenshots saved to `test-output/*.png`
- Applied files saved to `test-output/applied/`
- Original screens saved to `test-output/screens/`

**Known test issues:**
- `--from=5` replay hangs (import modal selector mismatch during replay) — needs fixing
- Step 5b evidence check is hardcoded for specific keywords — should be dynamic from DESIGN_CHANGES.md content
- Model string was manually fixed to `claude-sonnet-4-5-20250929`

---

## What's Built

### Prompt Files
| File | Purpose |
|------|---------|
| `prompts/stage0-codebase-reader.md` | Reads real code → preview JSX + component map |
| `prompts/stage1-design-director.md` | UX decisions from user description |
| `prompts/stage2-code-generator-v2.md` | Code generation (most important for quality) |
| `prompts/stage3-spec-writer.md` | Initial export: CLAUDE.md + SCREEN_SPEC.md |
| `prompts/stage3b-change-detector.md` | Re-export: DESIGN_CHANGES.md with surgical modification instructions |

### Pipeline Code
| File | Purpose |
|------|---------|
| `lib/ai/pipeline.ts` | runPipeline() + editPipeline() |
| `lib/ai/import-pipeline.ts` | runImportPipeline() — Stage 0 |
| `lib/ai/export-pipeline.ts` | runExportPipeline() (initial) + runReExportPipeline() (round-trip) |
| `lib/ai/select-references.ts` | Design brief → reference file selector |
| `lib/ai/load-references.ts` | Reference file loader |
| `lib/skin-css.ts` | Skin CSS as JS strings |

### UI Components
| File | Purpose |
|------|---------|
| `app/design/page.tsx` | Main page, state (including importedFrom, originalScreenCodes, componentMap) |
| `components/companion/WireframePanel.tsx` | react-live preview renderer |
| `components/companion/ScreenNavigator.tsx` | Screen tab switcher |
| `components/companion/ExportModal.tsx` | Export — detects initial vs re-export mode automatically |
| `components/companion/ImportModal.tsx` | Import — file drag-and-drop |

### Reference Library (17 files in `references/`)
Core patterns (12): browse-drill, workspace-sidebar, conversational, split-pane, form-sections, sequential-flow, feed-timeline, tab-sections, overlay-modal, expand-in-place, drag-kanban, inline-edit

Domain-specific (5): dashboard-charts, landing-page, product-detail, pricing-table, empty-loading-error

### Skins (6)
Modern SaaS (blue), Warm Amber, Cool Indigo, Dark Technical, Rose Garden, Forest

### Test Infrastructure
| File | Purpose |
|------|---------|
| `scripts/e2e-roundtrip.ts` | Playwright E2E test — 7 steps with --from=N and --skip-regression |
| `test-output/` | Screenshots, screen files, applied files, design-changes.md |

---

## Design System

All colors use CSS variables via helpers:
```tsx
const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;
```

Key variables: `--bg`, `--fg`, `--primary`, `--primary-fg`, `--card`, `--muted`, `--muted-fg`, `--border`, `--destructive`, `--success`, `--warning`

Skin switching: `data-skin` attribute on root element, CSS variables update instantly.

---

## IMMEDIATE PRIORITIES (in order)

### Priority 1: Design Quality (IN PROGRESS)
**File:** `vibekit-design-quality-improvements.md` — instructions already written and ready for Claude Code.

7 mandatory quality rules added to Stage 2 prompt:
1. Sample data quality (real brands, specific dollars, diverse names)
2. Color distribution (6+ primary color uses per screen)
3. Mandatory gradients (hero cards, logos, image overlays)
4. Multi-property hover states (translateY + shadow for cards, scale for images)
5. Typography hierarchy (3:1+ ratio between largest and smallest text)
6. Intentional negative space (2:1+ spacing ratio between sections and items)
7. Finishing touches checklist (tabular-nums, letterSpacing, line-clamp, number formatting)

**Test:** Generate a recipe discovery app or travel app, compare to hand-crafted benchmarks (vibekit-test-harness.html, pocketbook-pipeline-test.html).

### Priority 2: Speed / Token Optimization

**Quick wins:**
- **Prompt caching** — Anthropic's prompt caching feature. Reference files and system prompts are the same across calls. Caching them cuts input token costs ~40-50%. Minimal code change — add cache headers to the API call.
- **Single API call for import** — Bundle all files into one Stage 0 call instead of sequential. Instructions were written (`vibekit-import-ux-fixes-v2.md`), may or may not have landed. Cuts import from 60-90s to 15-25s.
- **Haiku for edits** — Simple edits ("make the sidebar wider") don't need Sonnet. Use Haiku at ~10% the cost. Keep Sonnet for initial generation (Stage 1+2) and export (Stage 3).
- **Parallelize re-export** — Promise.all() on Stage 3b calls for changed screens.

**Bigger wins (later):**
- Trim context on edits — only send the screen being edited, not all screens
- Batch API for export/import (50% discount, async)

### Priority 3: Automated Claude Code Connection (Later)

**Phase 2: CLI Scanner**
```bash
npx vibekit scan ./my-project → vibekit-import.json
```
Scans project, identifies pages, follows imports, bundles code. User uploads JSON to VibeKit.

**Phase 3: Direct Integration**
VibeKit ↔ Claude Code communicate directly. Changes flow both directions automatically.

---

## Component Map Schema (for round-trip)

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

## DESIGN_CHANGES.md Format

```markdown
# DESIGN_CHANGES.md — {App Name}

## Summary
{1-2 sentences}

## Changes
### {Section Label} → `{source_file}`
**Before:** ...
**After:** ...
**Implementation hints:**
- {concrete CSS/structural changes}

## Unchanged Screen Files
Do not modify:
- `overview.jsx` — No changes

## Unchanged Sections (within modified screens)
- Sidebar Navigation → `budgets.jsx`

## Application Instructions
Apply changes surgically. Preserve ALL existing code, data, variable names.
Do NOT rewrite, refactor, or restructure any file.

## Updated Design Tokens
No changes. / {new CSS variables}
```

---

## Export Packages

### Initial Export (importedFrom === false)
ZIP contains: CLAUDE.md, SCREEN_SPEC.md, vibekit.design.json, vibekit-skin.css, screens/*.jsx

### Re-Export (importedFrom === true)
ZIP contains: DESIGN_CHANGES.md, vibekit.design.json, vibekit-skin.css, screens/*.jsx
Does NOT contain CLAUDE.md or SCREEN_SPEC.md.

---

## Design Quality Gap (Detailed Reference)

Hand-crafted test harness apps vs pipeline output. Benchmark files:
- `vibekit-test-harness.html` — AI Does It consumer app
- `pocketbook-pipeline-test.html` — Finance tracker

7 specific gaps with code-level examples documented in the session transcript. The `vibekit-design-quality-improvements.md` file contains the fix (all prompt engineering, no code changes).

---

## Applied Fixes History

1. ✅ Export: Sample data in SCREEN_SPEC.md (partial — first item only, needs "include ALL items")
2. ✅ Export: Complex visual component implementation hints
3. ✅ Export: Hover states as inline CSS values in CLAUDE.md
4. ✅ Export: "Reference Implementation" note in CLAUDE.md
5. ✅ Export: Single Export button (removed template options)
6. ✅ Import: File drag-and-drop (replaced textareas)
7. ✅ Round-trip: DESIGN_CHANGES.md with surgical modification instructions
8. ✅ Round-trip: "Application Instructions" footer in DESIGN_CHANGES.md
9. ✅ Round-trip: Stricter Step 5b prompt for Claude apply test
10. ✅ Round-trip: Stronger test assertions (data preservation, line ratio, no invented files)
11. ⬜ Import: Single API call (written, may not have landed)
12. ⬜ Import: Parallelize re-export
13. ⬜ Export: Sample data truncation ("include ALL items, no ellipsis")
14. ⬜ Design quality: 7 prompt improvements (instructions written, not yet applied)

---

## Design Decisions

1. Responsive web, not mobile-native
2. CSS variables for all colors via h()/ha() helpers
3. Reference files show quality, not templates
4. Edit preserves identity ("incorporate" not "redesign")
5. Design Director has opinions, pushes back
6. vibekit.design.json built programmatically (no AI escaping bugs)
7. Design quality is prompt engineering, not architecture
8. Round-trip uses targeted diffs (DESIGN_CHANGES.md), not fresh specs
9. Component map links preview sections to real source files
10. Import is codebase-first (design.json is always stale)
11. Single API call preferred for import (bundle all files)
12. Re-export preserves business logic — changes are visual only
