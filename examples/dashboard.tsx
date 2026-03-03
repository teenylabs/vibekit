"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Search,
  MoreHorizontal,
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", isActive: true },
  { label: "Projects", icon: ListTodo, href: "/projects" },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    trend: "down" as const,
    icon: TrendingUp,
  },
  {
    title: "Avg. Order Value",
    value: "$59.40",
    change: "+$4.50",
    trend: "up" as const,
    icon: ArrowUpRight,
  },
];

const recentOrders = [
  {
    id: "ORD-7291",
    customer: "Olivia Martin",
    email: "olivia@example.com",
    initials: "OM",
    amount: "$1,999.00",
    status: "completed" as const,
    date: "Feb 20, 2026",
  },
  {
    id: "ORD-7290",
    customer: "Jackson Lee",
    email: "jackson@example.com",
    initials: "JL",
    amount: "$39.00",
    status: "processing" as const,
    date: "Feb 19, 2026",
  },
  {
    id: "ORD-7289",
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    initials: "IN",
    amount: "$299.00",
    status: "completed" as const,
    date: "Feb 19, 2026",
  },
  {
    id: "ORD-7288",
    customer: "William Kim",
    email: "will@example.com",
    initials: "WK",
    amount: "$99.00",
    status: "failed" as const,
    date: "Feb 18, 2026",
  },
  {
    id: "ORD-7287",
    customer: "Sofia Davis",
    email: "sofia@example.com",
    initials: "SD",
    amount: "$2,500.00",
    status: "pending" as const,
    date: "Feb 18, 2026",
  },
  {
    id: "ORD-7286",
    customer: "Liam Johnson",
    email: "liam@example.com",
    initials: "LJ",
    amount: "$150.00",
    status: "completed" as const,
    date: "Feb 17, 2026",
  },
];

const statusVariant = {
  completed: "success",
  processing: "default",
  pending: "outline",
  failed: "destructive",
} as const;

export default function DashboardExample() {
  return (
    <AppLayout navItems={navItems} appName="Acme Inc">
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your business metrics and recent activity."
          actions={[
            { label: "Download Report", variant: "outline" },
            { label: "Add Widget", variant: "default" },
          ]}
        />

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-small font-medium">
                  {metric.title}
                </CardDescription>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-h2 font-bold">{metric.value}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  {metric.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                  )}
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent orders table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  You have {recentOrders.length} orders this week.
                </CardDescription>
              </div>
              <div className="w-64">
                <Input placeholder="Search orders..." icon={Search} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{order.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-small font-medium">
                            {order.customer}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status]} size="sm">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.amount}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
