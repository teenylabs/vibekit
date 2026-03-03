"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Section } from "@/lib/spec-types";

interface GenericRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

export function GenericRenderer({ section }: GenericRendererProps) {
  return (
    <Card className="border-dashed bg-muted/30">
      <CardHeader>
        <CardTitle className="text-small">{section.component}</CardTitle>
        <CardDescription>
          {section.props?.description || section.props?.title || "Component placeholder"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
