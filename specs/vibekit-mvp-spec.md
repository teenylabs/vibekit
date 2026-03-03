# VibeKit MVP: Complete Specification

## Document Purpose

This is the complete spec for building VibeKit MVP. It contains everything needed — product decisions, technical architecture, and step-by-step build instructions for Claude Code.

---

## Part 1: What We're Building

### Product Summary

VibeKit is two things:

1. **An installable design system** that drops themed components, a linter, and AI coding rules into any existing Next.js project. This solves visual consistency.

2. **A design companion** — a two-panel web app where users describe their app in conversation on the left, and a live wireframe builds on the right using real VibeKit components. Users can click through screens, refine by talking, and export both the design system files and a structured screen spec that feeds into Claude Code / Cursor rules. This solves interaction design.

### What We Are NOT Building (MVP Scope)

- No drag-and-drop editor
- No codebase scanning / sync (the companion does NOT read your existing project)
- No Figma integration
- No VS Code / Cursor extension
- No CLI tool (installation is manual copy for MVP)
- No payment / monetization
- No user accounts or auth
- No interaction pattern database / AI training on top apps

### Target User

Solo developers and indie hackers building web apps with AI coding tools (Claude Code, Cursor). They can describe what they want but can't design it visually. They've used Lovable/v0/Bolt for a first shot but struggle when iterating.

---

## Part 2: The Installable Design System

### What Gets Installed

When a user adds VibeKit to their project, they get these files dropped into their existing Next.js project:

```
(user's existing project)/
├── vibekit.config.ts              ← Skin selection + customization
├── CLAUDE.md (or .cursorrules)    ← AI coding rules (~30 lines)
├── scripts/
│   └── design-check.ts           ← Linter that catches design drift
├── components/
│   ├── ui/                        ← UI primitives (all themed)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── switch.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── toast.tsx
│   │   ├── sheet.tsx
│   │   └── alert.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx          ← Sidebar + content wrapper
│   │   ├── Sidebar.tsx            ← Left nav with active state
│   │   ├── PageHeader.tsx         ← Title + description + actions
│   │   └── MobileNav.tsx          ← Responsive bottom nav
│   └── index.ts                   ← Master component inventory
├── examples/
│   ├── dashboard.tsx              ← Metric cards + data table
│   ├── settings.tsx               ← Tabs + forms + toggles
│   ├── list-page.tsx              ← Filterable list with search
│   ├── detail-page.tsx            ← Detail view with sidebar info
│   ├── form-page.tsx              ← Multi-section form
│   └── empty-states.tsx           ← All empty/loading/error patterns
├── styles/
│   └── skins/
│       ├── modern-saas.css        ← Clean, indigo, professional
│       ├── warm-friendly.css      ← Amber/orange, rounder, playful
│       └── dark-technical.css     ← Dark mode, monospace, terminal
└── lib/
    └── utils.ts                   ← cn() helper
```

### Skins (CSS Variable Files)

Each skin is a CSS file that defines all theme variables. The user picks one during setup, and it gets copied to `app/globals.css` (or merged into their existing one).

**Variables each skin defines:**

```css
:root {
  /* Core colors (HSL values) */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --success-foreground: 210 40% 98%;
  --warning: 38 92% 50%;
  --warning-foreground: 222 47% 11%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 221 83% 53%;
  --radius: 0.5rem;
  --sidebar-width: 16rem;
}

.dark {
  /* Dark mode overrides */
}
```

**Skin: Modern SaaS** — Indigo primary, clean borders, 0.5rem radius, Inter font. Professional and neutral.

**Skin: Warm & Friendly** — Amber/orange primary, 0.75rem radius, softer borders, warmer grays. Rounded and approachable.

**Skin: Dark & Technical** — Emerald/green primary on dark background, 0.25rem radius, monospace font option, sharp edges. Developer-focused.

### CLAUDE.md Content

This file goes into the project root. Exact content:

```markdown
# VibeKit Design System

## Components
- ALWAYS import UI components from `@/components/ui/` — never create custom styled elements
- ALWAYS use layout components from `@/components/layout/` for page structure
- Every page MUST use the AppLayout wrapper
- See `@/examples/` for complete page patterns — follow their structure
- See `@/components/index.ts` for the full component inventory

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
- Compose from existing components — don't create new base components
```

### Linter (design-check.ts)

