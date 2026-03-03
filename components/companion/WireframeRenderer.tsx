"use client";

import { cn } from "@/lib/utils";
import { SectionRenderer } from "./SectionRenderer";
import { getLucideIcon } from "./renderers/icon-helper";
import type { Screen, Section, ScreenSpec } from "@/lib/spec-types";

interface WireframeRendererProps {
  screen: Screen;
  allScreens: Screen[];
  screenSpec?: ScreenSpec | null;
  onNavigate: (screenId: string) => void;
  selectedSkin: string;
}

// Detect if a Card section looks like a metric/stat card (title + value, no complex children)
function isMetricCard(section: Section): boolean {
  if (section.component !== "Card") return false;
  const p = section.props || {};
  // Has a value/metric prop, or has title + (value or content that's a short string)
  if (p.value) return true;
  if (p.title && p.content && typeof p.content === "string" && p.content.length < 20) return true;
  // Has title but no children array (simple display card)
  if (p.title && !p.children && !p.sections) return true;
  return false;
}

// Group consecutive metric-like Card sections into grids
function groupSections(sections: Section[]): Array<{ type: "single"; section: Section } | { type: "grid"; sections: Section[] }> {
  const groups: Array<{ type: "single"; section: Section } | { type: "grid"; sections: Section[] }> = [];
  let metricBuffer: Section[] = [];

  function flushMetrics() {
    if (metricBuffer.length >= 2) {
      groups.push({ type: "grid", sections: [...metricBuffer] });
    } else if (metricBuffer.length === 1) {
      groups.push({ type: "single", section: metricBuffer[0] });
    }
    metricBuffer = [];
  }

  for (const section of sections) {
    if (isMetricCard(section)) {
      metricBuffer.push(section);
    } else {
      flushMetrics();
      groups.push({ type: "single", section });
    }
  }
  flushMetrics();

  return groups;
}

function renderSections(sections: Section[], onNavigate: (screenId: string) => void) {
  const groups = groupSections(sections);

  return groups.map((group, groupIndex) => {
    if (group.type === "grid") {
      const cols = group.sections.length;
      const gridClass =
        cols === 2
          ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
          : cols === 3
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
      return (
        <div key={`grid-${groupIndex}`} className={gridClass}>
          {group.sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      );
    }
    return (
      <SectionRenderer
        key={group.section.id}
        section={group.section}
        onNavigate={onNavigate}
      />
    );
  });
}

export function WireframeRenderer({
  screen,
  screenSpec,
  onNavigate,
}: WireframeRendererProps) {
  const isSidebar = screen.layout === "sidebar";
  const navItems = screenSpec?.navigation?.items || [];

  if (isSidebar) {
    return (
      <div className="flex min-h-full overflow-hidden">
        {/* Sidebar mockup */}
        <div className="w-48 shrink-0 bg-card border-r border-border p-4 overflow-hidden">
          <div className="text-small font-semibold text-foreground mb-4">
            {screenSpec?.appName || "App"}
          </div>
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = getLucideIcon(item.icon);
              const isActive = item.screen === screen.id;
              return (
                <button
                  key={index}
                  onClick={() => onNavigate(item.screen)}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 text-small rounded-md transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-medium border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Main content */}
        <div className="flex-1 min-w-0 p-6">
          <div className="space-y-6 overflow-hidden">
            {renderSections(screen.sections, onNavigate)}
          </div>
        </div>
      </div>
    );
  }

  // Full layout (default)
  return (
    <div className="p-6 overflow-hidden">
      <div className="space-y-6 overflow-hidden">
        {renderSections(screen.sections, onNavigate)}
      </div>
    </div>
  );
}
