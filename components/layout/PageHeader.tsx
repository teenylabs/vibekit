import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderAction {
  label: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
  backButton?: {
    href?: string;
    onClick?: () => void;
  };
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, backButton, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {backButton && (
              <a href={backButton.href} onClick={backButton.onClick}>
                <Button variant="ghost" size="icon" className="mt-0.5 shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Go back</span>
                </Button>
              </a>
            )}
            <div className="space-y-1">
              <h1 className="text-h2 text-foreground">{title}</h1>
              {description && (
                <p className="text-body text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant ?? "default"}
                  size={action.size ?? "default"}
                  className={action.className}
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <Separator />
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
