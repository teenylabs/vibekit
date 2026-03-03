"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar, type NavItem } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Menu } from "lucide-react";

export interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  navItems: NavItem[];
  appName?: string;
  children: React.ReactNode;
}

const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ className, navItems, appName = "AppName", children, ...props }, ref) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
      <div ref={ref} className={cn("min-h-screen bg-background", className)} {...props}>
        <Sidebar
          navItems={navItems}
          appName={appName}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile header with hamburger */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </button>
          <span className="text-small font-semibold text-foreground">
            {appName}
          </span>
        </div>

        {/* Main content area */}
        <main className="md:pl-sidebar">
          <div className="mx-auto max-w-6xl p-4 pb-20 md:p-6 md:pb-6">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <MobileNav navItems={navItems} />
      </div>
    );
  }
);
AppLayout.displayName = "AppLayout";

export { AppLayout };
