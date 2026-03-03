"use client";

import type { Section } from "@/lib/spec-types";
import { PageHeaderRenderer } from "./renderers/PageHeaderRenderer";
import { TableRenderer } from "./renderers/TableRenderer";
import { FormRenderer } from "./renderers/FormRenderer";
import { CardGridRenderer } from "./renderers/CardGridRenderer";
import { SplitLayoutRenderer } from "./renderers/SplitLayoutRenderer";
import { TabsRenderer } from "./renderers/TabsRenderer";
import { EmptyStateRenderer } from "./renderers/EmptyStateRenderer";
import { CardRenderer } from "./renderers/CardRenderer";
import { GenericRenderer } from "./renderers/GenericRenderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { getLucideIcon } from "./renderers/icon-helper";

interface SectionRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

export function SectionRenderer({ section, onNavigate }: SectionRendererProps) {
  return renderSection(section, onNavigate);
}

function renderSection(
  section: Section,
  onNavigate: (screenId: string) => void
): React.ReactNode {
  if (!section?.component) {
    console.warn("SectionRenderer: missing component type", section);
    return null;
  }

  const component = section.component;
  const props = section.props || {};

  switch (component) {
    case "PageHeader":
      return <PageHeaderRenderer section={section} onNavigate={onNavigate} />;

    case "Table":
      return <TableRenderer section={section} onNavigate={onNavigate} />;

    case "Form":
      return <FormRenderer section={section} onNavigate={onNavigate} />;

    case "CardGrid":
      return <CardGridRenderer section={section} onNavigate={onNavigate} />;

    case "SplitLayout":
      return (
        <SplitLayoutRenderer
          section={section}
          onNavigate={onNavigate}
          renderSection={renderSection}
        />
      );

    case "Tabs":
      return <TabsRenderer section={section} onNavigate={onNavigate} />;

    case "EmptyState":
      return <EmptyStateRenderer section={section} onNavigate={onNavigate} />;

    case "Card":
      return (
        <CardRenderer
          section={section}
          onNavigate={onNavigate}
          renderSection={renderSection}
        />
      );

    // --- Inline UI components the AI commonly generates ---

    case "Input":
    case "Search": {
      const isSearch = component === "Search" || props.icon === "search" || props.type === "search";
      const icon = isSearch ? Search : undefined;
      const placeholder = props.placeholder || (isSearch ? "Search..." : props.label || "");
      return (
        <div className="space-y-2">
          {props.label && !isSearch && <Label>{props.label}</Label>}
          <Input
            placeholder={placeholder}
            icon={icon}
            type={props.type === "password" ? "password" : props.type === "email" ? "email" : "text"}
            readOnly
          />
        </div>
      );
    }

    case "Textarea":
      return (
        <div className="space-y-2">
          {props.label && <Label>{props.label}</Label>}
          <Textarea placeholder={props.placeholder || ""} readOnly />
        </div>
      );

    case "Button": {
      const variant = props.variant as any;
      const hasNav = !!props.navigateTo;
      return (
        <Button
          variant={variant || "default"}
          size={props.size as any}
          className={hasNav ? "cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all" : undefined}
          onClick={hasNav ? () => onNavigate(props.navigateTo) : undefined}
        >
          {props.label || props.children || props.text || "Button"}
        </Button>
      );
    }

    case "Badge": {
      const variant = props.variant as any;
      return (
        <Badge variant={variant || "default"} size={props.size as any}>
          {props.label || props.children || props.text || "Badge"}
        </Badge>
      );
    }

    case "Label":
      return <Label>{props.label || props.children || props.text || "Label"}</Label>;

    case "Separator":
      return <Separator orientation={props.orientation} />;

    case "Switch":
      return (
        <div className="flex items-center justify-between">
          {props.label && <Label>{props.label}</Label>}
          <Switch />
        </div>
      );

    case "Checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox id={`cb-${section.id}`} />
          {props.label && <Label htmlFor={`cb-${section.id}`}>{props.label}</Label>}
        </div>
      );

    case "Select":
      return (
        <div className="space-y-2">
          {props.label && <Label>{props.label}</Label>}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {(props.options || ["Option 1", "Option 2", "Option 3"]).map(
                (opt: any, i: number) => {
                  const value = typeof opt === "string" ? opt : opt?.value || opt?.label || `opt-${i}`;
                  const label = typeof opt === "string" ? opt : opt?.label || value;
                  return <SelectItem key={i} value={value}>{label}</SelectItem>;
                }
              )}
            </SelectContent>
          </Select>
        </div>
      );

    case "Avatar": {
      const name = props.name || props.alt || "User";
      const initials = props.initials || name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {props.showName !== false && <span className="text-small">{name}</span>}
        </div>
      );
    }

    case "Skeleton":
      return (
        <div className="space-y-2">
          <Skeleton className={props.className || "h-4 w-full"} />
          {!props.className && (
            <>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </>
          )}
        </div>
      );

    case "Alert": {
      const Icon = getLucideIcon(props.icon);
      return (
        <Alert variant={props.variant as any}>
          {Icon && <Icon className="h-4 w-4" />}
          {props.title && <AlertTitle>{props.title}</AlertTitle>}
          {props.description && <AlertDescription>{props.description}</AlertDescription>}
        </Alert>
      );
    }

    case "DropdownMenu":
      // Render as a button with dropdown indicator
      return (
        <Button variant="outline" size={props.size as any}>
          {props.label || props.trigger || "Menu"} ▾
        </Button>
      );

    // --- Structural / wrapper components ---

    case "div":
    case "section":
    case "group":
    case "container":
    case "wrapper": {
      // Render children if they exist, otherwise show content
      const children: any[] = props.children || props.sections || props.content;
      if (Array.isArray(children)) {
        return (
          <div className={props.className || "space-y-4"}>
            {children.map((child: any, index: number) => {
              if (typeof child === "string") {
                return <p key={index} className="text-small">{child}</p>;
              }
              if (child?.component) {
                const childSection: Section = {
                  id: child.id || `${section.id}-child-${index}`,
                  component: child.component,
                  props: child.props || {},
                };
                return (
                  <div key={index}>
                    <SectionRenderer section={childSection} onNavigate={onNavigate} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
      if (typeof children === "string") {
        return <p className="text-small">{children}</p>;
      }
      // Single object child
      if (children && typeof children === "object" && (children as any).component) {
        const childSection: Section = {
          id: `${section.id}-child`,
          component: (children as any).component,
          props: (children as any).props || {},
        };
        return <SectionRenderer section={childSection} onNavigate={onNavigate} />;
      }
      // If we have title/description but no children, render as a labeled section
      if (props.title || props.description || props.label) {
        return (
          <div className="space-y-2">
            {(props.title || props.label) && (
              <h3 className="text-h3 text-foreground">{props.title || props.label}</h3>
            )}
            {props.description && (
              <p className="text-small text-muted-foreground">{props.description}</p>
            )}
          </div>
        );
      }
      return null;
    }

    // --- Overlay types shown inline as cards ---
    case "Dialog":
    case "Sheet": {
      // Render dialog/sheet content inline as a Card preview
      const children: any[] = props.children || props.sections || props.content || [];
      return (
        <CardRenderer
          section={{
            ...section,
            component: "Card",
            props: {
              title: props.title || component,
              description: props.description,
              children: Array.isArray(children) ? children : undefined,
            },
          }}
          onNavigate={onNavigate}
          renderSection={renderSection}
        />
      );
    }

    default:
      return <GenericRenderer section={section} onNavigate={onNavigate} />;
  }
}
