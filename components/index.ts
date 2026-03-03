/**
 * VibeKit Component Inventory
 *
 * All available components, their variants, and usage guidelines.
 * Import from this file or directly from the component paths.
 */

// ─── UI Primitives ───────────────────────────────────────────────────────────

/**
 * Button — Primary interactive element.
 * Variants: default, secondary, outline, ghost, destructive, link
 * Sizes: default, sm, lg, icon
 * Use: form submissions, CTAs, actions in PageHeader, table row actions
 */
export { Button } from "./ui/button";
export type { ButtonProps } from "./ui/button";

/**
 * Card — Container for grouped content.
 * Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 * Use: metric cards, content sections, settings panels, list items
 */
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

/**
 * Input — Text input field.
 * Props: icon (optional LucideIcon for search/filter inputs)
 * Use: forms, search bars, inline editing
 */
export { Input } from "./ui/input";

/**
 * Label — Form field label.
 * Use: always pair with Input, Select, Textarea, or Checkbox
 */
export { Label } from "./ui/label";

/**
 * Badge — Status and category indicator.
 * Variants: default, secondary, destructive, success, warning, outline
 * Sizes: default, sm (use sm inside tables and cards)
 * Use: status tags, priority labels, category markers, counts
 * Convention: high→destructive, medium→warning, low→secondary,
 *             done→success, active→default, pending→outline, failed→destructive
 */
export { Badge } from "./ui/badge";

/**
 * Avatar — User profile image with fallback.
 * Sub-components: AvatarImage, AvatarFallback
 * Use: user avatars in tables, comments, team lists, headers
 */
export { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

/**
 * Separator — Visual divider between sections.
 * Props: orientation ("horizontal" | "vertical"), decorative
 * Use: between form sections, settings groups, card content sections
 */
export { Separator } from "./ui/separator";

/**
 * Skeleton — Loading placeholder.
 * Use: content loading states — match the shape of content being loaded
 */
export { Skeleton } from "./ui/skeleton";

/**
 * Switch — Toggle control.
 * Props: checked, onCheckedChange
 * Use: boolean settings, feature toggles, notification preferences
 */
export { Switch } from "./ui/switch";

/**
 * Checkbox — Multi-select control.
 * Props: checked, onCheckedChange
 * Use: permission toggles, multi-select lists, terms acceptance
 */
export { Checkbox } from "./ui/checkbox";

/**
 * Textarea — Multi-line text input.
 * Use: descriptions, comments, bio fields, long-form input
 */
export { Textarea } from "./ui/textarea";

/**
 * Select — Dropdown selection.
 * Sub-components: SelectTrigger, SelectContent, SelectItem, SelectValue
 * Props: value, onValueChange, defaultValue
 * Use: filters, category selection, timezone/locale pickers
 */
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

// ─── Data Display ────────────────────────────────────────────────────────────

/**
 * Table — Data table with header, body, rows, and cells.
 * Sub-components: TableHeader, TableBody, TableRow, TableHead, TableCell
 * Use: data lists, order tables, team member lists, audit logs
 * Row height: 48px, cell padding: p-4, header: font-medium text-muted-foreground
 */
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";

/**
 * Tabs — Tabbed content panels.
 * Sub-components: TabsList, TabsTrigger, TabsContent
 * Props: defaultValue, value, onValueChange
 * Use: settings pages, content with multiple views, detail page sections
 */
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

// ─── Overlays ────────────────────────────────────────────────────────────────

/**
 * Dialog — Modal overlay for confirmations and focused actions.
 * Sub-components: DialogTrigger, DialogContent, DialogHeader, DialogTitle,
 *                 DialogDescription, DialogFooter, DialogClose
 * Props: open, onOpenChange
 * Use: destructive action confirmations, quick create forms, export modals
 * Do NOT use for: secondary content (use Sheet), transient feedback (use Toast)
 */
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

/**
 * Sheet — Slide-in panel from screen edge.
 * Sub-components: SheetTrigger, SheetContent, SheetHeader, SheetTitle,
 *                 SheetDescription, SheetClose
 * Props: open, onOpenChange. SheetContent has side prop: "right" | "left" | "top" | "bottom"
 * Use: secondary detail panels, edit forms, filters panel
 * Do NOT use for: primary content (use push navigation), confirmations (use Dialog)
 */
export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./ui/sheet";

/**
 * DropdownMenu — Contextual action menu.
 * Sub-components: DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
 *                 DropdownMenuSeparator
 * Use: row action menus (⋯ button), header actions, filter menus
 */
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

// ─── Feedback ────────────────────────────────────────────────────────────────

/**
 * Toast — Transient notification.
 * Components: ToastProvider (wrap app), Toast
 * Hook: useToast() → { toast, toasts, dismiss }
 * Variants: default, success, destructive
 * Use: action confirmations, save success, error notifications
 * Auto-dismisses after 5s. Position: bottom-right.
 */
export { ToastProvider, Toast, useToast } from "./ui/toast";

/**
 * Alert — Persistent inline message.
 * Sub-components: AlertTitle, AlertDescription
 * Variants: default, destructive
 * Use: persistent warnings, error banners, info messages that need user attention
 * Do NOT use for: transient feedback (use Toast)
 */
export { Alert, AlertTitle, AlertDescription } from "./ui/alert";

/**
 * EmptyState — Placeholder for empty content areas.
 * Props: icon (LucideIcon), title, description, action ({ label, onClick, variant })
 * Use: empty lists, no search results, first-time views, no data states
 */
export { EmptyState } from "./ui/empty-state";

// ─── Layout ──────────────────────────────────────────────────────────────────

/**
 * AppLayout — Page wrapper with sidebar and responsive nav.
 * Props: navItems (NavItem[]), appName (string), children
 * Use: EVERY page must be wrapped in AppLayout. Provides sidebar, mobile header,
 *      mobile bottom nav, and max-w-6xl content area.
 */
export { AppLayout } from "./layout/AppLayout";

/**
 * PageHeader — Top of every page with title, description, and actions.
 * Props: title, description?, actions? (PageHeaderAction[]), backButton? ({ href?, onClick? })
 * Use: first child inside AppLayout on every page. Includes separator below.
 */
export { PageHeader } from "./layout/PageHeader";

/**
 * Sidebar — Left navigation panel (used internally by AppLayout).
 * Props: navItems, appName, isOpen, onClose
 * Typically not used directly — AppLayout handles it.
 */
export { Sidebar } from "./layout/Sidebar";
export type { NavItem } from "./layout/Sidebar";

/**
 * MobileNav — Bottom tab bar for mobile (used internally by AppLayout).
 * Props: navItems
 * Typically not used directly — AppLayout handles it.
 */
export { MobileNav } from "./layout/MobileNav";
