"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  CreditCard,
  Upload,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: ListTodo, href: "/projects" },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings", isActive: true },
];

export default function SettingsExample() {
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [pushNotifs, setPushNotifs] = React.useState(false);
  const [marketingEmails, setMarketingEmails] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [securityAlerts, setSecurityAlerts] = React.useState(true);

  return (
    <AppLayout navItems={navItems} appName="Acme Inc">
      <div className="space-y-8">
        <PageHeader
          title="Settings"
          description="Manage your account settings and preferences."
        />

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and public profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-body">JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                  </div>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Jane" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="jane@acmeinc.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      defaultValue="Product designer based in San Francisco. I enjoy building tools that help teams work better together."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">
                          Pacific Time (US & Canada)
                        </SelectItem>
                        <SelectItem value="mst">
                          Mountain Time (US & Canada)
                        </SelectItem>
                        <SelectItem value="cst">
                          Central Time (US & Canada)
                        </SelectItem>
                        <SelectItem value="est">
                          Eastern Time (US & Canada)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t pt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-small font-medium">
                      Email Notifications
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Receive email updates about your account activity.
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifs}
                    onCheckedChange={setEmailNotifs}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-small font-medium">
                      Push Notifications
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Receive push notifications in your browser.
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifs}
                    onCheckedChange={setPushNotifs}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-small font-medium">
                      Marketing Emails
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Receive emails about new features and product updates.
                    </div>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-small font-medium">Weekly Digest</div>
                    <div className="text-xs text-muted-foreground">
                      A weekly summary of your team&apos;s activity.
                    </div>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-small font-medium">
                      Security Alerts
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Get notified about unusual sign-in activity.
                    </div>
                  </div>
                  <Switch
                    checked={securityAlerts}
                    onCheckedChange={setSecurityAlerts}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Current Plan
                      </CardTitle>
                      <CardDescription>
                        You are currently on the Pro plan.
                      </CardDescription>
                    </div>
                    <Badge variant="default">Pro</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-h1 font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-small text-muted-foreground">
                    Includes unlimited projects, 50 GB storage, and priority
                    support. Renews on March 15, 2026.
                  </p>
                </CardContent>
                <CardFooter className="gap-2 border-t pt-6">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="ghost" className="text-destructive">
                    Cancel Subscription
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Manage your payment details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-16 items-center justify-center rounded-md border bg-muted">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-small font-medium">
                        Visa ending in 4242
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expires 12/2027
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button variant="outline">Update Payment Method</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