Checks for:
1. Raw Tailwind colors (bg-red-500, text-blue-600, etc.) — should use theme tokens
2. Missing AppLayout wrapper on pages in app/
3. Badge components without variant prop
4. Raw font sizes (text-sm, text-lg, text-[14px]) outside component definitions
5. Inline styles (style={{...}})
6. Custom div elements with complex className that should be components
7. Dialog/Sheet/Toast usage that doesn't match the interaction pattern rules

Exclusions: components/ui/ and components/layout/ are excluded (they ARE the design system).

Run: `npm run design-check`

---

## Part 3: The Design Companion

### Overview

A web application with two panels:
- **Left panel**: Chat interface where the user describes their app
- **Right panel**: Live wireframe preview that updates as the conversation progresses

The AI (Claude API) listens to the conversation, generates a structured screen spec (JSON), and the right panel renders it using actual VibeKit components.

### User Flow

**Step 1: Pick a skin (and change it anytime)**
User lands on the companion. Top of the page shows a skin selector — 3 options with thumbnail previews. They click one. The wireframe panel uses that skin's CSS variables for all rendering. IMPORTANT: The skin selector remains accessible throughout the entire design session. Users can and should switch skins mid-conversation to see how their app looks in different styles. This is part of the design exploration, not a separate step. When the skin changes:
- The wireframe re-themes immediately using the new skin's CSS variables
- The next AI call includes the new skin name in the system prompt so suggestions stay contextually relevant
- The conversation history is preserved — only the visual rendering changes
- On export, whatever skin is currently selected gets bundled

**Step 2: Describe the app**
User types (or speaks) in the chat: "I'm building a task management app. There's a list of tasks, you can click into one to see details, and there's a settings page."

**Step 3: AI generates wireframes**
The AI responds conversationally ("Great, here's what I'm thinking for your task manager...") AND generates a JSON screen spec behind the scenes. The right panel renders wireframe screens from this JSON.

**Step 4: Navigate the wireframe**
The right panel shows one screen at a time. There's a screen navigator (tabs or breadcrumbs) at the top showing all screens. Clickable elements in the wireframe navigate to other screens (e.g., clicking a task row navigates to the task detail screen).

**Step 5: Refine**
User says "The task detail should be a slide-over panel from the right, not a full page." AI updates the JSON. The wireframe re-renders showing a Sheet component instead of a full page.

User says "Add a search bar above the task list." AI updates. Wireframe shows the search input.

User says "I want a notifications dropdown in the header." AI updates.

**Step 6: Export**
When the user is satisfied, they click "Export." They get:
- A `SCREEN_SPEC.md` file — the structured screen spec in readable markdown
- The VibeKit design system files (components, skin, linter, CLAUDE.md) — ready to drop into their project
- A combined `CLAUDE.md` that includes both the design system rules AND the screen-specific instructions from the spec

### Screen Spec JSON Format

This is the internal format the AI generates. The user never sees or writes this.

