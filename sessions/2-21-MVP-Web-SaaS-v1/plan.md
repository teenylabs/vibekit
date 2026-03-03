# VibeKit MVP Build Plan

**Session started:** 2025-02-21
**Spec:** `specs/vibekit-mvp-spec.md`
**Project dir:** `/Users/shaliniagarwal/dev/fun_apps/VibeKit`
**Status:** Steps 1.1–1.4 complete (all 20 UI components + 4 layout components built + tested). Next up: Step 1.5 (Example Pages).

---

## What's Been Built So Far

### Step 1.1: Project Setup — COMPLETE
- [x] Next.js 15 project (TypeScript, Tailwind CSS v3, App Router, ESLint, no src/ dir)
- [x] Deps installed: class-variance-authority, clsx, tailwind-merge, lucide-react, jszip, tailwindcss-animate
- [x] `lib/utils.ts` — `cn()` function (clsx + tailwind-merge)
- [x] `tailwind.config.ts` — all CSS variable color refs + `--radius` borderRadius + `--sidebar-width` + custom font sizes (text-h1 through text-tiny) + `tailwindcss-animate` plugin
- [x] `app/globals.css` — imports skin CSS + Tailwind layers + base styles
- [x] Build verified: `npm run build` passes

### Step 1.2: Three Skins — COMPLETE
- [x] `styles/skins/modern-saas.css` — Indigo primary (221 83% 53%), white bg, 0.5rem radius, :root + .dark
- [x] `styles/skins/warm-friendly.css` — Amber primary (38 92% 50%), warm-tinted bg, 0.75rem radius, :root + .dark
- [x] `styles/skins/dark-technical.css` — Emerald primary (142 76% 36%), dark bg default (222 47% 7%), 0.25rem radius, :root + .dark
- [x] All 25 CSS variables defined in each skin (fully self-contained)
- [x] `globals.css` imports modern-saas by default; swap verified with all three skins

### Step 1.3: Build UI Components (components/ui/) — COMPLETE (20/20)

**Batch 1 — Core:**
- [x] button.tsx — 6 variants (default, secondary, outline, ghost, destructive, link), 4 sizes (default, sm, lg, icon), cva-based
- [x] card.tsx — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- [x] input.tsx — with optional `icon` prop (accepts LucideIcon, renders inside input on the left)
- [x] label.tsx — themed label with peer-disabled styling
- [x] badge.tsx — 6 variants (default, secondary, destructive, success, warning, outline), cva-based, pill-shaped
- [x] separator.tsx — horizontal/vertical orientation, proper ARIA roles
- [x] skeleton.tsx — pulse animation on muted bg
- [x] avatar.tsx — Avatar wrapper, AvatarImage (with onError fallback), AvatarFallback (initials)

**Batch 2 — Interactive:**
- [x] switch.tsx — toggle with themed track/thumb, `checked` + `onCheckedChange` API
- [x] tabs.tsx — Tabs, TabsList, TabsTrigger, TabsContent; underline-style triggers; React context for state
- [x] table.tsx — Table, TableHeader, TableBody, TableRow, TableHead, TableCell; hover state on rows
- [x] textarea.tsx — multi-line input, same border/focus styling as Input
- [x] checkbox.tsx — themed with Check icon from lucide-react, `checked` + `onCheckedChange` API

**Batch 3 — Complex/Overlay:**
- [x] select.tsx — custom dropdown (not native HTML): Select, SelectTrigger, SelectContent, SelectItem, SelectValue; click-outside + Escape to close
- [x] dialog.tsx — Dialog, DialogTrigger (asChild), DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose (asChild); centered modal, overlay backdrop, Escape to close, body scroll lock
- [x] sheet.tsx — Sheet, SheetTrigger (asChild), SheetContent (side variants: right/left/top/bottom), SheetHeader, SheetTitle, SheetDescription, SheetClose (asChild); 60% width desktop, full width mobile
- [x] dropdown-menu.tsx — DropdownMenu, DropdownMenuTrigger (asChild), DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator; click-outside + Escape to close
- [x] toast.tsx — Toast, ToastProvider, useToast hook; bottom-right, auto-dismiss 5s; variants: default, success, destructive
- [x] alert.tsx — Alert, AlertTitle, AlertDescription; variants: default, destructive; supports icon via CSS child selectors
- [x] empty-state.tsx — icon + title + description + optional action Button; dashed border, centered layout

**Test & Verification:**
- [x] `app/test/page.tsx` — visual test page at /test for Batch 1 components (static)
- [x] `app/test/interactive/page.tsx` — interactive test page at /test/interactive for ALL components including dialog, sheet, toast, tabs, select, dropdown, switch, checkbox, table, alert, empty-state
- [x] `tailwindcss-animate` plugin installed and configured
- [x] Visually tested with modern-saas and warm-friendly skins
- [x] Build verified: `npm run build` passes with all 20 components + both test pages

---

## What's Next

