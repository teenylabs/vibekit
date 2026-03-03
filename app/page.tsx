import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-h1 text-foreground">VibeKit</h1>
      <p className="text-body text-muted-foreground">
        Design your app before you build it
      </p>

      <div className="flex gap-4">
        <Button size="lg">Primary Button</Button>
        <Button variant="secondary" size="lg">Secondary Button</Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-small text-muted-foreground">
            Card with border — swap the skin import in globals.css to see colors change
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
