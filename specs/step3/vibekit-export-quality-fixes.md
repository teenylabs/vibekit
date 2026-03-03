# VibeKit Export Quality Fixes

## Context

We tested the export flow end-to-end: VibeKit generated a MoneyFlow finance dashboard, we exported it (CLAUDE.md + SCREEN_SPEC.md + skin CSS + screen JSX files), then rebuilt the app from just those specs. The rebuild was ~80% accurate. This document describes the gaps and how to fix them.

There are two categories of fixes:
1. **Stage 3 prompt improvements** — make the spec writer produce more detailed output
2. **Export pipeline changes** — include additional data in the export package

---

## Fix 1: Include Sample Data in SCREEN_SPEC.md

**Problem:** SCREEN_SPEC.md includes TypeScript interfaces for the data model but not the actual sample data. Claude Code has to invent data, which won't match the designed app. The whole point of VibeKit is that the user iterated on the design until it looked right — the data is part of that design.

**Fix in Stage 3 prompt (`prompts/stage3-spec-writer.md`):**

Add this to the SCREEN_SPEC.md rules section:

```
11. **Include sample data.** Extract the actual data arrays from the screen code and include them 
    in the Data Model section. Not just the TypeScript interfaces — the real data values. This is 
    critical because the user designed the app with this specific data visible, and Claude Code 
    should reproduce it faithfully. Format as TypeScript constants:

    ```typescript
    const TRANSACTIONS: Transaction[] = [
      { id: 1, name: "Whole Foods Market", category: "Groceries", amount: -127.43, date: "Mar 2", icon: "🛒" },
      // ... all items
    ];
    ```
    
    Include ALL data arrays found in the screen code — transactions, budgets, accounts, categories, 
    chart data points, navigation items, etc.
```

## Fix 2: Describe Complex Visual Components in Detail

**Problem:** SCREEN_SPEC.md describes the net worth chart as "SVG line chart with data points" which is too vague. Claude Code doesn't know whether to use Recharts, a custom SVG, Chart.js, or something else. It doesn't know the viewBox dimensions, the scaling math, or the visual treatment (opacity, stroke width, point radius).

**Fix in Stage 3 prompt (`prompts/stage3-spec-writer.md`):**

Add this to the SCREEN_SPEC.md rules section:

```
12. **Describe complex visual components with implementation hints.** For any component that 
    goes beyond basic HTML/CSS (charts, SVG graphics, animations, custom visualizations), 
    describe the implementation approach, not just the visual result. Include:
    
    - What technology to use (SVG polyline, Recharts, CSS animation, etc.)
    - Key dimensions and positioning (viewBox, sizing, margins)
    - The data-to-visual mapping (how values map to coordinates, colors, sizes)
    - Visual treatment details (stroke width, opacity, point sizes, fill gradients)
    
    Example (good): "Net worth growth chart: Custom SVG with viewBox='0 0 280 80'. 
    Data points plotted as polyline — x maps linearly across width, y maps value range 
    to 10-70px vertical range. Stroke: primary-fg color, 2px width, 0.9 opacity. 
    Data point circles: 3px radius, primary-fg fill, 0.8 opacity."
    
    Example (bad): "Growth chart showing net worth trend."
```

## Fix 3: Specify Hover States Per Component Type in CLAUDE.md

**Problem:** CLAUDE.md says "hover lift effect" and "hover:-translate-y-1 hover:shadow-lg" but doesn't give the exact inline style values. Since the app uses inline styles (not Tailwind classes), Claude Code needs the actual CSS values.

**Fix in Stage 3 prompt (`prompts/stage3-spec-writer.md`):**

Add this guidance to the CLAUDE.md rules, in the "App-specific sections" for Component Patterns:

```
When describing hover states, always include the exact CSS property values as inline styles, 
not Tailwind classes. The generated code uses inline styles via onMouseEnter/onMouseLeave 
handlers. Example:

- **Cards**: `onMouseEnter: transform: translateY(-3px), boxShadow: 0 8px 24px ${ha("--fg", 0.08)}`
- **Primary buttons**: `onMouseEnter: transform: scale(1.05)` or `opacity: 0.9`
- **List items**: `onMouseEnter: background: ${ha("--muted", 0.15)}`
- **FAB**: `onMouseEnter: transform: scale(1.1)`

Always pair translateY with boxShadow for lift effects. Always include the transition 
property on the base element.
```

## Fix 4: Include Screen JSX as Reference Files in Export

**Problem:** Even with perfect specs, some implementation details (exact SVG paths, complex conditional logic, animation timings) are easier to read from code than from prose descriptions. The screen JSX files are already in the export ZIP but the CLAUDE.md doesn't tell Claude Code to reference them.

**Fix in `lib/ai/export-pipeline.ts`:**

Add a section to the top of CLAUDE.md (either in the Stage 3 prompt template or post-processed in the export pipeline):

```markdown
## Reference Implementation

The `screens/` directory contains the React/JSX code from the VibeKit design preview. 
These are reference implementations — use them to understand the exact visual treatment, 
data structure, and interaction patterns. When building real components, adapt these to 
your project's architecture (routing, state management, API calls) but preserve the 
visual details exactly.
```

This can be added programmatically in `export-pipeline.ts` by prepending it to the CLAUDE.md content after Stage 3 returns:

```typescript
const referenceNote = `## Reference Implementation

The \`screens/\` directory contains the React/JSX code from the VibeKit design preview. These are reference implementations — use them to understand the exact visual treatment, data structure, and interaction patterns. When building real components, adapt these to your project's architecture (routing, state management, API calls) but preserve the visual details exactly.

`;

const claudeMdWithRef = claudeMd.replace(
  "## Design System",
  referenceNote + "## Design System"
);
```

## Fix 5: Simplify ExportModal to Single Button

**Problem:** The export modal shows three options (AI Export, Screen Spec template, CLAUDE.md template). Users don't need to see the internals. There should be one button.

**Fix in `components/companion/ExportModal.tsx`:**

Remove the template-based download options. The modal should show:
- Title: "Export Your Design"
- Subtitle: "Download spec files for Claude Code"
- One button: "Export" → shows loading spinner → downloads ZIP
- Error state if Stage 3 fails

No secondary options, no "Or download individual files" section.

---

## Summary of Changes

| File | Change |
|------|--------|
| `prompts/stage3-spec-writer.md` | Add rules 11 (sample data) and 12 (complex component details) to SCREEN_SPEC section. Add hover state specificity guidance to CLAUDE.md section. |
| `lib/ai/export-pipeline.ts` | Prepend "Reference Implementation" note to CLAUDE.md output. |
| `components/companion/ExportModal.tsx` | Remove template-based download options, single "Export" button. |

All three changes are independent and can be implemented in any order.