### Step 1.4: Build Layout Components (components/layout/) — COMPLETE
- [x] Sidebar.tsx — fixed left panel, logo area, nav items w/ lucide icons + active state (bg-accent text-accent-foreground), mobile overlay with backdrop, uses w-sidebar CSS variable, X close button on mobile
- [x] AppLayout.tsx — Sidebar + MobileNav composition, mobile hamburger header, content area with md:pl-sidebar + max-w-6xl + mx-auto, pb-20 on mobile for bottom nav clearance
- [x] PageHeader.tsx — title (text-h2), optional description, optional action buttons (right-aligned), optional backButton (ghost icon button with ArrowLeft), Separator below
- [x] MobileNav.tsx — fixed bottom bar (h-16, z-50), tab icons + labels, active tab highlighted with text-primary, hidden on md+
- [x] Added `padding: { sidebar: "var(--sidebar-width)" }` to tailwind.config.ts for pl-sidebar utility
- [x] Test page at `/test/layout` — AppLayout with 4 nav items, PageHeader with action button, metric cards grid
- [x] Build verified: `npm run build` passes (7 routes)

### Step 1.5: Build Example Pages (examples/)
- [ ] dashboard.tsx — 4 metric cards + data table + badges + search
- [ ] settings.tsx — tabs, profile form, notification switches, billing card
- [ ] list-page.tsx — search + filter dropdown + card grid + pagination
- [ ] detail-page.tsx — PageHeader w/ back button + split layout
- [ ] form-page.tsx — multi-section form w/ validation states
- [ ] empty-states.tsx — empty, loading (skeleton), error patterns

### Step 1.6: Build the Linter
- [ ] `scripts/design-check.ts` — flags raw Tailwind colors, missing AppLayout, Badge without variant, raw font sizes, inline styles
- [ ] Add `"design-check"` script to package.json

### Step 1.7: Create Component Index
- [ ] `components/index.ts` — master inventory with docs

---

## Phase 2: Design Companion (future sessions)

### Step 2.1–2.8
See `specs/vibekit-mvp-spec.md` Part 5, Phase 2 for full details.
- Landing page, two-panel layout, chat panel, AI integration, wireframe panel, component renderers, skin switching, export

---

## Lessons Learned

