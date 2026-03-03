"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionRenderer } from "../SectionRenderer";
import type { Section } from "@/lib/spec-types";

interface TabsRendererProps {
  section: Section;
  onNavigate: (screenId: string) => void;
}

export function TabsRenderer({ section, onNavigate }: TabsRendererProps) {
  const props = section.props || {};
  const tabs: any[] = props.tabs || props.items || [];

  if (tabs.length === 0) {
    return (
      <Tabs defaultValue="tab-0">
        <TabsList>
          <TabsTrigger value="tab-0">General</TabsTrigger>
          <TabsTrigger value="tab-1">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-0">
          <p className="text-small text-muted-foreground p-4">Tab content placeholder</p>
        </TabsContent>
        <TabsContent value="tab-1">
          <p className="text-small text-muted-foreground p-4">Advanced settings placeholder</p>
        </TabsContent>
      </Tabs>
    );
  }

  const defaultTab = tabs[0]?.id || tabs[0]?.value || "tab-0";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        {tabs.map((tab: any, index: number) => {
          const value = tab?.id || tab?.value || `tab-${index}`;
          return (
            <TabsTrigger key={value} value={value}>
              {tab?.label || tab?.name || tab?.title || `Tab ${index + 1}`}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab: any, index: number) => {
        const value = tab?.id || tab?.value || `tab-${index}`;
        return (
          <TabsContent key={value} value={value}>
            <div className="space-y-4">
              {renderTabContent(tab, index, onNavigate)}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function renderTabContent(
  tab: any,
  tabIndex: number,
  onNavigate: (screenId: string) => void
): React.ReactNode {
  const content = tab?.content;

  // String content
  if (typeof content === "string") {
    return (
      <p className="text-small text-muted-foreground p-4">{content}</p>
    );
  }

  // Object with component key — route through SectionRenderer
  if (content && typeof content === "object" && !Array.isArray(content) && content.component) {
    const childSection: Section = {
      id: content.id || `tab-content-${tabIndex}`,
      component: content.component,
      props: content.props || {},
    };
    return <SectionRenderer section={childSection} onNavigate={onNavigate} />;
  }

  // Object with fields array (form-like) — render as Form
  if (content && typeof content === "object" && !Array.isArray(content) && content.fields) {
    const formSection: Section = {
      id: `tab-form-${tabIndex}`,
      component: "Form",
      props: content,
    };
    return <SectionRenderer section={formSection} onNavigate={onNavigate} />;
  }

  // Array of items
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((child: any, childIndex: number) =>
          renderContentItem(child, `tab-${tabIndex}-child-${childIndex}`, onNavigate)
        )}
      </>
    );
  }

  // Tab has sections array (alternative AI format)
  if (Array.isArray(tab?.sections)) {
    return (
      <>
        {tab.sections.map((child: any, childIndex: number) =>
          renderContentItem(child, `tab-${tabIndex}-section-${childIndex}`, onNavigate)
        )}
      </>
    );
  }

  // Fallback — show description or placeholder text
  const fallbackText = tab?.description || `Content for ${tab?.label || tab?.name || `Tab ${tabIndex + 1}`}`;
  return (
    <p className="text-small text-muted-foreground p-4">{fallbackText}</p>
  );
}

function renderContentItem(
  child: any,
  key: string,
  onNavigate: (screenId: string) => void
): React.ReactNode {
  if (typeof child === "string") {
    return <p key={key} className="text-small text-muted-foreground">{child}</p>;
  }

  if (child && typeof child === "object" && child.component) {
    const childSection: Section = {
      id: child.id || key,
      component: child.component,
      props: child.props || {},
    };
    return (
      <div key={key}>
        <SectionRenderer section={childSection} onNavigate={onNavigate} />
      </div>
    );
  }

  // Unknown shape — generic fallback
  if (child && typeof child === "object") {
    const fallbackSection: Section = {
      id: key,
      component: "Generic",
      props: { description: JSON.stringify(child).slice(0, 100) },
    };
    return (
      <div key={key}>
        <SectionRenderer section={fallbackSection} onNavigate={onNavigate} />
      </div>
    );
  }

  return null;
}
