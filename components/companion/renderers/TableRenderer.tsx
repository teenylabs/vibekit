"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import type { Section } from "@/lib/spec-types";

interface TableRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

const PLACEHOLDER_NAMES = [
  "Design homepage mockup",
  "Fix authentication bug",
  "Update API documentation",
  "Review pull request",
  "Deploy to staging",
];

const PLACEHOLDER_PEOPLE = ["Alice M", "Bob K", "Carol D", "Dan W", "Eve R"];
const PLACEHOLDER_DATES = ["Feb 20, 2026", "Feb 18, 2026", "Feb 15, 2026", "Feb 12, 2026", "Feb 10, 2026"];
const STATUSES: Array<{ label: string; variant: "success" | "warning" | "secondary" }> = [
  { label: "Done", variant: "success" },
  { label: "In Progress", variant: "warning" },
  { label: "Pending", variant: "secondary" },
  { label: "Active", variant: "success" },
  { label: "Review", variant: "warning" },
];
const PRIORITIES: Array<{ label: string; variant: "destructive" | "warning" | "secondary" }> = [
  { label: "High", variant: "destructive" },
  { label: "Medium", variant: "warning" },
  { label: "Low", variant: "secondary" },
];

function generateCellContent(columnName: string, rowIndex: number) {
  const col = columnName.toLowerCase();

  if (col.includes("name") || col.includes("task") || col.includes("title") || col.includes("item")) {
    return PLACEHOLDER_NAMES[rowIndex % PLACEHOLDER_NAMES.length];
  }
  if (col.includes("status")) {
    const status = STATUSES[rowIndex % STATUSES.length];
    return <Badge variant={status.variant} size="sm">{status.label}</Badge>;
  }
  if (col.includes("priority")) {
    const priority = PRIORITIES[rowIndex % PRIORITIES.length];
    return <Badge variant={priority.variant} size="sm">{priority.label}</Badge>;
  }
  if (col.includes("date") || col.includes("created") || col.includes("updated") || col.includes("due")) {
    return PLACEHOLDER_DATES[rowIndex % PLACEHOLDER_DATES.length];
  }
  if (col.includes("assignee") || col.includes("user") || col.includes("owner") || col.includes("member")) {
    const person = PLACEHOLDER_PEOPLE[rowIndex % PLACEHOLDER_PEOPLE.length];
    const initials = person.split(" ").map((n) => n[0]).join("");
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-tiny">{initials}</AvatarFallback>
        </Avatar>
        <span>{person}</span>
      </div>
    );
  }
  if (col.includes("email")) {
    const person = PLACEHOLDER_PEOPLE[rowIndex % PLACEHOLDER_PEOPLE.length];
    return `${person.split(" ")[0].toLowerCase()}@example.com`;
  }
  if (col.includes("amount") || col.includes("price") || col.includes("cost")) {
    return `$${((rowIndex + 1) * 29.99).toFixed(2)}`;
  }

  return `Item ${rowIndex + 1}`;
}

export function TableRenderer({ section, onNavigate }: TableRendererProps) {
  const props = section.props || {};

  // Accept columns as array of strings or array of objects with name/key/label
  const rawColumns: any[] = props.columns || props.headers || [];
  const columns: string[] = rawColumns.map((col: any) => {
    if (typeof col === "string") return col;
    return col?.label || col?.name || col?.key || "Column";
  });

  if (columns.length === 0) {
    columns.push("Name", "Status", "Date");
  }

  const rowCount = Math.min(props.rows?.length || 5, 8);
  const hasProvidedRows = Array.isArray(props.rows) && props.rows.length > 0;

  const rowAction = props.rowAction || props.row_action || props.onRowClick;
  const rowTarget = rowAction?.target || rowAction?.navigateTo;
  const isClickable = !!rowTarget;

  return (
    <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i}>{col}</TableHead>
          ))}
          {isClickable && <TableHead className="w-8" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow
            key={rowIndex}
            className={isClickable ? "group cursor-pointer hover:bg-muted/50 transition-colors" : undefined}
            onClick={
              isClickable ? () => onNavigate(rowTarget) : undefined
            }
          >
            {columns.map((col, colIndex) => (
              <TableCell key={colIndex}>
                {hasProvidedRows
                  ? renderProvidedCell(props.rows[rowIndex], colIndex, col, rowIndex)
                  : generateCellContent(col, rowIndex)}
              </TableCell>
            ))}
            {isClickable && (
              <TableCell className="w-8 pr-4">
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}

function renderProvidedCell(row: any, colIndex: number, colName: string, rowIndex: number): React.ReactNode {
  if (!row) return generateCellContent(colName, colIndex);

  // Row could be an array or an object
  let cellValue: any;
  if (Array.isArray(row)) {
    cellValue = row[colIndex];
  } else if (typeof row === "object") {
    // Try exact match, then case-insensitive, then positional
    const keys = Object.keys(row);
    const key =
      keys.find((k) => k === colName) ||
      keys.find((k) => k.toLowerCase() === colName.toLowerCase()) ||
      keys.find((k) => colName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(colName.toLowerCase())) ||
      keys[colIndex];
    cellValue = key ? row[key] : undefined;
  }

  if (cellValue == null) return "—";
  if (typeof cellValue === "string") return cellValue;
  if (typeof cellValue === "number" || typeof cellValue === "boolean") return String(cellValue);

  // {component, props} format — render as real components
  if (typeof cellValue === "object" && cellValue.component) {
    return renderCellComponent(cellValue, colName, rowIndex);
  }

  // Array of values — join as comma-separated text
  if (Array.isArray(cellValue)) {
    return cellValue.map((v: any) => (typeof v === "string" ? v : v?.label || v?.name || "")).join(", ");
  }

  // Plain object without component — try to extract meaningful text
  if (typeof cellValue === "object") {
    return cellValue.label || cellValue.name || cellValue.text || cellValue.value || "—";
  }

  return String(cellValue);
}

function renderCellComponent(cell: { component: string; props?: Record<string, any> }, colName: string, rowIndex: number): React.ReactNode {
  const comp = cell.component;
  const p = cell.props || {};

  if (comp === "Badge") {
    const variant = mapBadgeVariant(p.variant, colName);
    return <Badge variant={variant} size="sm">{p.children || p.label || p.text || "Badge"}</Badge>;
  }

  if (comp === "Avatar") {
    const name = p.name || p.alt || PLACEHOLDER_PEOPLE[rowIndex % PLACEHOLDER_PEOPLE.length];
    const initials = p.initials || name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-tiny">{initials}</AvatarFallback>
        </Avatar>
        <span>{name}</span>
      </div>
    );
  }

  // Fallback: extract any text content
  return p.children || p.label || p.text || p.name || comp;
}

function mapBadgeVariant(variant: string | undefined, colName: string): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" {
  // If the AI provided a valid variant, use it
  const validVariants = ["default", "secondary", "destructive", "success", "warning", "outline"] as const;
  if (variant && validVariants.includes(variant as any)) {
    return variant as typeof validVariants[number];
  }
  // Fallback based on column context
  if (colName.toLowerCase().includes("priority")) return "warning";
  if (colName.toLowerCase().includes("status")) return "secondary";
  return "default";
}