### Project Setup
- `create-next-app` won't work in a directory with capital letters (npm naming restriction). Workaround: `npm init -y` + install deps manually.
- `create-next-app` latest (Feb 2025) installs Next.js 16 + Tailwind v4. Tailwind v4 has no `tailwind.config.ts` (CSS-based config only). Pinned to `next@15` + `tailwindcss@3` for config file compatibility.
- Tailwind v3 needs `postcss` + `autoprefixer`. Do NOT install `@tailwindcss/postcss` (that's v4-only).

### Skins
- Each skin CSS file defines variables at `:root` and `.dark` scope. The dark-technical skin is "dark by default" — its `:root` IS the dark theme.
- Skin swap = change one `@import` line in `globals.css`. For the companion app (Phase 2), skins will use `data-skin` attribute scoping instead.

### UI Components
- All components follow shadcn/ui patterns: `forwardRef`, `cn()` for className merging, `cva` for variants.
- Input's `icon` prop accepts a `LucideIcon` type (imported from `lucide-react`). The icon renders absolutely positioned inside the input with `pl-10` padding.
- AvatarImage uses `onError` + React state to hide broken images and fall through to AvatarFallback. This requires `"use client"` on avatar.tsx.
- Badge uses `forwardRef` (unlike stock shadcn which uses a plain function) — consistent with our pattern across all components.
- Test pages at `/test` (static) and `/test/interactive` (client) for visual verification. Swap the `@import` in `globals.css` to test different skins.
- `"use client"` is needed on: switch, tabs, checkbox, select, dialog, sheet, dropdown-menu, toast, avatar. All other components are server-compatible.
- Interactive components (dialog, sheet, select, dropdown-menu) all use React Context for open/close state and support both controlled (`open` prop) and uncontrolled (internal state) modes.
- Dialog and Sheet both lock body scroll when open and clean up on unmount.
- Select and DropdownMenu use click-outside detection via `mousedown` event listener on `document`. The listener checks if the click target is inside the `.relative` wrapper.
- Toast uses `useToast()` hook pattern. `ToastProvider` must wrap the app (in layout.tsx) for toasts to work. Auto-dismiss via `setTimeout`.
- `tailwindcss-animate` plugin was added for animation classes (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-bottom-full`, `slide-in-from-right`, etc.). This is a dependency for dialog, sheet, select, dropdown-menu, and toast components.

### asChild Pattern (CRITICAL)
- DialogTrigger, DialogClose, SheetTrigger, SheetClose, and DropdownMenuTrigger all render a `<button>` by default. If you put a `<Button>` component inside them, you get nested `<button>` elements — invalid HTML that causes React hydration errors.
- **Always use `asChild` prop** when wrapping a `<Button>` inside a trigger or close: `<DialogTrigger asChild><Button>Open</Button></DialogTrigger>`
- The `asChild` implementation uses `React.cloneElement` to merge the onClick handler onto the child instead of wrapping in a `<button>`.
- This matches the Radix/shadcn `asChild` convention so it feels familiar.

### Layout Components
- Sidebar uses `isOpen` / `onClose` controlled pattern — AppLayout owns the toggle state via `useState`.
- `pl-sidebar` needed a custom `padding` entry in tailwind.config.ts (`padding: { sidebar: "var(--sidebar-width)" }`). The `width: { sidebar }` config only covers `w-sidebar`.
- MobileNav is server-compatible (no "use client") — it just renders `<a>` tags with conditional classes. Sidebar also needs "use client" for the overlay close button's onClick, but we put the directive on Sidebar.tsx directly. AppLayout needs "use client" for useState.
- PageHeader is server-compatible — no state, no effects. Uses Button and Separator from ui/.
- Mobile layout: AppLayout adds `pb-20` to content on mobile so the fixed MobileNav (h-16) doesn't overlap content. On md+ it uses `pb-6` since MobileNav is hidden.
- NavItem type is exported from Sidebar.tsx and re-used by MobileNav (imported from `./Sidebar`).

### Build Cache
- If you hit `__webpack_modules__[moduleId] is not a function` runtime error, delete `.next/` directory and restart dev server. This is a stale webpack cache issue, not a code bug.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `specs/vibekit-mvp-spec.md` | Full product spec (read this FIRST) |
| `sessions/2-21-MVP-Web-SaaS-v1/plan.md` | This file — build progress + checklist |
| `tailwind.config.ts` | Tailwind theme: CSS var colors + borderRadius + custom font sizes + tailwindcss-animate plugin |
| `app/globals.css` | Imports skin + Tailwind base/components/utilities layers |
| `lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |
| `styles/skins/modern-saas.css` | Default skin — indigo, clean, 0.5rem radius |
| `styles/skins/warm-friendly.css` | Amber/orange, rounded, 0.75rem radius |
| `styles/skins/dark-technical.css` | Emerald/green, dark bg, 0.25rem radius |
| `components/ui/*.tsx` | All 20 UI primitives (complete) |
| `app/test/page.tsx` | Static test page for Batch 1 components — visit /test |
| `app/test/interactive/page.tsx` | Interactive test page for ALL components — visit /test/interactive |
| `app/test/layout/page.tsx` | Layout components test page — visit /test/layout |
| `components/layout/*.tsx` | 4 layout components: Sidebar, AppLayout, PageHeader, MobileNav |
| `postcss.config.mjs` | PostCSS config for Tailwind v3 |
| `next.config.mjs` | Next.js config (minimal) |
| `tsconfig.json` | TypeScript config with `@/*` path alias |
| `package.json` | Next 15, Tailwind 3, tailwindcss-animate, all deps listed |

---

## Instructions for Next Session

Copy-paste this to start a new session:

```
Read these files FIRST before doing anything:
1. specs/vibekit-mvp-spec.md — the full product spec
2. sessions/2-21-MVP-Web-SaaS-v1/plan.md — what's been built + what's next

Steps 1.1 (project setup), 1.2 (skins), and 1.3 (all 20 UI components) are DONE and tested.
Pick up at Step 1.4: Build Layout Components.

IMPORTANT patterns established in the UI components (read any component in components/ui/ for reference):
- forwardRef on all components
- cva for variants, cn() for class merging
- Only CSS variable colors (bg-primary, text-muted-foreground, etc.), never hardcoded Tailwind colors
- "use client" only when component uses React state/effects
- Trigger components (DialogTrigger, SheetTrigger, DropdownMenuTrigger) support `asChild` prop — ALWAYS use it when wrapping a <Button> to avoid nested <button> hydration errors
- ToastProvider must wrap the app for useToast() to work

STEP 1.4: Build Layout Components

Build 4 layout components in components/layout/. These wrap pages and provide consistent structure.

1. Sidebar.tsx — Left navigation panel
   - Logo area at top
   - Nav items with icons (lucide-react) and active state
   - Collapsible on mobile
   - Uses --sidebar-width CSS variable for width (defined in tailwind.config.ts as w-sidebar)

2. AppLayout.tsx — Wraps every page
   - Sidebar on left
   - Content area on right with max-w-6xl
   - Responsive: sidebar collapses to hamburger on mobile

3. PageHeader.tsx — Top of every page
   - Title (required)
   - Description (optional)
   - Action buttons (optional, right-aligned)
   - Separator below

4. MobileNav.tsx — Bottom navigation for mobile
   - Shows on screens < 768px
   - Hides sidebar, shows bottom tab bar instead

After building:
1. Run npm run build to verify
2. Create a test page or update existing ones to show layout components in action
3. Update sessions/2-21-MVP-Web-SaaS-v1/plan.md checking off completed items
4. If you get webpack cache errors, delete .next/ and restart
```
