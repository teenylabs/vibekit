"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#", isActive: true },
  { label: "Projects", icon: FileText, href: "#" },
  { label: "Team", icon: Users, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

const metrics = [
  {
    label: "Total Projects",
    value: "12",
    trend: "+2 this week",
    trendVariant: "success" as const,
    trendIcon: TrendingUp,
  },
  {
    label: "Active Tasks",
    value: "48",
    trend: "3 overdue",
    trendVariant: "destructive" as const,
    trendIcon: TrendingDown,
  },
  {
    label: "Team Members",
    value: "8",
    trend: "1 pending",
    trendVariant: "warning" as const,
    trendIcon: Clock,
  },
  {
    label: "Completion Rate",
    value: "94%",
    trend: "+5% from last month",
    trendVariant: "success" as const,
    trendIcon: TrendingUp,
  },
];

const activities = [
  {
    initials: "SC",
    name: "Sarah Chen",
    action: "completed",
    target: "Design Review",
    time: "2 min ago",
  },
  {
    initials: "MJ",
    name: "Marcus Johnson",
    action: "commented on",
    target: "API Integration",
    time: "15 min ago",
  },
  {
    initials: "AL",
    name: "Aisha Lee",
    action: "created",
    target: "User Research Plan",
    time: "1 hour ago",
  },
  {
    initials: "TP",
    name: "Tom Park",
    action: "deployed",
    target: "v2.1.0 to production",
    time: "3 hours ago",
  },
  {
    initials: "RK",
    name: "Rachel Kim",
    action: "closed",
    target: "Bug #142: Login timeout",
    time: "5 hours ago",
  },
];

export default function LayoutTestPage() {
  return (
    <AppLayout navItems={navItems}>
      <PageHeader
        title="Dashboard"
        description="Overview of your projects and team activity."
        actions={[
          {
            label: "New Project",
            icon: <Plus className="mr-2 h-4 w-4" />,
          },
        ]}
      />

      {/* Metric Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <p className="text-small text-muted-foreground">
                  {metric.label}
                </p>
                <Badge variant={metric.trendVariant}>
                  {metric.trend}
                </Badge>
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activities.map((activity, index) => (
                <div key={activity.initials + activity.target}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {activity.initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="flex-1 text-small text-foreground">
                      <span className="font-medium">{activity.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badge Variant Showcase */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
