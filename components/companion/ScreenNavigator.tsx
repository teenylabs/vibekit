"use client";

import { cn } from "@/lib/utils";

interface ScreenItem {
  id: string;
  name: string;
  type: string;
}

interface ScreenNavigatorProps {
  screens: ScreenItem[];
  activeScreenId: string | null;
  onScreenSelect: (screenId: string) => void;
}

export function ScreenNavigator({
  screens,
  activeScreenId,
  onScreenSelect,
}: ScreenNavigatorProps) {
  // Only show page-type screens as tabs
  const pageScreens = screens.filter((s) => s.type === "page");

  if (pageScreens.length === 0) return null;

  return (
    <div className="border-b border-border">
      <div className="flex flex-wrap gap-1 p-2">
        {pageScreens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => onScreenSelect(screen.id)}
            className={cn(
              "px-3 py-1.5 text-small rounded-md cursor-pointer transition-colors",
              activeScreenId === screen.id
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {screen.name}
          </button>
        ))}
      </div>
    </div>
  );
}
