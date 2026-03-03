"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  Calendar,
  Clock,
  Tag,
  MessageSquare,
  Paperclip,
  Link2,
  MoreHorizontal,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import type { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: ListTodo, href: "/projects", isActive: true },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const comments = [
  {
    id: "1",
    author: "Olivia Martin",
    initials: "OM",
    content:
      "I've finished the initial mockups for the hero section. The new layout reduces scroll depth by about 30%. Ready for review.",
    time: "2 hours ago",
  },
  {
    id: "2",
    author: "Jackson Lee",
    initials: "JL",
    content:
      "Looks great! One thing — can we test the CTA button with a secondary color variant? The current contrast might be too low on the warm-friendly skin.",
    time: "1 hour ago",
  },
  {
    id: "3",
    author: "Jane Doe",
    initials: "JD",
    content:
      "Good catch. I'll add a contrast check to the design-check linter so we catch this automatically going forward.",
    time: "45 min ago",
  },
];

const attachments = [
  { name: "hero-mockup-v2.fig", size: "4.2 MB" },
  { name: "conversion-analysis.pdf", size: "1.8 MB" },
  { name: "competitor-screenshots.zip", size: "12.4 MB" },
];

export default function DetailPageExample() {
  return (
    <AppLayout navItems={navItems} appName="Acme Inc">
      <div className="space-y-8">
        <PageHeader
          title="Website Redesign"
          description="Redesign the marketing website with new brand guidelines and improved conversion flows."
          backButton={{ href: "/projects" }}
          actions={[
            { label: "Edit", variant: "outline" },
            { label: "Delete", variant: "destructive" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content — 2 cols */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-small text-foreground">
                <p>
                  The current marketing site was built 2 years ago and no longer
                  reflects our brand positioning. Key goals for the redesign:
                </p>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    Improve above-the-fold messaging to highlight our core value
                    prop
                  </li>
                  <li>
                    Reduce page count from 12 to 6, consolidating redundant
                    content
                  </li>
                  <li>
                    Implement new brand colors and typography from the style
                    guide
                  </li>
                  <li>
                    Add social proof section with customer logos and
                    testimonials
                  </li>
                  <li>Achieve 90+ Lighthouse performance score on all pages</li>
                </ul>
                <p>
                  Timeline is 6 weeks. Design phase (weeks 1–2), development
                  (weeks 3–5), QA and launch (week 6).
                </p>
              </CardContent>
            </Card>

            {/* Activity / Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <MessageSquare className="h-4 w-4" />
                  Activity
                  <Badge variant="secondary" size="sm">
                    {comments.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {comments.map((comment, i) => (
                  <div key={comment.id}>
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          {comment.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-small font-medium">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.time}
                          </span>
                        </div>
                        <p className="mt-1 text-small text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    {i < comments.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
                <Separator />
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea placeholder="Write a comment..." />
                    <div className="flex justify-end">
                      <Button size="sm">Comment</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar info — 1 col */}
          <div className="space-y-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-small text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    Status
                  </span>
                  <Badge variant="default" size="sm">
                    Active
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-small text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    Priority
                  </span>
                  <Badge variant="destructive" size="sm">
                    High
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-small text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </span>
                  <span className="text-small font-medium">Mar 28, 2026</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-small text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Created
                  </span>
                  <span className="text-small text-muted-foreground">
                    Feb 14, 2026
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Jane Doe", role: "Project Lead", initials: "JD" },
                  { name: "Olivia Martin", role: "Designer", initials: "OM" },
                  { name: "Jackson Lee", role: "Developer", initials: "JL" },
                ].map((member) => (
                  <div
                    key={member.initials}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-small font-medium">
                        {member.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {attachments.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-small font-medium">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {file.size}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
