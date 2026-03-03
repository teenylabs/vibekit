import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    variant?: ButtonProps["variant"];
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="mt-4 text-h3 text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-small text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button
          className="mt-6"
          variant={action.variant ?? "default"}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
