# VibeKit Round-Trip Architecture

## Overview

The round-trip enables users to move freely between VibeKit (design iteration) and Claude Code (implementation). The flow:

```
VibeKit → Export → Claude Code builds real app → User returns to VibeKit → 
Reads codebase → Shows preview → User iterates design → Re-exports targeted 
changes → Claude Code applies changes without losing business logic → repeat
```

Three new pieces of infrastructure:
1. **Stage 0 — Codebase Reader** (import): Reads real code, produces preview JSX + component map
2. **Component Map** (state): Links preview sections to real source files
3. **DESIGN_CHANGES.md** (re-export): Targeted design diffs that Claude Code applies to existing code

---

## Stage 0 — Codebase Reader

### When It Runs

When the user opens VibeKit and imports an existing project. MVP: user pastes/uploads files. Later: CLI scanner.

### Input

A bundle of the project's page and component files. For MVP, the user provides:
- The key page files (e.g., `app/dashboard/page.tsx`, `app/projects/page.tsx`)
- The shared layout/nav component (e.g., `components/Sidebar.tsx` or `app/layout.tsx`)
- Key UI components imported by those pages

Later (CLI scanner), this is automated:
```bash
npx vibekit scan ./my-project → vibekit-import.json
```

### Output

Stage 0 produces three things:

1. **screenCodes[]** — Self-contained preview JSX for each page (same format as Stage 2 output)
2. **componentMap** — Links preview sections to real source files
3. **designBrief** — Reconstructed from the code (app_type, nav_model, density, etc.)

### The Stage 0 Prompt

System prompt for the codebase reader AI. It processes one page at a time.

```
You are a codebase reader that converts real React/Next.js components into 
self-contained preview components for a design tool.

You receive:
- One or more source files that together make up a page in a web application
- The file paths for each source file

You produce:
1. A self-contained React/JSX component that visually matches the page
2. A component map linking sections of your preview to the source files

RULES FOR THE PREVIEW COMPONENT:

- Start with h()/ha() color helpers:
  const h = (v) => `hsl(var(${v}))`;
  const ha = (v, a) => `hsl(var(${v}) / ${a})`;

- Use ONLY: useState, useEffect, useRef, useCallback from React
- All data must be inline — no fetching, no API calls, no imports
- Preserve the visual layout EXACTLY: same flex/grid structure, same spacing, 
  same typography, same colors
- Preserve CSS variable usage (h()/ha() patterns) — if the code uses 
  h("--primary"), keep it
- Preserve Tailwind classes if used
- If the code fetches data, create realistic inline sample data that matches 
  what the UI expects. Base this on any TypeScript types, variable names, 
  or UI labels you can see.
- Preserve interactive states: active tabs, selected items, toggles, filters 
  (use useState)
- Include the nav/sidebar in each screen with the correct item active
- Strip: imports, TypeScript types, API calls, auth guards, context providers,
  server components, environment variables, complex state management
- End with: render(<ComponentName />);

RULES FOR THE COMPONENT MAP:

For each visually distinct section of the preview, identify which source file(s) 
contain the real implementation. Output as JSON:

{
  "screen_id": "dashboard",
  "screen_name": "Dashboard", 
  "screen_type": "page",
  "route": "/dashboard",
  "source_files": ["app/dashboard/page.tsx", "components/MetricsGrid.tsx", ...],
  "sections": [
    {
      "id": "sidebar",
      "label": "Sidebar Navigation",
      "source_file": "components/Sidebar.tsx",
      "line_range": [15, 82],
      "description": "Fixed sidebar with logo, nav items, user profile"
    },
    {
      "id": "metrics_grid", 
      "label": "Metrics Grid",
      "source_file": "components/MetricsGrid.tsx",
      "line_range": null,
      "description": "4-column grid of metric cards showing active projects, completed tasks, etc."
    },
    {
      "id": "project_cards",
      "label": "Active Projects",
      "source_file": "app/dashboard/page.tsx",
      "line_range": [45, 98],
      "description": "3 project cards with progress bars and team avatars"
    }
  ]
}

Notes on the component map:
- "source_file" is the real file where this section lives
- "line_range" is approximate — helps Claude Code find the right code. null if the entire file is one section.
- "description" is a short human-readable summary
- Every visible section of the preview should be mapped
- If a section spans multiple files (e.g., a card that imports a sub-component), 
  use the top-level file

OUTPUT FORMAT:

<preview_code>
(the self-contained JSX component)
</preview_code>

<component_map>
(the JSON component map)
</component_map>

<design_meta>
{
  "app_name": "extracted from logo/title",
  "nav_model": "sidebar | topnav | tabs | none",
  "density": "compact | comfortable | spacious",
  "app_type": "consumer | saas | dashboard | tool | chat"
}
</design_meta>
```

