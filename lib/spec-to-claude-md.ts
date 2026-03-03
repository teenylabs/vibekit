import type { ScreenSpec } from "./spec-types";

const BASE_DESIGN_SYSTEM = `# VibeKit Design System

## Components
- ALWAYS import UI components from \`@/components/ui/\` — never create custom styled elements
- ALWAYS use layout components from \`@/components/layout/\` for page structure
- Every page MUST use the AppLayout wrapper
- See \`@/examples/\` for complete page patterns — follow their structure
- See \`@/components/index.ts\` for the full component inventory

## Colors
- ALWAYS use theme colors — NEVER use raw Tailwind colors like bg-blue-500, text-red-600
- Theme colors: primary, secondary, muted, accent, destructive, success, warning
- If you need a color not in the theme, ask the user

## Badge Mappings
- Priority: high → destructive, medium → warning, low → secondary
- Status: done → success, active → default, pending → outline, failed → destructive

## Typography
- Use text-h1, text-h2, text-h3, text-body, text-small, text-tiny
- Never use arbitrary font sizes

## Spacing
- Standard spacing: p-4, p-6, gap-4, gap-6, space-y-4, space-y-6
- Cards: p-6 padding
- Page content: max-w-6xl from AppLayout

## Interaction Patterns
- List → Detail: use push navigation (new page) for primary content
- Quick actions: use Sheet (slide-over panel) for secondary actions
- Confirmations: use Dialog (modal) for destructive actions only
- Notifications: use Toast for transient feedback
- Forms: use inline validation, not alert boxes

## When in doubt
- Look at existing pages and examples/ — match their patterns exactly
- Compose from existing components — don't create new base components`;

export function specToClaudeMd(spec: ScreenSpec): string {
  const screenCount = spec.screens.filter((s) => s.type === "page" || !s.type).length;

  return `${BASE_DESIGN_SYSTEM}

## App Design Reference

This project was designed with VibeKit. See \`SCREEN_SPEC.md\` for the full screen-by-screen specification including:
- All screens and their layouts
- Component usage per screen
- Navigation flows and interaction patterns
- Field names, labels, and placeholder content

The app uses **${spec.navigation.type}** navigation with ${screenCount} main screens.
Skin: ${spec.skin}
`;
}
