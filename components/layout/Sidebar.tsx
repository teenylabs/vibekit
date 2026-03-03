"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu, X, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  isActive?: boolean;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  navItems: NavItem[];
  appName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, navItems, appName = "AppName", isOpen, onClose, ...props }, ref) => {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}

        <aside
          ref={ref}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-sidebar flex-col border-r border-border bg-card",
            "transition-transform duration-200 ease-in-out",
            "md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
          {...props}
        >
          {/* Logo area */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="text-body font-semibold text-foreground">
              {appName}
            </span>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-small font-medium transition-colors",
                  item.isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
