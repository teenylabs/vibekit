import Link from "next/link";

const examples = [
  { href: "/examples/dashboard", title: "Dashboard", description: "Metric cards + data table with badges" },
  { href: "/examples/settings", title: "Settings", description: "Tabs + forms + toggles" },
  { href: "/examples/list", title: "List Page", description: "Filterable card grid with search and pagination" },
  { href: "/examples/detail", title: "Detail Page", description: "Split layout with sidebar info and activity" },
  { href: "/examples/form", title: "Form Page", description: "Multi-section form with validation states" },
  { href: "/examples/empty-states", title: "Empty States", description: "Empty, loading, and error patterns" },
];

export default function ExamplesIndex() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-h1 font-bold">VibeKit Examples</h1>
      <p className="mt-2 text-body text-muted-foreground">
        Reference pages demonstrating VibeKit component patterns.
      </p>
      <nav className="mt-8 space-y-3">
        {examples.map((ex) => (
          <Link
            key={ex.href}
            href={ex.href}
            className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="text-small font-semibold">{ex.title}</div>
            <div className="text-xs text-muted-foreground">{ex.description}</div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
