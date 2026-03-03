"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { getLucideIcon } from "./icon-helper";
import type { Section } from "@/lib/spec-types";

interface EmptyStateRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

export function EmptyStateRenderer({ section, onNavigate }: EmptyStateRendererProps) {
  const props = section.props || {};
  const Icon = getLucideIcon(props.icon);

  const action = props.action
    ? {
        label: props.action.label || "Action",
        onClick: props.action.navigateTo
          ? () => onNavigate(props.action.navigateTo)
          : undefined,
      }
    : undefined;

  return (
    <EmptyState
      icon={Icon}
      title={props.title || "No items"}
      description={props.description}
      action={action}
    />
  );
}