```json
{
  "appName": "Todone",
  "skin": "modern-saas",
  "screens": [
    {
      "id": "dashboard",
      "name": "Dashboard",
      "path": "/",
      "layout": "sidebar",
      "description": "Main task list with search and filters",
      "sections": [
        {
          "id": "header",
          "component": "PageHeader",
          "props": {
            "title": "Tasks",
            "description": "Manage your task list",
            "actions": [
              { "label": "Add Task", "variant": "default", "icon": "plus", "navigateTo": "add-task-modal" }
            ]
          }
        },
        {
          "id": "search",
          "component": "Input",
          "props": {
            "placeholder": "Search tasks...",
            "icon": "search"
          }
        },
        {
          "id": "task-list",
          "component": "Table",
          "props": {
            "columns": ["Task", "Status", "Priority", "Due Date"],
            "sampleRows": 5,
            "rowAction": {
              "type": "navigate",
              "target": "task-detail",
              "interaction": "push"
            }
          }
        }
      ],
      "emptyState": {
        "icon": "inbox",
        "title": "No tasks yet",
        "description": "Add your first task to get started",
        "action": { "label": "Add Task", "navigateTo": "add-task-modal" }
      }
    },
    {
      "id": "task-detail",
      "name": "Task Detail",
      "path": "/tasks/:id",
      "layout": "sidebar",
      "description": "Task details with AI chat",
      "openedVia": {
        "type": "push",
        "from": "dashboard"
      },
      "sections": [
        {
          "id": "header",
          "component": "PageHeader",
          "props": {
            "title": "{{task.title}}",
            "backButton": { "navigateTo": "dashboard" },
            "actions": [
              { "label": "Delete", "variant": "destructive", "interaction": "confirm-dialog" }
            ]
          }
        },
        {
          "id": "content",
          "component": "SplitLayout",
          "props": {
            "left": {
              "title": "Chat",
              "component": "ChatInterface",
              "description": "AI research conversation about this task"
            },
            "right": {
              "title": "Details",
              "component": "DetailSidebar",
              "fields": ["Status", "Priority", "Due Date", "Tags"]
            }
          }
        }
      ]
    },
    {
      "id": "add-task-modal",
      "name": "Add Task",
      "type": "dialog",
      "openedVia": {
        "type": "dialog",
        "from": "dashboard"
      },
      "sections": [
        {
          "id": "form",
          "component": "Form",
          "props": {
            "fields": [
              { "name": "title", "type": "input", "label": "Task Title", "required": true },
              { "name": "description", "type": "textarea", "label": "Description" },
              { "name": "priority", "type": "select", "label": "Priority", "options": ["High", "Medium", "Low"] }
            ],
            "submitLabel": "Create Task",
            "onSubmit": { "navigateTo": "dashboard", "interaction": "close-dialog" }
          }
        }
      ]
    },
    {
      "id": "settings",
      "name": "Settings",
      "path": "/settings",
      "layout": "sidebar",
      "description": "User settings with tabs",
      "sections": [
        {
          "id": "header",
          "component": "PageHeader",
          "props": {
            "title": "Settings",
            "description": "Manage your account"
          }
        },
        {
          "id": "tabs",
          "component": "Tabs",
          "props": {
            "tabs": [
              {
                "label": "Profile",
                "content": {
                  "component": "Form",
                  "fields": [
                    { "name": "name", "type": "input", "label": "Name" },
                    { "name": "email", "type": "input", "label": "Email" }
                  ]
                }
              },
              {
                "label": "Notifications",
                "content": {
                  "component": "SwitchGroup",
                  "switches": [
                    { "label": "Email notifications", "description": "Get notified about task updates" },
                    { "label": "Push notifications", "description": "Browser push notifications" }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  ],
  "navigation": {
    "type": "sidebar",
    "items": [
      { "label": "Dashboard", "icon": "layout-dashboard", "screen": "dashboard" },
      { "label": "Settings", "icon": "settings", "screen": "settings" }
    ]
  },
  "interactions": {
    "transitions": {
      "push": "New page with back navigation",
      "dialog": "Centered modal overlay, click outside to close",
      "sheet": "Slide-in panel from right, 60% width on desktop",
      "toast": "Transient notification, bottom-right, auto-dismiss 5s"
    }
  }
}
```

### Design Companion UI Specification

**Overall Layout:**
- Full viewport height, split into two panels
- Left panel: 40% width, chat interface
- Right panel: 60% width, wireframe preview
- Resizable divider between panels
- Top bar with: VibeKit logo, skin selector dropdown, "Export" button

**Skin Selector (top bar):**
- Dropdown with 3 options: Modern SaaS, Warm & Friendly, Dark & Technical
- Small color swatch preview next to each name
- Selecting a skin immediately re-themes the entire right panel
- Default: Modern SaaS

**Left Panel — Chat:**
- Standard chat interface: messages scroll up, input at bottom
- User messages right-aligned, AI messages left-aligned
- AI messages can include text explanations AND trigger wireframe updates
- Input supports text (and later voice)
- "Thinking" indicator while AI processes
- System message at top: "Describe the app you want to build. I'll create a visual prototype you can click through."

**Right Panel — Wireframe Preview:**
- Top row: screen navigator tabs on the left, device preview toggle on the right
- Device preview toggle: 3 icons — desktop (monitor), tablet, phone. Clicking one resizes the wireframe container:
  - Desktop: full width of the panel
  - Tablet: max-width 768px, centered in panel with gray background around it
  - Phone: max-width 375px, centered in panel with gray background around it, subtle phone frame outline
- The components are already responsive, so switching to phone width will naturally trigger mobile layouts: sidebar hides, MobileNav appears, grids collapse to single column, etc. No extra rendering logic needed — just a width constraint on the container.
- This lets users see their design on both desktop and mobile and catch layout issues before building.
- Active screen tab highlighted
- Below tabs: the wireframe for the active screen, rendered using actual VibeKit components
- Wireframe components are simplified/placeholder versions:
  - Tables show header + 3-5 rows of placeholder data
  - Forms show labeled inputs with placeholder text
  - Charts show placeholder chart shapes
  - Images show gray placeholder boxes
  - Text shows realistic-length placeholder text
