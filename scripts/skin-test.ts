/**
 * Skin consistency & compatibility checker
 *
 * Part 1: Ensures all skin CSS files define the exact same set of CSS variables
 *         in both :root and .dark scopes.
 * Part 2: Ensures every CSS variable referenced by components and globals.css
 *         is defined in every skin.
 *
 * Run: npm run skin-test
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..");
const SKINS_DIR = path.join(ROOT, "styles", "skins");
const COMPONENTS_UI_DIR = path.join(ROOT, "components", "ui");
const COMPONENTS_LAYOUT_DIR = path.join(ROOT, "components", "layout");
const GLOBALS_CSS = path.join(ROOT, "app", "globals.css");

interface SkinVars {
  root: Set<string>;
  dark: Set<string>;
}

function extractSkinVariables(css: string): SkinVars {
  const root = new Set<string>();
  const dark = new Set<string>();

  const blockRegex = /([:.][\w-]+)\s*\{([^}]*)}/g;
  let match;

  while ((match = blockRegex.exec(css)) !== null) {
    const selector = match[1];
    const body = match[2];
    const target = selector === ".dark" ? dark : root;

    const varMatches = body.matchAll(/--([a-zA-Z0-9-]+)\s*:/g);
    for (const vm of varMatches) {
      target.add(`--${vm[1]}`);
    }
  }

  return { root, dark };
}

function collectFiles(dir: string, ext: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Extract CSS variable references from component source files.
 * Matches patterns like: var(--variable-name), hsl(var(--variable-name))
 * and Tailwind theme references in tailwind.config like 'hsl(var(--primary))'
 */
function extractReferencedVariables(files: string[]): Set<string> {
  const vars = new Set<string>();
  const varRefRegex = /var\(\s*--([\w-]+)\s*\)/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    let match;
    varRefRegex.lastIndex = 0;
    while ((match = varRefRegex.exec(content)) !== null) {
      vars.add(`--${match[1]}`);
    }
  }

  return vars;
}

function main() {
  console.log("=== VibeKit Skin Test ===\n");

  // --- Part 1: Skin-to-skin consistency ---

  const skinFiles = fs
    .readdirSync(SKINS_DIR)
    .filter((f) => f.endsWith(".css"))
    .sort();

  if (skinFiles.length === 0) {
    console.error("No skin files found in", SKINS_DIR);
    process.exit(1);
  }

  console.log(`Part 1: Skin consistency (${skinFiles.length} skins)\n`);

  const skins = new Map<string, SkinVars>();
  for (const file of skinFiles) {
    const css = fs.readFileSync(path.join(SKINS_DIR, file), "utf-8");
    skins.set(file, extractSkinVariables(css));
    console.log(
      `  ${file}: ${skins.get(file)!.root.size} :root vars, ${skins.get(file)!.dark.size} .dark vars`
    );
  }

  console.log("");

  const allRootVars = new Set<string>();
  const allDarkVars = new Set<string>();
  for (const vars of skins.values()) {
    for (const v of vars.root) allRootVars.add(v);
    for (const v of vars.dark) allDarkVars.add(v);
  }

  let hasErrors = false;

  // Check each skin defines all variables
  for (const [file, vars] of skins) {
    for (const v of allRootVars) {
      if (!vars.root.has(v)) {
        console.error(`MISSING  :root  ${v}  in ${file}`);
        hasErrors = true;
      }
    }
    for (const v of allDarkVars) {
      if (!vars.dark.has(v)) {
        console.error(`MISSING  .dark  ${v}  in ${file}`);
        hasErrors = true;
      }
    }
  }

  // Check :root vs .dark consistency within each skin
  for (const [file, vars] of skins) {
    for (const v of vars.root) {
      if (!vars.dark.has(v)) {
        console.error(
          `MISMATCH  ${v}  in ${file}: present in :root but missing in .dark`
        );
        hasErrors = true;
      }
    }
    for (const v of vars.dark) {
      if (!vars.root.has(v)) {
        console.error(
          `MISMATCH  ${v}  in ${file}: present in .dark but missing in :root`
        );
        hasErrors = true;
      }
    }
  }

  if (!hasErrors) {
    console.log(
      `  ✓ All ${skinFiles.length} skins are consistent (${allRootVars.size} variables each in :root and .dark).\n`
    );
  }

  // --- Part 2: Component variable coverage ---

  console.log("Part 2: Component variable coverage\n");

  const componentFiles = [
    ...collectFiles(COMPONENTS_UI_DIR, ".tsx"),
    ...collectFiles(COMPONENTS_LAYOUT_DIR, ".tsx"),
  ];

  const globalFiles: string[] = [];
  if (fs.existsSync(GLOBALS_CSS)) globalFiles.push(GLOBALS_CSS);

  // Also check tailwind.config for var() references
  const tailwindConfig = path.join(ROOT, "tailwind.config.ts");
  if (fs.existsSync(tailwindConfig)) globalFiles.push(tailwindConfig);

  const referencedVars = extractReferencedVariables([
    ...componentFiles,
    ...globalFiles,
  ]);

  console.log(
    `  Found ${referencedVars.size} unique CSS variable references across ${componentFiles.length} component files.\n`
  );

  // Check each referenced variable exists in every skin's :root
  const missingFromSkins: { variable: string; skin: string }[] = [];
  for (const variable of referencedVars) {
    for (const [skinFile, vars] of skins) {
      if (!vars.root.has(variable)) {
        missingFromSkins.push({ variable, skin: skinFile });
        hasErrors = true;
      }
    }
  }

  if (missingFromSkins.length > 0) {
    for (const { variable, skin } of missingFromSkins) {
      console.error(`UNDEFINED  ${variable}  referenced by components but not defined in ${skin}`);
    }
  } else {
    console.log(
      `  ✓ All ${referencedVars.size} referenced variables are defined in every skin.\n`
    );
  }

  // --- Summary ---

  if (hasErrors) {
    console.error("\nSkin test FAILED — fix the issues above.");
    process.exit(1);
  } else {
    console.log("All checks passed.");
    process.exit(0);
  }
}

main();
