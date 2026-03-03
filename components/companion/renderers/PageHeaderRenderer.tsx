"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import type { Section } from "@/lib/spec-types";

interface PageHeaderRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

// The AI generates actions in multiple formats:
// 1. { label: "New Task", navigateTo: "create-task" }
// 2. { component: "Button", props: { label: "New Task", navigateTo: "create-task" } }
// 3. { label: "New Task", variant: "default", icon: "plus" }
function unwrapAction(action: any): { label: string; variant?: string; navigateTo?: string } {
  if (!action) return { label: "Action" };

  // Format 2: wrapped in {component, props}
  if (action.component && action.props) {
    const p = action.props;
    return {
      label: p.label || p.children || p.text || action.component,
      variant: p.variant,
      navigateTo: p.navigateTo || p.onClick?.navigateTo,
    };
  }

  // Format 1 & 3: direct props
  return {
    label: action.label || action.children || action.text || "Action",
    variant: action.variant,
    navigateTo: action.navigateTo,
  };
}

export function PageHeaderRenderer({ section, onNavigate }: PageHeaderRendererProps) {
  const props = section.props || {};

  const rawActions = props.actions || (props.action ? [props.action] : []);
  const actions = rawActions.map((action: any) => {
    const unwrapped = unwrapAction(action);
    const hasNav = !!unwrapped.navigateTo;
    return {
      label: unwrapped.label,
      variant: unwrapped.variant as any,
      className: hasNav ? "cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all" : undefined,
      onClick: hasNav
        ? () => onNavigate(unwrapped.navigateTo!)
        : undefined,
    };
  });

  const backButton =
    props.backButton || props.showBack
      ? {
          onClick: () => {
            const target = typeof props.backButton === "object"
              ? props.backButton?.navigateTo
              : undefined;
            if (target) onNavigate(target);
          },
        }
      : undefined;

  return (
    <PageHeader
      title={props.title || "Page Title"}
      description={props.description}
      actions={actions.length > 0 ? actions : undefined}
      backButton={backButton}
    />
  );
}
