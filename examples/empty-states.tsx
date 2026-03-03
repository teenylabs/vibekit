"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  Inbox,
  FileText,
  Search,
  WifiOff,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: ListTodo, href: "/projects", isActive: true },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

function SkeletonMetricCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SkeletonTable() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Status", "Priority", "Updated"].map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function EmptyStatesExample() {
  return (
    <AppLayout navItems={navItems} appName="Acme Inc">
      <div className="space-y-8">
        <PageHeader
          title="Empty & Loading States"
          description="Reference patterns for empty, loading, and error states across common layouts."
        />

        {/* Section 1: Empty States */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Empty States</h2>
          <p className="text-small text-muted-foreground">
            Shown when a list, table, or section has no data yet.
          </p>
          <Separator />

          <div className="grid gap-6 lg:grid-cols-2">
            <EmptyState
              icon={Inbox}
              title="No projects yet"
              description="Create your first project to get started organizing your team's work."
              action={{
                label: "Create Project",
                onClick: () => {},
              }}
            />

            <EmptyState
              icon={Search}
              title="No results found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={{
                label: "Clear Filters",
                onClick: () => {},
                variant: "outline",
              }}
            />

            <EmptyState
              icon={FileText}
              title="No documents"
              description="Upload or create documents to share with your team."
              action={{
                label: "Upload Document",
                onClick: () => {},
              }}
            />

            <EmptyState
              icon={Users}
              title="No team members"
              description="Invite your colleagues to collaborate on this project."
              action={{
                label: "Invite People",
                onClick: () => {},
              }}
            />
          </div>
        </div>

        {/* Section 2: Loading States */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Loading States (Skeleton)</h2>
          <p className="text-small text-muted-foreground">
            Skeleton screens shown while data is being fetched. These match the
            shape of the content they replace.
          </p>
          <Separator />

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-small font-medium text-muted-foreground">
                Metric Cards Loading
              </h3>
              <SkeletonMetricCards />
            </div>

            <div>
              <h3 className="mb-3 text-small font-medium text-muted-foreground">
                Content Card Loading
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-small font-medium text-muted-foreground">
                Table Loading
              </h3>
              <SkeletonTable />
            </div>

            <div>
              <h3 className="mb-3 text-small font-medium text-muted-foreground">
                Detail Page Sidebar Loading
              </h3>
              <Card className="max-w-sm">
                <CardHeader>
                  <Skeleton className="h-5 w-20" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Section 3: Error States */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Error States</h2>
          <p className="text-small text-muted-foreground">
            Shown when something goes wrong. Persistent errors use Alert;
            transient errors use Toast (see Toast component).
          </p>
          <Separator />

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Failed to load projects</AlertTitle>
              <AlertDescription>
                We couldn&apos;t fetch your project list. Check your network
                connection and try again.
              </AlertDescription>
            </Alert>

            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertTitle>You&apos;re offline</AlertTitle>
              <AlertDescription>
                Some features may be unavailable. Changes will sync when
                you&apos;re back online.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="mt-4 text-h3 font-semibold">
                  Something went wrong
                </h3>
                <p className="mt-2 max-w-sm text-small text-muted-foreground">
                  An unexpected error occurred while loading this page. Our team
                  has been notified.
                </p>
                <Button variant="outline" className="mt-6">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
