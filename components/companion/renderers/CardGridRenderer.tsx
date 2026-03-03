"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Section } from "@/lib/spec-types";

interface CardGridRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

const PLACEHOLDER_CARDS = [
  { title: "Total Users", description: "Active accounts", value: "2,847", badge: "+12%" },
  { title: "Revenue", description: "Monthly recurring", value: "$34,500", badge: "+8%" },
  { title: "Tasks", description: "Open items", value: "126", badge: "14 new" },
  { title: "Uptime", description: "Last 30 days", value: "99.9%", badge: "Healthy" },
];

export function CardGridRenderer({ section, onNavigate }: CardGridRendererProps) {
  const props = section.props || {};
  const cards: any[] = props.cards || PLACEHOLDER_CARDS;
  const gridCols = props.columns || 3;

  const gridClass =
    gridCols === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : gridCols === 4
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className={gridClass}>
      {cards.map((card: any, index: number) => (
        <Card
          key={index}
          className={card?.navigateTo ? "cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200" : undefined}
          onClick={card?.navigateTo ? () => onNavigate(card.navigateTo) : undefined}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-small font-medium">
                {card?.title || `Card ${index + 1}`}
              </CardTitle>
              {card?.badge && (
                <Badge variant="secondary" size="sm">
                  {card.badge}
                </Badge>
              )}
            </div>
            {card?.description && (
              <CardDescription>{card.description}</CardDescription>
            )}
          </CardHeader>
          {card?.value && (
            <CardContent>
              <p className="text-h2 font-bold">{card.value}</p>
            </CardContent>
          )}
          {card?.content && (
            <CardContent>
              <p className="text-small text-muted-foreground">{card.content}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