- Clickable elements (buttons, table rows, nav items) that have `navigateTo` or `interaction` defined are highlighted with a subtle blue outline on hover
- Clicking a navigable element switches to that screen in the preview
- Modals/dialogs render as overlays on top of the current screen
- Sheets render as slide-in panels from the right
- When no screens exist yet: show a friendly empty state "Describe your app in the chat to get started"

**Export Flow:**
- User clicks "Export" button
- Modal with two download options:
  1. "Download Screen Spec" — SCREEN_SPEC.md file
  2. "Download Design System" — ZIP of all VibeKit component files
  3. "Download CLAUDE.md" — combined rules file with design system + screen-specific instructions
- Each is a file download, no server needed

### AI System Prompt for Design Companion

The Claude API call in the companion uses this system prompt:

```
You are VibeKit's design assistant. You help users design their app's screens and interaction patterns through conversation.

Your job:
1. Listen to the user describe their app
2. Ask smart follow-up questions about navigation, screen layouts, and interactions
3. Generate and update a screen spec JSON that describes the app's screens and components
4. Explain your design decisions conversationally

Rules:
- Always respond with BOTH a conversational message AND an updated screen spec JSON
- Wrap the JSON in <screen_spec>...</screen_spec> tags so the UI can parse it
- Use only VibeKit components: Button, Card, Input, Label, Badge, Avatar, Table, Tabs, Switch, Separator, Skeleton, EmptyState, Dialog, DropdownMenu, Select, Textarea, Checkbox, Toast, Sheet, Alert
- Use only VibeKit layout components: AppLayout, Sidebar, PageHeader, MobileNav
- Use only these interaction types: push (new page), dialog (modal), sheet (slide-over), toast (notification)
- When the user is vague, suggest a specific pattern and ask if it's right
- When the user describes a screen, generate ALL sections including empty states
- Map common concepts to standard patterns:
  - "list of items" → Table or Card grid
  - "details page" → PageHeader + content sections
  - "settings" → Tabs with form sections
  - "add/create" → Dialog with form
  - "edit" → Sheet with form or inline editing
  - "delete/remove" → Dialog confirmation
  - "search" → Input with search icon above content
  - "filters" → DropdownMenu or Select components
  - "notifications" → Toast for transient, Alert for persistent
- Always define the navigation structure (sidebar items, which screens are in nav)
- For each screen, define how it's opened (push, dialog, sheet) and from where
- Include sample data that makes the wireframe feel realistic (not "Lorem ipsum" — use realistic names, dates, statuses)

When the user says something like:
- "I'm building a [type] app" → Generate 3-4 initial screens based on common patterns for that app type, ask if the structure looks right
- "Add a [feature]" → Add the screen/component to the spec, explain where you put it
- "Change [thing] to [other thing]" → Update the spec, explain what changed
- "I don't like [thing]" → Suggest 2 alternatives, let them pick
- "Make it simpler/more complex" → Adjust the number of sections/fields
- "That's good, what else do I need?" → Suggest missing screens (error states, onboarding, empty states, loading)

Available skin: {{selected_skin}}
```

### Screen Spec to CLAUDE.md Export

When the user exports, the screen spec gets converted to a readable CLAUDE.md section:

```markdown
## App Structure (from VibeKit Design Companion)

### Screens
1. **Dashboard** (/) — Main task list with search and filters
   - PageHeader: "Tasks" with "Add Task" button
   - Search input
   - Table: Task, Status, Priority, Due Date columns
   - Empty state: "No tasks yet" with Add Task CTA

2. **Task Detail** (/tasks/:id) — Opens via push from Dashboard
   - PageHeader: task title with back button and Delete action
   - Split layout: Chat on left, Details sidebar on right

3. **Add Task** — Opens as Dialog from Dashboard
   - Form: Title (required), Description, Priority select
   - Submit creates task and closes dialog

4. **Settings** (/settings) — Sidebar nav item
   - Tabs: Profile (form), Notifications (switches)

### Navigation
- Sidebar: Dashboard, Settings
- Task Detail: push from Dashboard, back button returns

### Interaction Rules
- New content: push navigation (new page)
- Quick create/edit: Dialog (modal)
- Secondary panels: Sheet (slide-over from right)
- Feedback: Toast (bottom-right, 5s auto-dismiss)
- Destructive actions: always confirm with Dialog first
```

---

## Part 4: Technical Architecture

### Design Companion Tech Stack

