"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionRenderer } from "../SectionRenderer";
import type { Section } from "@/lib/spec-types";

interface CardRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
  renderSection: (section: Section, onNavigate: (screenId: string) => void) => React.ReactNode;
}

// Check if a className contains grid classes
function hasGridClass(className: string | undefined): boolean {
  if (!className) return false;
  return className.includes("grid");
}

// Check if a child object looks like a metric card (has title/label + value)
function isMetricChild(child: any): boolean {
  if (!child || typeof child !== "object") return false;
  const p = child.props || child;
  return !!(p.value && (p.title || p.label));
}

export function CardRenderer({ section, onNavigate }: CardRendererProps) {
  const props = section.props || {};

  // Metric card: has title + value, no children — compact rendering
  if (props.value && !props.children && !props.sections) {
    const hasNav = !!props.navigateTo;
    return (
      <Card
        className={`${props.className || ""} ${hasNav ? "cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200" : ""}`.trim() || undefined}
        onClick={hasNav ? () => onNavigate(props.navigateTo) : undefined}
      >
        <CardHeader className="pb-2">
          <CardDescription>{props.title || "Metric"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-h2 font-bold">{props.value}</p>
          {props.badge && (
            <Badge variant="secondary" size="sm" className="mt-1">
              {props.badge}
            </Badge>
          )}
          {props.description && (
            <p className="text-tiny text-muted-foreground mt-1">{props.description}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Grid container card: className has grid classes, render children in a grid div (no wrapping Card)
  const children = props.children || props.sections;
  const content = props.content;

  if (hasGridClass(props.className) && Array.isArray(children)) {
    return (
      <div className={`${props.className} overflow-hidden`}>
        {children.map((child: any, index: number) => {
          // Metric child: render as a metric Card directly
          if (isMetricChild(child)) {
            const cp = child.props || child;
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardDescription>{cp.title || cp.label || "Metric"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-h2 font-bold">{cp.value}</p>
                  {cp.badge && (
                    <Badge variant="secondary" size="sm" className="mt-1">
                      {cp.badge}
                    </Badge>
                  )}
                  {cp.description && (
                    <p className="text-tiny text-muted-foreground mt-1">{cp.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          }
          // Component child
          if (child?.component) {
            const childSection: Section = {
              id: child.id || `${section.id}-grid-${index}`,
              component: child.component,
              props: child.props || {},
            };
            return (
              <div key={index}>
                <SectionRenderer section={childSection} onNavigate={onNavigate} />
              </div>
            );
          }
          // String child
          if (typeof child === "string") {
            return <p key={index} className="text-small">{child}</p>;
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <Card className={`${props.className || ""} overflow-hidden`.trim()}>
      {(props.title || props.description) && (
        <CardHeader>
          {props.title && <CardTitle>{props.title}</CardTitle>}
          {props.description && (
            <CardDescription>{props.description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={!props.title && !props.description ? "p-6" : undefined}>
        {renderChildren(children, onNavigate, section.id)}
        {renderContent(content, onNavigate, section.id)}
      </CardContent>
    </Card>
  );
}

function renderContent(
  content: any,
  onNavigate: (screenId: string) => void,
  parentId: string
): React.ReactNode {
  if (!content) return null;

  if (typeof content === "string") {
    return <p className="text-small text-muted-foreground">{content}</p>;
  }

  if (Array.isArray(content)) {
    return renderChildArray(content, onNavigate, parentId);
  }

  if (typeof content === "object" && content.component) {
    const childSection: Section = {
      id: content.id || `${parentId}-content`,
      component: content.component,
      props: content.props || {},
    };
    return <SectionRenderer section={childSection} onNavigate={onNavigate} />;
  }

  return null;
}

function renderChildren(
  children: any,
  onNavigate: (screenId: string) => void,
  parentId: string
): React.ReactNode {
  if (!children) return null;

  if (typeof children === "string") {
    return <p className="text-small">{children}</p>;
  }

  if (Array.isArray(children)) {
    return renderChildArray(children, onNavigate, parentId);
  }

  // Single object with component key
  if (typeof children === "object" && children.component) {
    const childSection: Section = {
      id: children.id || `${parentId}-child`,
      component: children.component,
      props: children.props || {},
    };
    return <SectionRenderer section={childSection} onNavigate={onNavigate} />;
  }

  return null;
}

function renderChildArray(
  items: any[],
  onNavigate: (screenId: string) => void,
  parentId: string
): React.ReactNode {
  return (
    <div className="space-y-4">
      {items.map((child: any, index: number) => {
        if (typeof child === "string") {
          return <p key={index} className="text-small">{child}</p>;
        }
        if (child?.component) {
          const childSection: Section = {
            id: child.id || `${parentId}-child-${index}`,
            component: child.component,
            props: child.props || {},
          };
          return (
            <div key={index}>
              <SectionRenderer section={childSection} onNavigate={onNavigate} />
            </div>
          );
        }
        // Unknown object — try to extract text
        if (child && typeof child === "object") {
          const text = child.title || child.label || child.text || child.name;
          if (text) {
            return <p key={index} className="text-small">{text}</p>;
          }
          return null;
        }
        return null;
      })}
    </div>
  );
}
