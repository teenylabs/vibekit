---
name: vibekit
description: Design system initialization and enforcement for consistent UI across your app. Use when the user says "vibekit init", "set up my design system", "make my app look like X", "keep my UI consistent", wants to analyze their codebase for design patterns, wants to base their design on a reference site, or asks to update colors/fonts/spacing in their design system. Also activates automatically when building UI components if a design-system.md exists in the project.
---

# VibeKit — Design System for Vibe-Coded Apps

You help developers establish and maintain a consistent design system as they build with AI. You solve the #1 problem with vibe-coded apps: every prompt generates slightly different styling.

## How It Works

VibeKit has three modes:

### 1. `/vibekit init` — Create a design system

The user either:
- **Points to a reference site/screenshot**: "Make my app look like Linear" or "Base it on this screenshot"
- **Points to their existing codebase**: "Analyze what I have and create a system from it"
- **Describes a vibe**: "Dark theme, minimal, green accents, developer-focused"

You analyze the input and generate `design-system.md` in the project root. This file becomes the single source of truth for all visual decisions.

#### When given a URL or screenshot:

1. Study the reference carefully — extract the SPECIFIC values, not generic descriptions
2. Identify: color palette (exact hex values), typography (font families, size scale, weights), spacing rhythm, border radius, shadow strategy, surface/background approach, component patterns
3. Generate `design-system.md` with concrete, enforceable values

#### When analyzing an existing codebase:

1. Scan all component files, CSS/Tailwind configs, and page files
2. Find the MOST COMMON patterns (not every one-off) for: colors, fonts, spacing, border-radius, shadows, component structures
3. Identify inconsistencies and resolve them by picking the dominant pattern
4. Generate `design-system.md` that codifies what's already working

#### When given a vibe description:

1. Make specific, opinionated design choices — don't hedge
2. Pick exact values for everything — specific hex colors, specific fonts, specific pixel values
3. Generate `design-system.md`

### 2. `/vibekit update` — Modify the design system

The user wants to change something:
- "Make the colors warmer"
- "Switch to a dark theme"
- "Use blue accents instead of green"
- "More playful, less corporate"
- "Tighter spacing"

You:
1. Read the current `design-system.md`
2. Understand what they want to change
3. Update ONLY the relevant values — preserve everything else
4. Show them what changed

### 3. Automatic enforcement — Building with the system

When `design-system.md` exists in the project and the user asks to build any UI:

1. Read `design-system.md` FIRST, before writing any code
2. Use the exact values specified — never invent new colors, fonts, or spacing
3. Match existing component patterns — look at what's already built
4. If you need a new component pattern, make it consistent with existing ones
5. After building, offer to save any new patterns back to `design-system.md`

## The design-system.md Format

Generate this file with these exact sections:

```markdown
# Design System

## Overview
[One line: what this app is and the design vibe]
[Reference: what site/style this is based on, if any]

## Colors

### Core Palette
- `--background`: #_____ (page background)
- `--foreground`: #_____ (primary text)
- `--muted`: #_____ (secondary text, labels)
- `--border`: #_____ (borders, dividers)
- `--surface`: #_____ (card/section backgrounds)

### Accent Colors
- `--primary`: #_____ (buttons, links, key actions)
- `--primary-foreground`: #_____ (text on primary)
- `--secondary`: #_____ (secondary actions, hover states)
- `--success`: #_____
- `--warning`: #_____
- `--destructive`: #_____

### Usage Rules
- [Specific rules like "Never use raw Tailwind colors like bg-blue-500"]
- [Specific rules like "Accent color is ONLY for interactive elements and key data"]

## Typography

### Font Stack
- Headings: [specific font family] (weight: ___)
- Body: [specific font family] (weight: ___)
- Mono/Code: [specific font family] (if applicable)

### Scale
- Hero/Display: ___px / ___rem
- H1: ___px / ___rem
- H2: ___px / ___rem
- H3: ___px / ___rem
- Body: ___px / ___rem
- Small: ___px / ___rem
- Tiny/Caption: ___px / ___rem

### Rules
- [e.g., "Headings use -0.02em letter-spacing"]
- [e.g., "Body text line-height is 1.6"]
- [e.g., "NEVER use font sizes outside this scale"]

## Spacing

### Base Unit: ___px
- Tight: ___px (within components, between related items)
- Standard: ___px (between components)
- Loose: ___px (between sections)
- Page padding: ___px
- Card padding: ___px
- Max content width: ___px

## Surfaces & Depth

### Border Radius
- Small (badges, pills): ___px
- Medium (cards, inputs): ___px
- Large (modals, panels): ___px
- Full (avatars, round buttons): 9999px

### Shadows
- Subtle: [exact shadow value]
- Medium: [exact shadow value]
- Elevated: [exact shadow value]

### Borders
- Default: [exact border value, e.g., "1px solid var(--border)"]
- Emphasis: [if different]

## Component Patterns

### Cards
[Exact classes/styles for the standard card in this app]

### Buttons
- Primary: [exact styling]
- Secondary: [exact styling]
- Ghost: [exact styling]

### Inputs
[Exact styling]

### Navigation
[Pattern description — sidebar vs top nav, active states]

### Lists & Tables
[How data is displayed in this app]

### Status Indicators
[Badges, pills, dots — how status is shown]

## Interaction Patterns
- Hover states: [specific approach, e.g., "translateY(-2px) + shadow increase"]
- Transitions: [timing, e.g., "all 200ms ease-out"]
- Focus states: [specific approach]

## Do NOT
- [Specific anti-patterns for this design system]
- [e.g., "Do NOT use star ratings — use dot-scale compatibility indicators"]
- [e.g., "Do NOT add section headers that restate the obvious"]

## Reference Components
[As the app grows, paste actual component code snippets here as examples]
```

## Critical Rules for Enforcement

When building UI with an active design-system.md:

1. **ALWAYS read design-system.md before writing any UI code.** No exceptions.
2. **Use exact values.** If the system says `--primary: #c8922e`, use that. Don't pick a "similar" gold.
3. **Match existing components.** Before creating a new card layout, check if one already exists. Reuse it.
4. **No orphan styles.** Every color, font size, spacing value, and border radius should come from the system. If it's not in the system, ask if it should be added.
5. **Announce your choices.** Before building a component, briefly state which design system values you're applying. This keeps the user aware and lets them course-correct.
6. **Offer to save new patterns.** If you create a new component type that doesn't exist yet (e.g., a comparison table), offer to add its pattern to design-system.md for future consistency.

## When There's No design-system.md Yet

If the user asks you to build UI and there's no design-system.md:

1. Check if there's an existing codebase with UI — if so, suggest running `/vibekit init` first
2. If it's a brand new project, ask: "Want me to set up a design system first? I can base it on a reference site you like, or just pick something that fits your app."
3. Don't just start building with arbitrary styles — that's how inconsistency starts