### Processing Multiple Pages

Stage 0 runs once per page. For a 4-page app, that's 4 AI calls. The first call also extracts the nav structure. Subsequent calls receive the nav structure so they can include it consistently.

```
Call 1: dashboard page + layout + nav component
  → preview JSX, component map, nav structure, design meta

Call 2: projects page + its components + nav structure from call 1
  → preview JSX, component map

Call 3: tasks page + its components + nav structure
  → preview JSX, component map

Call 4: settings page + its components + nav structure  
  → preview JSX, component map
```

### What Gets Stored

After Stage 0 completes, VibeKit state contains:
- `screenCodes[]` — preview JSX for each page
- `componentMap` — the full map linking preview sections to source files
- `navStructure` — extracted from the nav component
- `designBrief` — reconstructed from code analysis
- `activeSkin` — detected from CSS variables or defaulted
- `importedFrom` — flag indicating this is an import (not a fresh design)
- `sourceFiles` — the original source code, stored for diff comparison later

---

## Component Map Schema

```typescript
interface ComponentMap {
  screens: ScreenMap[];
  shared: SharedComponentMap[];
}

interface ScreenMap {
  screen_id: string;          // matches screenCodes[].id
  screen_name: string;        // human-readable
  route: string;              // e.g., "/dashboard"
  source_files: string[];     // all files involved in this page
  sections: SectionMap[];     // visual sections mapped to code
}

interface SectionMap {
  id: string;                 // unique within the screen
  label: string;              // human-readable: "Metrics Grid"
  source_file: string;        // primary source file for this section
  line_range: [number, number] | null;  // approximate line range in source file
  description: string;        // what this section contains
}

interface SharedComponentMap {
  id: string;                 // e.g., "sidebar", "header"
  label: string;
  source_file: string;
  description: string;
  used_in: string[];          // screen_ids that use this component
}
```

The component map is stored in VibeKit state and included in the re-export. It's what makes targeted diffs possible.

---

## DESIGN_CHANGES.md — Re-Export Format

When the user iterates in VibeKit and re-exports, instead of a fresh SCREEN_SPEC.md, VibeKit produces a DESIGN_CHANGES.md that describes what changed.

### How Changes Are Detected

VibeKit compares the current preview code against the preview code from Stage 0 import:
- Which screens were modified?
- Within modified screens, which sections changed?
- What specifically changed? (layout, colors, spacing, new components, removed components)

This comparison is done by an AI (Stage 3b — Change Detector), not a text diff. A text diff would be too noisy — the AI can describe the *semantic* changes.

### Stage 3b — Change Detector Prompt