```
Framework:        Next.js 15 (App Router)
UI Components:    VibeKit's own components (dogfooding)
AI:               Claude API (claude-sonnet-4-20250514)
State:            React useState/useReducer (no external state management)
Styling:          Tailwind CSS with VibeKit skin system
Deployment:       Vercel (free tier)
Auth:             None for MVP
Database:         None for MVP (everything is client-side)
```

### File Structure for Design Companion App

```
vibekit-companion/
├── CLAUDE.md
├── package.json
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    ← Landing page with skin picker
│   └── design/
│       └── page.tsx                ← The two-panel design companion
├── components/
│   ├── ui/                         ← VibeKit components (used both in UI and wireframe)
│   │   └── (all VibeKit components)
│   ├── layout/
│   │   └── (VibeKit layout components)
│   ├── companion/
│   │   ├── ChatPanel.tsx           ← Left panel chat interface
│   │   ├── ChatMessage.tsx         ← Individual message bubble
│   │   ├── ChatInput.tsx           ← Text input with send button
│   │   ├── WireframePanel.tsx      ← Right panel wireframe renderer
│   │   ├── ScreenNavigator.tsx     ← Tab bar showing all screens
│   │   ├── WireframeRenderer.tsx   ← Renders a single screen from spec JSON
│   │   ├── SkinSelector.tsx        ← Dropdown in top bar
│   │   ├── ExportModal.tsx         ← Export options dialog
│   │   └── ComponentRenderers/     ← One renderer per component type
│   │       ├── TableRenderer.tsx
│   │       ├── FormRenderer.tsx
│   │       ├── CardGridRenderer.tsx
│   │       ├── SplitLayoutRenderer.tsx
│   │       ├── DialogRenderer.tsx
│   │       ├── SheetRenderer.tsx
│   │       └── EmptyStateRenderer.tsx
├── lib/
│   ├── utils.ts
│   ├── spec-types.ts               ← TypeScript types for screen spec JSON
│   ├── spec-to-markdown.ts         ← Converts JSON spec to SCREEN_SPEC.md
│   ├── spec-to-claude-md.ts        ← Converts JSON spec to CLAUDE.md section
│   ├── export-zip.ts               ← Bundles design system files into ZIP
│   └── ai/
│       ├── system-prompt.ts        ← System prompt for the design AI
│       └── parse-response.ts       ← Extracts <screen_spec> from AI response
└── styles/
    └── skins/
        ├── modern-saas.css
        ├── warm-friendly.css
        └── dark-technical.css
```

### Key Data Flow

```
User types message
  → ChatPanel sends message to Claude API
  → Claude responds with text + <screen_spec>JSON</screen_spec>
  → parse-response.ts extracts JSON and text separately
  → Text displayed as chat message in ChatPanel
  → JSON parsed and stored in React state (screenSpec)
  → WireframePanel re-renders from updated screenSpec
  → User clicks element with navigateTo → active screen changes
  → User continues conversation → cycle repeats
```

### State Management

```typescript
// Main state in design/page.tsx

interface CompanionState {
  // Skin
  selectedSkin: 'modern-saas' | 'warm-friendly' | 'dark-technical';

  // Chat
  messages: ChatMessage[];
  isLoading: boolean;

  // Wireframe
  screenSpec: ScreenSpec | null;
  activeScreenId: string | null;
  previewDevice: 'desktop' | 'tablet' | 'phone';

  // Modals/sheets currently open in the wireframe preview
  openOverlays: string[]; // screen IDs of dialogs/sheets currently shown
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;        // The conversational text
  timestamp: Date;
}

// ScreenSpec type matches the JSON format defined above
```

### Claude API Integration

```typescript
// In the companion, call Claude API directly from the client
// (API key would normally be server-side, but for MVP/personal use, client-side is fine)

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: getSystemPrompt(selectedSkin),
    messages: conversationHistory,
  }),
});
```

The AI response format:

```
Here's what I'm thinking for your task manager. I've set up a dashboard with
your task list, a detail page for when you click into a task, and a settings
page. The task detail uses a split layout with chat on the left and details
on the right. Take a look at the preview and let me know what you'd change!

<screen_spec>
{
  "appName": "Todone",
  "skin": "modern-saas",
  "screens": [...],
  "navigation": {...}
}
</screen_spec>
```

The parser extracts everything before `<screen_spec>` as the chat message and the JSON inside the tags as the spec update.

---

## Part 5: Build Order for Claude Code

### Prerequisites

Before starting, make sure you have:
- Node.js 18+
- A Claude API key (for the design companion AI calls)

### Phase 1: Installable Design System (Build First)

This produces the component library, skins, linter, and rules that will be used by BOTH the companion app and end users.

