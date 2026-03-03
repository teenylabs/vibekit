"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { ToastProvider, useToast } from "@/components/ui/toast";
import {
  MoreHorizontal,
  AlertCircle,
  Terminal,
  Inbox,
  User,
  Mail,
} from "lucide-react";

function InteractiveContent() {
  const { toast } = useToast();
  const [switchOn, setSwitchOn] = React.useState(false);
  const [checkA, setCheckA] = React.useState(true);
  const [checkB, setCheckB] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-12 max-w-5xl mx-auto">
      <h1 className="text-h1">Interactive Components Test</h1>
      <p className="text-muted-foreground">
        Dialog, Sheet, Toast, Tabs, Select, Dropdown, and more — all with
        smooth transitions.
      </p>

      <Separator />

      {/* Dialog */}
      <section className="space-y-4">
        <h2 className="text-h2">Dialog</h2>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input id="task-title" placeholder="Enter task title..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-desc">Description</Label>
                  <Textarea
                    id="task-desc"
                    placeholder="Describe the task..."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Create Task</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Confirmation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  item and remove all associated data.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive">Delete</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Separator />

      {/* Sheet */}
      <section className="space-y-4">
        <h2 className="text-h2">Sheet</h2>
        <div className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet (Right)</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Task Details</SheetTitle>
                <SheetDescription>
                  View and edit task information.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheet-name">Name</Label>
                  <Input
                    id="sheet-name"
                    defaultValue="Design system components"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheet-notes">Notes</Label>
                  <Textarea
                    id="sheet-notes"
                    defaultValue="Build all 20 UI components following shadcn patterns."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button>Save Changes</Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet (Left)</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Browse app sections.</SheetDescription>
              </SheetHeader>
              <div className="space-y-2 mt-6">
                {["Dashboard", "Tasks", "Settings", "Profile"].map((item) => (
                  <div
                    key={item}
                    className="rounded-md px-3 py-2 text-small hover:bg-accent cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <Separator />

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="text-h2">Toast</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              toast({
                title: "Task created",
                description: "Your new task has been added successfully.",
              })
            }
          >
            Default Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                title: "Changes saved",
                description: "Your profile has been updated.",
                variant: "success",
              })
            }
          >
            Success Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
              })
            }
          >
            Destructive Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast({ title: "First notification" });
              setTimeout(
                () => toast({ title: "Second notification", variant: "success" }),
                300
              );
              setTimeout(
                () =>
                  toast({
                    title: "Third notification",
                    variant: "destructive",
                  }),
                600
              );
            }}
          >
            Stack Multiple
          </Button>
        </div>
      </section>

      <Separator />

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-h2">Tabs</h2>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <h3 className="text-h3">Profile Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tab-name">Name</Label>
                  <Input id="tab-name" defaultValue="Jane Smith" icon={User} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tab-email">Email</Label>
                  <Input
                    id="tab-email"
                    defaultValue="jane@example.com"
                    icon={Mail}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tab-bio">Bio</Label>
                <Textarea
                  id="tab-bio"
                  defaultValue="Product designer and indie hacker."
                />
              </div>
              <Button>Save Profile</Button>
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <h3 className="text-h3">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-small font-medium">
                      Email notifications
                    </p>
                    <p className="text-tiny text-muted-foreground">
                      Receive updates about your tasks
                    </p>
                  </div>
                  <Switch
                    checked={switchOn}
                    onCheckedChange={setSwitchOn}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-small font-medium">
                      Push notifications
                    </p>
                    <p className="text-tiny text-muted-foreground">
                      Browser push alerts for urgent items
                    </p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="billing">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <h3 className="text-h3">Billing & Plan</h3>
              <div className="flex items-center gap-2">
                <Badge variant="default">Pro Plan</Badge>
                <span className="text-small text-muted-foreground">
                  $12/month
                </span>
              </div>
              <p className="text-small text-muted-foreground">
                Your next billing date is March 1, 2026.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="ghost">Cancel Subscription</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Select */}
      <section className="space-y-4">
        <h2 className="text-h2">Select</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
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
            <Label>Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="alex">Alex Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Dropdown Menu */}
      <section className="space-y-4">
        <h2 className="text-h2">Dropdown Menu</h2>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <Separator />

      {/* Switch & Checkbox */}
      <section className="space-y-4">
        <h2 className="text-h2">Switch & Checkbox</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-lg border border-border p-6">
            <h3 className="text-h3">Switches</h3>
            <div className="flex items-center justify-between">
              <Label>Dark mode</Label>
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Always on</Label>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Disabled</Label>
              <Switch disabled />
            </div>
          </div>
          <div className="space-y-4 rounded-lg border border-border p-6">
            <h3 className="text-h3">Checkboxes</h3>
            <div className="flex items-center gap-2">
              <Checkbox checked={checkA} onCheckedChange={setCheckA} />
              <Label>Accept terms and conditions</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={checkB} onCheckedChange={setCheckB} />
              <Label>Subscribe to newsletter</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox disabled />
              <Label className="opacity-50">Disabled option</Label>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Table */}
      <section className="space-y-4">
        <h2 className="text-h2">Table</h2>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  task: "Design system components",
                  status: "success",
                  statusLabel: "Done",
                  priority: "warning",
                  priorityLabel: "High",
                  date: "Feb 21, 2026",
                },
                {
                  task: "Layout components",
                  status: "default",
                  statusLabel: "Active",
                  priority: "warning",
                  priorityLabel: "High",
                  date: "Feb 22, 2026",
                },
                {
                  task: "Example pages",
                  status: "outline",
                  statusLabel: "Pending",
                  priority: "secondary",
                  priorityLabel: "Medium",
                  date: "Feb 23, 2026",
                },
                {
                  task: "Design companion",
                  status: "outline",
                  statusLabel: "Pending",
                  priority: "secondary",
                  priorityLabel: "Low",
                  date: "Feb 28, 2026",
                },
              ].map((row) => (
                <TableRow key={row.task} className="cursor-pointer">
                  <TableCell className="font-medium">{row.task}</TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      variant={
                        row.status as
                          | "default"
                          | "success"
                          | "outline"
                          | "secondary"
                          | "warning"
                          | "destructive"
                      }
                    >
                      {row.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      variant={
                        row.priority as
                          | "default"
                          | "success"
                          | "outline"
                          | "secondary"
                          | "warning"
                          | "destructive"
                      }
                    >
                      {row.priorityLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator />

      {/* Alert */}
      <section className="space-y-4">
        <h2 className="text-h2">Alert</h2>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can use the design-check linter to catch theme violations.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            3 raw Tailwind colors detected. Run npm run design-check for
            details.
          </AlertDescription>
        </Alert>
      </section>

      <Separator />

      {/* Empty State */}
      <section className="space-y-4">
        <h2 className="text-h2">Empty State</h2>
        <EmptyState
          icon={Inbox}
          title="No tasks yet"
          description="Add your first task to get started. Tasks help you organize your work and track progress."
          action={{
            label: "Create Task",
            onClick: () =>
              toast({
                title: "Coming soon",
                description: "Task creation will be available in the next update.",
              }),
          }}
        />
      </section>

      <div className="h-12" />
    </div>
  );
}

export default function InteractiveTestPage() {
  return (
    <ToastProvider>
      <InteractiveContent />
    </ToastProvider>
  );
}
