"use client";

import type { Section } from "@/lib/spec-types";

interface SplitLayoutRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
  renderSection: (section: Section, onNavigate: (screenId: string) => void) => React.ReactNode;
}

export function SplitLayoutRenderer({
  section,
  onNavigate,
  renderSection,
}: SplitLayoutRendererProps) {
  const props = section.props || {};
  const left: any[] = props.left || props.primary || [];
  const right: any[] = props.right || props.secondary || [];
  const ratio = props.ratio || "1:1";

  const leftWidth = ratio === "2:1" ? "lg:col-span-2" : ratio === "1:2" ? "lg:col-span-1" : "lg:col-span-1";
  const rightWidth = ratio === "2:1" ? "lg:col-span-1" : ratio === "1:2" ? "lg:col-span-2" : "lg:col-span-1";
  const gridCols = ratio === "1:1" ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
      <div className={`space-y-6 ${leftWidth}`}>
        {normalizeChildren(left).map((child, index) => (
          <div key={index}>{renderSection(child, onNavigate)}</div>
        ))}
        {left.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-small text-muted-foreground">
            Left panel
          </div>
        )}
      </div>
      <div className={`space-y-6 ${rightWidth}`}>
        {normalizeChildren(right).map((child, index) => (
          <div key={index}>{renderSection(child, onNavigate)}</div>
        ))}
        {right.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-small text-muted-foreground">
            Right panel
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeChildren(children: any[]): Section[] {
  return children.map((child: any, index: number) => {
    if (child?.component) {
      return {
        id: child.id || `split-child-${index}`,
        component: child.component,
        props: child.props || {},
      };
    }
    return {
      id: `split-child-${index}`,
      component: "Generic",
      props: { description: typeof child === "string" ? child : "Content" },
    };
  });
}