**Step 1.1: Project Setup**

Create a new Next.js project for the VibeKit component library and companion:

```
npx create-next-app@latest vibekit --typescript --tailwind --eslint --app --src=false
cd vibekit
```

Install dependencies:
```
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install -D @types/node
```

**Step 1.2: Create the Three Skins**

Create `styles/skins/modern-saas.css`, `styles/skins/warm-friendly.css`, and `styles/skins/dark-technical.css` with the CSS variables defined in the skin spec above.

For MVP, start with `modern-saas` as the primary skin. The other two can be variations:
- `warm-friendly`: change primary to amber (38 92% 50%), increase --radius to 0.75rem, warmer grays
- `dark-technical`: dark background (222 47% 11%), green primary (142 76% 36%), decrease --radius to 0.25rem

Set up `app/globals.css` to import the selected skin and define the base Tailwind layer with all CSS variable references.

Set up `tailwind.config.ts` to extend colors with CSS variable references (e.g., `primary: 'hsl(var(--primary))'`).

**Step 1.3: Build UI Components**

Build each component in `components/ui/`. All components should:
- Use `class-variance-authority` (cva) for variants
- Use `cn()` from `lib/utils.ts` for class merging
- Reference only CSS variables, never hardcoded colors
- Export proper TypeScript interfaces
- Follow shadcn/ui patterns exactly (so vibe coders who know shadcn feel at home)