```
You receive two versions of a preview component:
- BEFORE: the preview generated from the codebase import
- AFTER: the preview after the user iterated in VibeKit

You also receive the component map showing which source files correspond 
to which sections.

Produce a DESIGN_CHANGES.md that describes every visual change, mapped to 
the source files where Claude Code should apply them.

FORMAT:

# DESIGN_CHANGES.md — {App Name}

## Summary
{1-2 sentence overview of what changed}

## Changes

### {Section Label} → `{source_file}`
{Description of what changed in this section}

**Before:** {brief description of the old state}
**After:** {brief description of the new state}

**Implementation hints:**
- {specific CSS/style change: "Change width from w-56 to w-64"}
- {specific structural change: "Replace card grid with table layout"}
- {specific addition: "Add search input above the filter pills"}

### {Next Section} → `{source_file}`
...

## Unchanged
The following sections were NOT modified. Do not change these files:
- {section} → `{source_file}`
- {section} → `{source_file}`

## Updated Design Tokens
{If the skin changed, include the new CSS variables}
```

### What Makes This Better Than a Fresh Spec

1. **Targeted** — Claude Code knows exactly which files to modify
2. **Safe** — Explicitly lists unchanged files, reducing risk of collateral damage
3. **Implementation hints** — Gives Claude Code concrete CSS/style changes, not just "make it look like this"
4. **Preserves logic** — Changes are about visual treatment, not functionality. Claude Code keeps all business logic, API calls, auth, etc.

### Example DESIGN_CHANGES.md

```markdown
# DESIGN_CHANGES.md — ProjectFlow

## Summary
Widened the sidebar, replaced the project cards with a table view, 
and added a search bar to the tasks page.

## Changes

### Sidebar Navigation → `components/Sidebar.tsx`
Sidebar width increased and user profile section redesigned.

**Before:** w-56 (224px) sidebar with small avatar
**After:** w-64 (256px) sidebar with larger avatar and status indicator

**Implementation hints:**
- Change outer container from `w-56` to `w-64`
- User avatar: increase from `w-8 h-8` to `w-10 h-10`
- Add online status dot: 10px green circle, absolute positioned bottom-right of avatar
- Adjust nav item padding from `px-3` to `px-4`

### Active Projects Section → `app/dashboard/page.tsx` (lines 45-98)
Replaced project card grid with a table layout.

**Before:** 3 stacked cards, each with project name, status badge, progress bar, team avatars
**After:** Table with sortable columns: Project, Status, Progress, Due Date, Team

**Implementation hints:**
- Replace the `space-y-3` card container with a `<table>` element
- Table header: sticky, text-xs font-semibold, muted-fg color, border-bottom
- Table rows: hover background ha("--muted", 0.15), border-bottom ha("--border", 0.2)
- Progress column: inline progress bar (h-1.5) + percentage text
- Status column: same badge styles as before
- Team column: overlapping avatars (negative margin-left on 2nd+)

### Tasks Header → `app/tasks/page.tsx` (lines 12-25)
Added search input above the filter pills.

**Before:** "Tasks" title + filter pills immediately below
**After:** "Tasks" title + search input + filter pills below search

**Implementation hints:**
- Add `<input>` between the title and filter pills
- Input style: rounded-lg, px-3 py-2, text-sm, background ha("--muted", 0.25), 
  border 1px solid ha("--border", 0.5)
- Placeholder: "Search tasks..."
- Wire up to filter the task list by title match

## Unchanged
Do not modify these files:
- Metrics Grid → `components/MetricsGrid.tsx`
- Activity Feed → `components/ActivityFeed.tsx`
- Team Workload → `components/TeamWorkload.tsx`
- Projects Detail Panel → `app/projects/page.tsx` (lines 100-250)
- Budgets Screen → `app/budgets/page.tsx`

## Updated Design Tokens
No skin changes.
```

---

## Re-Export Pipeline

The re-export flow when the user has imported a codebase and iterated:

