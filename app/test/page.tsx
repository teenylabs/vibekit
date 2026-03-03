import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Star, User, Bell, Heart } from "lucide-react";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-12 max-w-5xl mx-auto">
      <h1 className="text-h1">VibeKit Component Test</h1>
      <p className="text-muted-foreground">
        Visual verification of all Batch 1 UI components with active skin.
      </p>

      <Separator />

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-h2">Button</h2>

        <div>
          <h3 className="text-h3 mb-3">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div>
          <h3 className="text-h3 mb-3">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-h3 mb-3">Disabled</h3>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled Default</Button>
            <Button variant="outline" disabled>
              Disabled Outline
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-h2">Badge</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="text-h2">Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                Card description with muted foreground text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here. This shows the card body area.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm" className="ml-auto">
                Save
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metric Card</CardTitle>
              <CardDescription>Monthly revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-h1">$12,450</p>
              <p className="text-small text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Inputs */}
      <section className="space-y-6">
        <h2 className="text-h2">Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="basic">Basic Input</Label>
            <Input id="basic" placeholder="Type something..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">With Icon</Label>
            <Input id="search" placeholder="Search..." icon={Search} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" placeholder="Can't type here" disabled />
          </div>
        </div>
      </section>

      <Separator />

      {/* Label */}
      <section className="space-y-6">
        <h2 className="text-h2">Label</h2>
        <div className="flex gap-6">
          <Label>Default Label</Label>
          <Label className="text-muted-foreground">Muted Label</Label>
        </div>
      </section>

      <Separator />

      {/* Separator */}
      <section className="space-y-6">
        <h2 className="text-h2">Separator</h2>
        <div className="space-y-4">
          <p className="text-small">Horizontal separator below:</p>
          <Separator />
          <div className="flex items-center gap-4 h-8">
            <span>Left</span>
            <Separator orientation="vertical" />
            <span>Center</span>
            <Separator orientation="vertical" />
            <span>Right</span>
          </div>
        </div>
      </section>

      <Separator />

      {/* Skeleton */}
      <section className="space-y-6">
        <h2 className="text-h2">Skeleton</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Avatar */}
      <section className="space-y-6">
        <h2 className="text-h2">Avatar</h2>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-body">LG</AvatarFallback>
          </Avatar>

          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-tiny">SM</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <Separator />

      {/* Combined Example */}
      <section className="space-y-6">
        <h2 className="text-h2">Combined Example</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Badge variant="success">Active</Badge>
              <Badge variant="secondary">Pro Plan</Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" icon={User} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif">Notifications</Label>
              <Input
                id="notif"
                placeholder="Search notifications..."
                icon={Bell}
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </section>

      <div className="h-12" />
    </div>
  );
}