Build in this order (each builds on the previous):
1. `button.tsx` — variants: default, secondary, outline, ghost, destructive, link. Sizes: default, sm, lg, icon.
2. `card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
3. `input.tsx` — with optional icon support
4. `label.tsx`
5. `badge.tsx` — variants: default, secondary, destructive, success, warning, outline
6. `separator.tsx`
7. `skeleton.tsx`
8. `avatar.tsx` — AvatarImage, AvatarFallback
9. `switch.tsx`
10. `tabs.tsx` — Tabs, TabsList, TabsTrigger, TabsContent
11. `table.tsx` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
12. `textarea.tsx`
13. `checkbox.tsx`
14. `select.tsx` — Select, SelectTrigger, SelectContent, SelectItem, SelectValue
15. `dialog.tsx` — Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
16. `sheet.tsx` — Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription
17. `dropdown-menu.tsx` — DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
18. `toast.tsx` — Toast, ToastProvider, useToast hook
19. `alert.tsx` — Alert, AlertTitle, AlertDescription
20. `empty-state.tsx` — icon + title + description + optional action button

**Step 1.4: Build Layout Components**

Build in `components/layout/`:

1. `Sidebar.tsx` — Left navigation panel
   - Logo area at top
   - Nav items with icons and active state
   - Collapsible on mobile
   - Uses --sidebar-width CSS variable

2. `AppLayout.tsx` — Wraps every page
   - Sidebar on left
   - Content area on right with max-w-6xl
   - Responsive: sidebar collapses to hamburger on mobile

3. `PageHeader.tsx` — Top of every page
   - Title (required)
   - Description (optional)
   - Action buttons (optional, right-aligned)
   - Separator below

4. `MobileNav.tsx` — Bottom navigation for mobile
   - Shows on screens < 768px
   - Hides sidebar, shows bottom tab bar instead

**Step 1.5: Build Example Pages**

Build in `examples/`. These are full page components demonstrating patterns:

1. `dashboard.tsx` — 4 metric cards in a grid + data table with badges + search input
2. `settings.tsx` — Tabs with profile form, notification switches, billing card
3. `list-page.tsx` — Search + filter dropdown + card grid with pagination
4. `detail-page.tsx` — PageHeader with back button + split layout (main content + sidebar info)
5. `form-page.tsx` — Multi-section form with validation states
6. `empty-states.tsx` — Shows empty, loading (skeleton), and error patterns for common layouts

**Step 1.6: Build the Linter**

Create `scripts/design-check.ts`:
- Scan all .tsx files in app/ (excluding components/ui/, components/layout/)
- Flag: raw Tailwind colors (regex for bg-{color}-{shade}, text-{color}-{shade})
- Flag: missing AppLayout import on page files
- Flag: Badge without variant prop
- Flag: raw font sizes outside component definitions
- Flag: inline style attributes
- Output: list of violations with file path, line number, and suggestion
- Exit code 1 if violations found, 0 if clean

Add to package.json: `"design-check": "npx tsx scripts/design-check.ts"`

**Step 1.7: Create Component Index**

Create `components/index.ts` with comments listing every available component, its variants, and when to use it. This serves as documentation for both humans and AI coding tools.

### Phase 2: Design Companion (Build Second)

The companion app lives in the same Next.js project. It uses the VibeKit components to both build its own UI and render wireframes.

**Step 2.1: Landing Page**

Build `app/page.tsx`:
- Hero section: "Design your app before you build it"
- Skin preview: 3 cards showing the same sample dashboard in each skin. Clicking one selects it.
- "Start Designing" button → navigates to /design with selected skin as query param

**Step 2.2: Two-Panel Layout**

Build `app/design/page.tsx`:
- Full viewport height layout
- Top bar: VibeKit logo (left), skin selector dropdown (center), Export button (right)
- Below top bar: two panels side by side
- Left panel (40%): ChatPanel component
- Right panel (60%): WireframePanel component
- Resizable divider between panels (use a simple drag handle)

State management: all state lives in this page component via useReducer. State shape matches the CompanionState interface defined above.

**Step 2.3: Chat Panel**

Build `components/companion/ChatPanel.tsx`:
- Scrollable message list
- Each message is a ChatMessage component
- System message at top (not editable): "Describe the app you want to build. I'll design it as we talk."
- ChatInput at bottom with text input and send button
- Loading state: show typing indicator while waiting for AI response

Build `components/companion/ChatInput.tsx`:
- Text input (could be textarea for multiline)
- Send button (arrow icon)
- Submit on Enter (Shift+Enter for newline)
- Disabled while loading

Build `components/companion/ChatMessage.tsx`:
- User messages: right-aligned, primary color background
- Assistant messages: left-aligned, muted background
- Timestamp below each message

**Step 2.4: AI Integration**

Build `lib/ai/system-prompt.ts`:
- Function that returns the system prompt with skin name inserted
- Full prompt content as defined in the AI System Prompt section above

Build `lib/ai/parse-response.ts`:
- Function that takes the raw AI response text
- Extracts content before `<screen_spec>` as the chat message
- Extracts JSON inside `<screen_spec>...</screen_spec>` tags
- Parses JSON into ScreenSpec type
- Returns `{ message: string, spec: ScreenSpec | null }`
- Handles edge cases: no spec tag (just a conversation), malformed JSON (show error in chat)

Wire up the API call in the design page:
- On user send: append user message to conversation history
- Call Claude API with full conversation history + system prompt
- Parse response
- Append assistant message to chat
- If spec returned: update screenSpec state, set activeScreenId to first screen

**Step 2.5: Wireframe Panel**

Build `components/companion/WireframePanel.tsx`:
- If no screenSpec: show empty state ("Describe your app in the chat to get started")
- If screenSpec exists: show ScreenNavigator + WireframeRenderer

Build `components/companion/ScreenNavigator.tsx`:
- Horizontal tab bar at top of wireframe panel
- One tab per screen in the spec
- Active tab highlighted
- Clicking a tab sets activeScreenId
- Screens of type "dialog" or "sheet" are shown as smaller secondary tabs or in a separate section

Build `components/companion/WireframeRenderer.tsx`:
- Takes a single screen from the spec and renders it
- Wraps in AppLayout if layout is "sidebar" (shows simplified sidebar)
- Iterates through screen.sections and renders each using ComponentRenderers
- Handles interaction: elements with `navigateTo` get onClick handlers that change activeScreenId or open overlay
- If screen type is "dialog": render as Dialog component overlaying current content
- If screen type is "sheet": render as Sheet component sliding in from right

**Step 2.6: Component Renderers**

Build individual renderers in `components/companion/ComponentRenderers/`:

Each renderer takes the section spec JSON and renders it using real VibeKit components with placeholder data.

1. `TableRenderer.tsx` — Renders Table component with column headers from spec and 3-5 rows of realistic placeholder data. Rows are clickable if rowAction is defined.

2. `FormRenderer.tsx` — Renders a form with labeled inputs based on the fields array. Inputs are non-functional (just visual). Submit button included.

3. `CardGridRenderer.tsx` — Renders a grid of Card components with placeholder content.

4. `SplitLayoutRenderer.tsx` — Renders a two-column layout. Left and right content rendered based on their component type.

5. `DialogRenderer.tsx` — Renders Dialog component as an overlay. Content rendered based on sections inside the dialog spec.

6. `SheetRenderer.tsx` — Renders Sheet component sliding from right. Content rendered similarly to DialogRenderer.

7. `EmptyStateRenderer.tsx` — Renders the empty-state component with icon, title, description, and optional action.

8. `PageHeaderRenderer.tsx` — Renders PageHeader with title, description, back button, and action buttons.

9. `TabsRenderer.tsx` — Renders Tabs component with tab labels and placeholder content per tab.

10. `GenericRenderer.tsx` — Fallback for any component type not explicitly handled. Renders a Card with the component name and description as placeholder.

**Step 2.7: Skin Switching**

Build `components/companion/SkinSelector.tsx`:
- Dropdown with 3 skin options
- Each option shows skin name + small color swatch
- On select: update selectedSkin in state
- Changing skin swaps the CSS variables on the root element (or swaps a class that triggers different CSS variable values)
- Both the companion UI and the wireframe preview re-theme immediately

Implementation: load all three skin CSS files. Apply the active skin's variables to a wrapper div around the wireframe panel. The companion's own UI always uses modern-saas (or its own neutral theme).

Actually, simpler approach: the wireframe panel has a wrapper div with a `data-skin` attribute. Each skin CSS file scopes its variables under `[data-skin="modern-saas"]`, etc. Changing the skin just changes the data attribute.

IMPORTANT: Skin switching is NOT a one-time setup step. Users will switch skins mid-conversation as part of the design process. When the skin changes:
1. The wireframe re-renders immediately with new CSS variables (no page reload)
2. The selectedSkin in state updates, so the next Claude API call includes the new skin in the system prompt
3. The conversation and screen spec are completely preserved — only the visual theming changes
4. The export bundles whichever skin is currently selected at the time of export

**Step 2.8: Export**

Build `components/companion/ExportModal.tsx`:
- Triggered by Export button in top bar
- Dialog with 3 download buttons:

1. "Download Screen Spec" — calls `spec-to-markdown.ts` to convert the JSON spec to a readable markdown file. Triggers file download.

2. "Download CLAUDE.md" — calls `spec-to-claude-md.ts` to generate a combined rules file with design system rules + screen-specific instructions from the spec. Triggers file download.

3. "Download Design System" — calls `export-zip.ts` to bundle all VibeKit component files, the selected skin CSS, the linter, and the CLAUDE.md into a ZIP. Triggers file download.

Build `lib/spec-to-markdown.ts`:
- Takes ScreenSpec JSON
- Outputs readable markdown listing all screens, their components, navigation, and interactions
- Format matches the "Screen Spec to CLAUDE.md Export" example above

Build `lib/spec-to-claude-md.ts`:
- Takes ScreenSpec JSON + the base CLAUDE.md content
- Combines them into one file: base rules at top, then "## App Structure" section generated from the spec

Build `lib/export-zip.ts`:
- Uses JSZip library (install: `npm install jszip`)
- Bundles: components/ui/*, components/layout/*, selected skin CSS, CLAUDE.md, scripts/design-check.ts, lib/utils.ts, examples/*
- Triggers browser download of ZIP file

### Phase 3: Test With a Real App

After building the above, test the full flow by designing Todone in the companion and then building it with Claude Code using the exported files.

---

## Part 6: Important Implementation Notes

### Don't Over-Engineer

- No database. Everything is in React state. If you refresh, you start over. That's fine for MVP.
- No auth. The companion is a single-player tool.
- No server-side API routes for the AI call. Call Claude API directly from the client for MVP. (In production you'd proxy through a server to protect the API key, but for personal use this is fine.)
- No complex state management library. useReducer in the design page component is sufficient.

### The Wireframe is NOT a Working App

The wireframe preview renders VibeKit components with placeholder data. Nothing is functional — forms don't submit, tables don't sort, search doesn't filter. The components just look right and are clickable for navigation purposes. This is a wireframe, not a prototype.

### Component Renderers Should Be Forgiving

The AI will sometimes generate spec JSON that doesn't perfectly match the expected format. Component renderers should:
- Have sensible defaults for missing props
- Not crash on unexpected data
- Show a gray placeholder box with the component name if they can't render something
- Console.warn for debugging but never throw

### The AI Won't Be Perfect

The conversational AI will sometimes:
- Generate invalid JSON (the parser should catch this and retry or show an error message in chat)
- Suggest too many or too few screens (the user can say "simplify" or "what am I missing")
- Pick the wrong interaction pattern (the user can correct: "no, make that a sheet not a dialog")

This is fine. The value is in the iteration loop, not in getting it right the first time.

### Skin CSS Must Be Fully Self-Contained

Each skin CSS file must define ALL variables. No skin should inherit from another. This ensures skin switching is a simple swap with no side effects.