```typescript
async function reExportPipeline(input: {
  // From the original import
  originalScreenCodes: ScreenCode[];  // preview code from Stage 0
  componentMap: ComponentMap;
  
  // Current state after iteration
  currentScreenCodes: ScreenCode[];   // preview code after user edits
  designBrief: DesignBrief;
  activeSkin: string;
  skinCSS: string;
  
  apiKey: string;
}): Promise<ExportFile[]> {
  
  // 1. Detect which screens changed
  const changedScreens = findChangedScreens(
    input.originalScreenCodes, 
    input.currentScreenCodes
  );
  
  // 2. For each changed screen, call Stage 3b to produce targeted diffs
  const designChanges = await generateDesignChanges({
    changedScreens,
    componentMap: input.componentMap,
    originalScreenCodes: input.originalScreenCodes,
    currentScreenCodes: input.currentScreenCodes,
    apiKey: input.apiKey,
  });
  
  // 3. Assemble the export
  return [
    { filename: "DESIGN_CHANGES.md", content: designChanges },
    { filename: "vibekit.design.json", content: buildDesignJson(input) },
    { filename: "vibekit-skin.css", content: input.skinCSS },
    // Include updated screen previews for reference
    ...input.currentScreenCodes.map(s => ({
      filename: `screens/${s.id}.jsx`,
      content: s.code,
    })),
  ];
}

function findChangedScreens(
  original: ScreenCode[], 
  current: ScreenCode[]
): { screenId: string; before: string; after: string }[] {
  const changed = [];
  for (const curr of current) {
    const orig = original.find(o => o.id === curr.id);
    if (!orig || orig.code !== curr.code) {
      changed.push({
        screenId: curr.id,
        before: orig?.code || "(new screen)",
        after: curr.code,
      });
    }
  }
  return changed;
}
```

### What Goes in the ZIP for Re-Export

| File | Purpose |
|------|---------|
| `DESIGN_CHANGES.md` | Targeted diffs for Claude Code to apply |
| `vibekit.design.json` | Updated design state (for future round-trips) |
| `vibekit-skin.css` | Skin CSS (in case it changed) |
| `screens/*.jsx` | Updated preview JSX (reference for Claude Code) |

Note: NO fresh CLAUDE.md or SCREEN_SPEC.md. Those were for the initial build. Re-exports use DESIGN_CHANGES.md.

---

## Implementation Phases

### Phase 1: Manual Import MVP

**What the user does:**
1. Opens VibeKit
2. Clicks "Import Project"
3. Pastes or uploads their page files + nav component
4. VibeKit runs Stage 0, shows preview
5. User iterates on the design
6. Clicks Export → gets DESIGN_CHANGES.md + updated files
7. Gives the export to Claude Code

**What we build:**
- Import UI (file upload / paste dialog)
- Stage 0 prompt
- Stage 0 pipeline function (call AI per page, parse output)
- Component map data structure and storage
- Modified export pipeline that detects import mode and produces DESIGN_CHANGES.md
- Stage 3b prompt (change detector)

**What we DON'T build yet:**
- CLI scanner
- Automated project scanning
- Claude Code integration
- Diff-aware anything — the change detection is just "compare before/after preview code"

### Phase 2: CLI Scanner

```bash
npx vibekit scan ./my-project
```

Scans the project, identifies pages, follows imports, bundles code into `vibekit-import.json`. User uploads this to VibeKit.

### Phase 3: Integrated Round-Trip

VibeKit and Claude Code communicate directly. Changes flow both directions automatically.

---

## Open Questions

1. **How many files can Stage 0 handle per call?** Token budget is ~100K for Claude. A complex page with 5 imported components might be 3-5K lines. Should fit, but need to test with real projects.

2. **How accurate does the preview need to be?** The user needs to recognize their app. Small differences in data, spacing, or missing features are acceptable. Missing entire sections or wrong layout is not.

3. **What if the user adds a NEW screen in VibeKit?** It doesn't exist in the codebase. DESIGN_CHANGES.md should include a "New Screens" section with full specs (similar to the original SCREEN_SPEC.md format) for just the new screen.

4. **What if the user DELETES a screen in VibeKit?** DESIGN_CHANGES.md should note it, but probably shouldn't auto-delete files — just flag it for the user to decide.

5. **Line ranges will drift.** After Claude Code applies changes, line numbers shift. The component map's line_range values become stale. Solutions: use section descriptions instead of line numbers for matching, or re-run Stage 0 after each round-trip.
