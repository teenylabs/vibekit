"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  Search,
  Plus,
  Calendar,
  Star,
  ExternalLink,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: ListTodo, href: "/projects", isActive: true },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const projects = [
  {
    id: "1",
    name: "Website Redesign",
    description:
      "Redesign the marketing website with new brand guidelines and improved conversion flows.",
    status: "active" as const,
    priority: "high" as const,
    members: ["AK", "SM", "JD"],
    starred: true,
    updatedAt: "2 hours ago",
    tasksComplete: 12,
    tasksTotal: 18,
  },
  {
    id: "2",
    name: "Mobile App v2",
    description:
      "Ship the next major version with offline support and push notifications.",
    status: "active" as const,
    priority: "high" as const,
    members: ["LJ", "IN"],
    starred: true,
    updatedAt: "5 hours ago",
    tasksComplete: 34,
    tasksTotal: 52,
  },
  {
    id: "3",
    name: "API Documentation",
    description:
      "Create comprehensive API docs with examples and interactive playground.",
    status: "active" as const,
    priority: "medium" as const,
    members: ["WK"],
    starred: false,
    updatedAt: "1 day ago",
    tasksComplete: 8,
    tasksTotal: 15,
  },
  {
    id: "4",
    name: "Design System Audit",
    description:
      "Review and consolidate component variants, fix inconsistencies across the design system.",
    status: "pending" as const,
    priority: "medium" as const,
    members: ["SD", "OM"],
    starred: false,
    updatedAt: "2 days ago",
    tasksComplete: 0,
    tasksTotal: 9,
  },
  {
    id: "5",
    name: "Q1 Analytics Dashboard",
    description:
      "Build an analytics dashboard for monitoring Q1 business metrics and KPIs.",
    status: "done" as const,
    priority: "low" as const,
    members: ["AK", "JD", "LJ"],
    starred: false,
    updatedAt: "1 week ago",
    tasksComplete: 22,
    tasksTotal: 22,
  },
  {
    id: "6",
    name: "Email Integration",
    description:
      "Integrate transactional and marketing email services with templates.",
    status: "active" as const,
    priority: "low" as const,
    members: ["IN", "WK"],
    starred: false,
    updatedAt: "3 days ago",
    tasksComplete: 5,
    tasksTotal: 11,
  },
];

const statusVariant = {
  active: "default",
  pending: "outline",
  done: "success",
} as const;

const priorityVariant = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
} as const;

export default function ListPageExample() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const perPage = 4;

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <AppLayout navItems={navItems} appName="Acme Inc">
      <div className="space-y-8">
        <PageHeader
          title="Projects"
          description="Browse and manage all your team projects."
          actions={[
            {
              label: "New Project",
              variant: "default",
              icon: <Plus className="mr-2 h-4 w-4" />,
            },
          ]}
        />

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-48">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Card grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {paginated.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      {project.name}
                      {project.starred && (
                        <Star className="h-4 w-4 fill-warning text-warning" />
                      )}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusVariant[project.status]} size="sm">
                    {project.status}
                  </Badge>
                  <Badge variant={priorityVariant[project.priority]} size="sm">
                    {project.priority}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>
                      {project.tasksComplete}/{project.tasksTotal} tasks
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{
                        width: `${(project.tasksComplete / project.tasksTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <div className="flex -space-x-2">
                  {project.members.map((initials) => (
                    <Avatar
                      key={initials}
                      className="h-7 w-7 border-2 border-card"
                    >
                      <AvatarFallback className="text-[10px]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {project.updatedAt}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-small text-muted-foreground">
              Showing {(currentPage - 1) * perPage + 1}–
              {Math.min(currentPage * perPage, filtered.length)} of{" "}
              {filtered.length} projects
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
