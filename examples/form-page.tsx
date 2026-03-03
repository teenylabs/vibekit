"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  AlertCircle,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: ListTodo, href: "/projects", isActive: true },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function FormPageExample() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <AppLayout navItems={navItems} appName="Acme Inc">
      <div className="space-y-8">
        <PageHeader
          title="Create Project"
          description="Set up a new project for your team."
          backButton={{ href: "/projects" }}
        />

        <div className="max-w-2xl space-y-6">
          {/* Section 1: Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Basic Information
              </CardTitle>
              <CardDescription>
                Name and describe your project so your team understands its
                purpose.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g. Website Redesign"
                  defaultValue={submitted ? "Website Redesign" : ""}
                />
                {submitted && (
                  <p className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="h-3 w-3" />
                    Looks good
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectSlug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-small text-muted-foreground">
                    acmeinc.com/projects/
                  </span>
                  <Input
                    id="projectSlug"
                    placeholder="website-redesign"
                    defaultValue={submitted ? "website-redesign" : ""}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="What is this project about?"
                  defaultValue={
                    submitted
                      ? "Redesign the marketing website with new brand guidelines and improved conversion flows."
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Markdown is supported. This will appear on the project
                  overview.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Configuration
              </CardTitle>
              <CardDescription>
                Set priority, timeline, and team access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={submitted ? "high" : undefined}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={submitted ? "engineering" : undefined}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    defaultValue={submitted ? "2026-02-24" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">
                    Due Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    defaultValue={submitted ? "" : ""}
                  />
                  {submitted && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      Due date is required
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead">Project Lead</Label>
                <Select defaultValue={submitted ? "jane" : undefined}>
                  <SelectTrigger id="lead">
                    <SelectValue placeholder="Assign a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jane">Jane Doe</SelectItem>
                    <SelectItem value="olivia">Olivia Martin</SelectItem>
                    <SelectItem value="jackson">Jackson Lee</SelectItem>
                    <SelectItem value="william">William Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Access & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Access & Visibility
              </CardTitle>
              <CardDescription>
                Control who can see and contribute to this project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select defaultValue="team">
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public — visible to everyone
                    </SelectItem>
                    <SelectItem value="team">
                      Team — visible to team members
                    </SelectItem>
                    <SelectItem value="private">
                      Private — invite only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="flex items-start gap-3">
                  <Checkbox checked={true} />
                  <div>
                    <div className="text-small font-medium">
                      Allow comments from viewers
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Team members with view-only access can still leave
                      comments.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox checked={false} />
                  <div>
                    <div className="text-small font-medium">
                      Require approval for changes
                    </div>
                    <div className="text-xs text-muted-foreground">
                      All task updates must be approved by the project lead.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox checked={true} />
                  <div>
                    <div className="text-small font-medium">
                      Send activity digest
                    </div>
                    <div className="text-xs text-muted-foreground">
                      All members receive a daily summary of project changes.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => setSubmitted(true)}>Create Project</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
