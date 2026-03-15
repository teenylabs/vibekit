# VibeKit

**A Claude Code skill that gives your vibe-coded app a consistent design system.**

The #1 problem with AI-generated UIs: every prompt produces slightly different styling. VibeKit fixes that by creating a `design-system.md` that Claude Code reads before writing any UI code — so your colors, fonts, spacing, and components stay consistent across every session.

## Install
```
/plugin marketplace add teenylabs/vibekit
```

Or manually copy `skills/vibekit/SKILL.md` into your project's `.claude/skills/` folder.

## Usage

### Start fresh or analyze your existing app
```
/vibekit init
```
VibeKit will analyze your codebase (or a reference site/screenshot you point it to) and generate a `design-system.md` file.

### Update your design system
```
/vibekit update — make the colors warmer
/vibekit update — switch to dark mode
/vibekit update — use blue accents instead of green
```

### Automatic enforcement
Once `design-system.md` exists, VibeKit activates automatically whenever you ask Claude Code to build UI — no command needed. It reads your design system first and stays consistent.

## What it generates

A `design-system.md` in your project root with exact values for:
- Color palette (hex values, usage rules)
- Typography (font families, size scale, weights)
- Spacing system
- Border radius, shadows, surfaces
- Component patterns (cards, buttons, inputs, nav)
- Interaction patterns
- Anti-patterns to avoid

## Made by

[TeenyLabs](https://teenylabs.com) — AI-native tools for builders.
