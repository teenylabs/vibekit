/**
 * VibeKit Design Linter
 * Scans .tsx files in app/ for design system violations.
 * Excludes components/ui/ and components/layout/ (they ARE the design system).
 *
 * Run: npm run design-check
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..");
const APP_DIR = path.join(ROOT, "app");
const EXAMPLES_DIR = path.join(ROOT, "examples");

const EXCLUDE_DIRS = [
  path.join(ROOT, "components", "ui"),
  path.join(ROOT, "components", "layout"),
  path.join(ROOT, "node_modules"),
  path.join(ROOT, "app", "test"), // component test pages, not production code
];

interface Violation {
  file: string;
  line: number;
  rule: string;
  message: string;
  suggestion: string;
}

// Collect all .tsx files under the given directories, excluding EXCLUDE_DIRS
function collectFiles(dirs: string[]): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDE_DIRS.some((ex) => full.startsWith(ex))) {
          walk(full);
        }
      } else if (entry.name.endsWith(".tsx")) {
        files.push(full);
      }
    }
  }

  for (const dir of dirs) walk(dir);
  return files.sort();
}

// Rule 1: Raw Tailwind colors (bg-red-500, text-blue-600, border-green-300, etc.)
const RAW_COLOR_REGEX =
  /\b(?:bg|text|border|ring|outline|shadow|from|via|to|fill|stroke|accent|caret|decoration)-(?:red|blue|green|yellow|orange|purple|pink|indigo|violet|teal|cyan|lime|amber|emerald|fuchsia|rose|sky|slate|gray|zinc|neutral|stone)-\d{2,3}\b/g;

// Rule 4: Raw font sizes outside component definitions
const RAW_FONT_SIZE_REGEX = /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])\b/g;

// Allowed raw font sizes in contexts like text-xs for helper text (common pattern)
// We'll flag them but with a softer message

function checkFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = path.relative(ROOT, filePath);

  // Check if this is a page file (for AppLayout check)
  const isPageFile = filePath.endsWith("/page.tsx");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip imports and comments
    if (line.trimStart().startsWith("import ") || line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) {
      continue;
    }

    // Rule 1: Raw Tailwind colors
    let match;
    RAW_COLOR_REGEX.lastIndex = 0;
    while ((match = RAW_COLOR_REGEX.exec(line)) !== null) {
      violations.push({
        file: relPath,
        line: lineNum,
        rule: "raw-color",
        message: `Raw Tailwind color "${match[0]}" — use theme tokens instead`,
        suggestion: `Replace with theme color: bg-primary, text-muted-foreground, border-border, etc.`,
      });
    }

    // Rule 4: Raw font sizes (flag text-[Npx] and most raw sizes, but skip text-xs which is common)
    RAW_FONT_SIZE_REGEX.lastIndex = 0;
    while ((match = RAW_FONT_SIZE_REGEX.exec(line)) !== null) {
      const value = match[0];
      // Allow text-xs (very common for small helper text) and text-base
      if (value === "text-xs" || value === "text-base") continue;
      // Only flag if it looks like it's in a className string (rough heuristic)
      if (line.includes("className") || line.includes("class=") || line.includes("`")) {
        violations.push({
          file: relPath,
          line: lineNum,
          rule: "raw-font-size",
          message: `Raw font size "${value}" — use typography tokens instead`,
          suggestion: `Use text-h1, text-h2, text-h3, text-body, text-small, or text-tiny`,
        });
      }
    }

    // Rule 5: Inline styles (allow dynamic width for progress bars)
    if (/style\s*=\s*\{\{/.test(line)) {
      const context = lines.slice(i, Math.min(i + 3, lines.length)).join(" ");
      const isDynamicWidth = /style\s*=\s*\{\{\s*width\s*:/.test(context);
      if (!isDynamicWidth) {
        violations.push({
          file: relPath,
          line: lineNum,
          rule: "inline-style",
          message: `Inline style attribute — use Tailwind classes instead`,
          suggestion: `Move styling to className with Tailwind utilities or theme tokens`,
        });
      }
    }

    // Rule 3: Badge without variant prop
    if (/<Badge\b/.test(line) && !line.includes("variant=") && !line.includes("variant =")) {
      // Check if variant is on the next few lines (multi-line JSX)
      const nextLines = lines.slice(i, Math.min(i + 5, lines.length)).join(" ");
      if (!nextLines.includes("variant=") && !nextLines.includes("variant =")) {
        violations.push({
          file: relPath,
          line: lineNum,
          rule: "badge-no-variant",
          message: `<Badge> without explicit variant prop`,
          suggestion: `Add variant="default", "secondary", "destructive", "success", "warning", or "outline"`,
        });
      }
    }
  }

  // Rule 2: Page files missing AppLayout
  if (isPageFile) {
    // Skip layout files, examples index, test pages, and the root landing page
    const isExcludedPage =
      filePath.includes("layout.tsx") ||
      relPath.includes("app/examples/page.tsx") ||
      relPath.includes("app/test/") ||
      relPath === "app/page.tsx";
    if (!isExcludedPage) {
      const hasAppLayoutImport = content.includes("AppLayout") || content.includes("@/components/layout/AppLayout");
      // Also check if it re-exports from examples (which use AppLayout)
      const reExportsExample = /import\s+\w+\s+from\s+["']@\/examples\//.test(content);
      if (!hasAppLayoutImport && !reExportsExample) {
        violations.push({
          file: relPath,
          line: 1,
          rule: "missing-app-layout",
          message: `Page file does not use AppLayout wrapper`,
          suggestion: `Wrap page content in <AppLayout navItems={...}> from @/components/layout/AppLayout`,
        });
      }
    }
  }

  return violations;
}

function main() {
  console.log("=== VibeKit Design Check ===\n");

  const files = collectFiles([APP_DIR, EXAMPLES_DIR]);
  console.log(`Scanning ${files.length} .tsx files...\n`);

  let allViolations: Violation[] = [];

  for (const file of files) {
    const violations = checkFile(file);
    allViolations = allViolations.concat(violations);
  }

  if (allViolations.length === 0) {
    console.log("No violations found. Design system is clean.");
    process.exit(0);
  }

  // Group by rule
  const byRule = new Map<string, Violation[]>();
  for (const v of allViolations) {
    if (!byRule.has(v.rule)) byRule.set(v.rule, []);
    byRule.get(v.rule)!.push(v);
  }

  for (const [rule, violations] of byRule) {
    console.log(`[${rule}] ${violations.length} violation(s):`);
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line} — ${v.message}`);
      console.error(`    → ${v.suggestion}`);
    }
    console.log("");
  }

  console.error(
    `\nDesign check FAILED — ${allViolations.length} violation(s) found. Fix them to stay consistent with the design system.`
  );
  process.exit(1);
}

main();
