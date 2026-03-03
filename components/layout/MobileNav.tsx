import * as React from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./Sidebar";

export interface MobileNavProps extends React.HTMLAttributes<HTMLElement> {
  navItems: NavItem[];
}

const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>(
  ({ className, navItems, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card md:hidden",
          className
        )}
        {...props}
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-tiny font-medium transition-colors",
              item.isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    );
  }
);
MobileNav.displayName = "MobileNav";

export { MobileNav };
