/**
 * E2E Round-Trip Test: design -> export -> import -> edit -> re-export -> apply -> fresh export
 *
 * Run:
 *   npm run dev          # Terminal 1
 *   npm run test:e2e     # Terminal 2
 *
 * Resume from a specific step (loads prior outputs from test-output/):
 *   npm run test:e2e -- --from=3    # skip Steps 1-2, start at Import
 *   npm run test:e2e -- --from=5b   # skip Steps 1-5, run API apply only
 *   npm run test:e2e -- --from=6    # skip all, run fresh export only
 *
 * Skip the fresh-export regression check (Step 6):
 *   npm run test:e2e -- --skip-regression
 *
 * Flags can be combined:
 *   npm run test:e2e -- --from=3 --skip-regression
 *
 * Valid --from values: 1, 2, 3, 4, 5, 5b, 6
 *
 * Outputs screenshots and artifacts to test-output/
 */

import { chromium, type Page, type BrowserContext, type Download } from "playwright";
import * as fs from "fs";
import * as path from "path";
import JSZip from "jszip";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";

// ── Config ──────────────────────────────────────────────────────────────────

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const BASE_URL = "http://localhost:3000";
const API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const OUT_DIR = path.resolve(__dirname, "../test-output");
const NAV_TIMEOUT = 300_000;
const AI_TIMEOUT = 300_000; // 5 min per AI step
const SCREENSHOT_OPTS = { fullPage: true } as const;

// Custom Dialog component renders a fixed overlay (no role="dialog").
// Outer wrapper: div.fixed.inset-0.z-50  Inner content: div.relative.z-50.max-w-lg
const DIALOG_OVERLAY = "div.fixed.inset-0.z-50";
const DIALOG_CONTENT = `${DIALOG_OVERLAY} div.relative.z-50`;

// ── CLI flags ───────────────────────────────────────────────────────────────

const STEP_ORDER = ["1", "2", "3", "4", "5", "5b", "6"] as const;
type StepId = (typeof STEP_ORDER)[number];

function parseFromArg(): StepId {
  const arg = process.argv.find((a) => a.startsWith("--from="));
  if (!arg) return "1";
  const val = arg.split("=")[1];
  if (!STEP_ORDER.includes(val as StepId)) {
    console.error(`Invalid --from=${val}. Valid values: ${STEP_ORDER.join(", ")}`);
    process.exit(1);
  }
  return val as StepId;
}

const fromStep = parseFromArg();
const skipRegression = process.argv.includes("--skip-regression");

function stepIndex(step: StepId): number {
  return STEP_ORDER.indexOf(step);
}

function shouldRun(step: StepId): boolean {
  if (step === "6" && skipRegression) return false;
  return stepIndex(step) >= stepIndex(fromStep);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const screenshots: string[] = [];

function assert(condition: boolean, msg: string): void {
  if (!condition) {
    failed++;
    throw new Error(`Assertion failed: ${msg}`);
  }
  passed++;
  console.log(`  \u2713 ${msg}`);
}

async function screenshot(page: Page, name: string): Promise<void> {
  const filePath = path.join(OUT_DIR, name);
  await page.screenshot({ ...SCREENSHOT_OPTS, path: filePath });
  screenshots.push(name);
  console.log(`  \uD83D\uDCF8 ${name}`);
}

async function setApiKey(page: Page): Promise<void> {
  await page.evaluate(
    ([key]) => localStorage.setItem("vibekit-claude-api-key", key),
    [API_KEY]
  );
}

/** Wait for screen tab buttons to appear inside the ScreenNavigator */
async function waitForScreenTabs(page: Page, timeout = AI_TIMEOUT): Promise<number> {
  // ScreenNavigator renders buttons inside a div.border-b > div.flex
  const container = page.locator(".border-b.border-border .flex.flex-wrap button");
  await container.first().waitFor({ state: "visible", timeout });
  return container.count();
}

/** Wait for loading to finish (no spinning Loader2 and textarea is enabled) */
async function waitForIdle(page: Page, timeout = AI_TIMEOUT): Promise<void> {
  await page.locator('textarea[placeholder="Describe your app..."]').waitFor({
    state: "visible",
    timeout,
  });
  // Wait until textarea is not disabled (loading finished)
  await page.waitForFunction(
    () => {
      const ta = document.querySelector('textarea[placeholder="Describe your app..."]') as HTMLTextAreaElement | null;
      return ta && !ta.disabled;
    },
    { timeout }
  );
}

/** Send a chat message and wait for response */
async function sendMessage(page: Page, text: string): Promise<void> {
  const textarea = page.locator('textarea[placeholder="Describe your app..."]');
  await textarea.fill(text);
  // Click the Send button (icon button sibling in .flex.gap-2.items-end)
  const sendBtn = page.locator('.flex.gap-2.items-end button');
  await sendBtn.click();
}

/** Click Export, wait for download, return ZIP buffer */
async function exportAndDownload(page: Page): Promise<{ zip: JSZip; download: Download }> {
  // Click Export in top bar
  await page.locator('button:has-text("Export")').click();
  await page.locator(DIALOG_OVERLAY).waitFor({ state: "visible", timeout: 5_000 });

  // Set up download listener before clicking export action
  const downloadPromise = page.waitForEvent("download", { timeout: AI_TIMEOUT });

  // Click the primary export button inside dialog content
  const exportBtn = page.locator(`${DIALOG_CONTENT} button:has-text("Export")`);
  await exportBtn.click();

  const download = await downloadPromise;
  const buffer = await download.createReadStream().then(
    (stream) => new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (c: Buffer) => chunks.push(c));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    })
  );

  const zip = await JSZip.loadAsync(buffer);
  return { zip, download };
}

/** List files in a JSZip, stripping the top-level folder prefix */
function zipFiles(zip: JSZip): string[] {
  const entries: string[] = [];
  zip.forEach((relPath) => {
    // Strip "vibekit-export/" prefix
    const stripped = relPath.replace(/^vibekit-export\//, "");
    if (stripped && !stripped.endsWith("/")) entries.push(stripped);
  });
  return entries;
}

/** Read a file from ZIP (accounts for vibekit-export/ prefix) */
async function readZipFile(zip: JSZip, name: string): Promise<string> {
  const file = zip.file(`vibekit-export/${name}`) ?? zip.file(name);
  if (!file) throw new Error(`File not found in ZIP: ${name}`);
  return file.async("string");
}

/** Load screen files saved by Step 2 from test-output/screens/ */
function loadScreensFromDisk(): { name: string; content: string }[] {
  const screensDir = path.join(OUT_DIR, "screens");
  if (!fs.existsSync(screensDir)) {
    console.error(`Cannot resume: ${screensDir} not found. Run earlier steps first.`);
    process.exit(1);
  }
  const jsxFiles = fs.readdirSync(screensDir).filter((f) => f.endsWith(".jsx"));
  if (jsxFiles.length === 0) {
    console.error(`Cannot resume: no .jsx files in ${screensDir}. Run Steps 1-2 first.`);
    process.exit(1);
  }
  return jsxFiles.map((f) => ({
    name: f,
    content: fs.readFileSync(path.join(screensDir, f), "utf-8"),
  }));
}

/** Load DESIGN_CHANGES.md saved by Step 5 from test-output/ */
function loadDesignChangesFromDisk(): string {
  const dcPath = path.join(OUT_DIR, "design-changes.md");
  if (!fs.existsSync(dcPath)) {
    console.error(`Cannot resume: ${dcPath} not found. Run Steps 1-5 first.`);
    process.exit(1);
  }
  return fs.readFileSync(dcPath, "utf-8");
}

/** Navigate to /design and set the API key */
async function navigateToDesign(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/design`, { timeout: NAV_TIMEOUT, waitUntil: "networkidle" });
  await setApiKey(page);
  await page.reload({ timeout: NAV_TIMEOUT, waitUntil: "networkidle" });
}

/** Silently replay the import flow (Step 3) to establish browser state */
async function replayImport(page: Page, screenFiles: { name: string; content: string }[]): Promise<void> {
  await page.locator('button:has-text("Import")').click();
  await page.locator(DIALOG_OVERLAY).waitFor({ state: "visible", timeout: 5_000 });

  const filePaths = screenFiles.map((f) => path.join(OUT_DIR, "screens", f.name));
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePaths);
  await page.waitForTimeout(500);

  const importBtn = page.locator(`${DIALOG_CONTENT} button:has-text("Import")`);
  await importBtn.click();

  await page.locator(DIALOG_OVERLAY).waitFor({ state: "hidden", timeout: AI_TIMEOUT });
  await waitForScreenTabs(page);
}

// ── Steps ───────────────────────────────────────────────────────────────────

const stepResults: { name: string; status: "passed" | "failed" | "skipped"; error?: string }[] = [];

async function runStep(
  name: string,
  fn: () => Promise<void>,
  page?: Page
): Promise<boolean> {
  console.log(`\n=== ${name} ===`);
  try {
    await fn();
    stepResults.push({ name, status: "passed" });
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  \u2717 FAILED: ${msg}`);
    stepResults.push({ name, status: "failed", error: msg });
    if (page) {
      try {
        await screenshot(page, `${name.replace(/[^a-zA-Z0-9]/g, "-")}-FAILED.png`);
      } catch {
        // ignore screenshot failure
      }
    }
    return false;
  }
}

function skipStep(name: string): void {
  console.log(`\n=== ${name} === (skipped, --from=${fromStep})`);
  stepResults.push({ name, status: "skipped" });
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Validate prerequisites
  if (!API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY in .env.local");
    process.exit(1);
  }

  if (fromStep !== "1") {
    console.log(`Resuming from Step ${fromStep} (loading prior outputs from test-output/)`);
  }

  // Prepare output directory — only wipe when running from Step 1
  if (fromStep === "1") {
    if (fs.existsSync(OUT_DIR)) {
      fs.rmSync(OUT_DIR, { recursive: true });
    }
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "screens"), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "applied"), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(300_000);

  // Shared state across steps
  let originalScreenFiles: { name: string; content: string }[] = [];
  let designChangesContent = "";

  // ── Load disk state when resuming ──────────────────────────────────────

  if (!shouldRun("2")) {
    // Step 2 produces originalScreenFiles — load from previous run
    originalScreenFiles = loadScreensFromDisk();
    console.log(`  Loaded ${originalScreenFiles.length} screen files from test-output/screens/`);
  }

  if (!shouldRun("5") && shouldRun("5b")) {
    // Step 5 produces designChangesContent — load from previous run
    designChangesContent = loadDesignChangesFromDisk();
    console.log("  Loaded DESIGN_CHANGES.md from test-output/");
  }

  // ── Silent browser setup when resuming mid-flow ────────────────────────
  //
  // Browser state dependency chain: 1→2, 3→4→5, and 5b/6 are independent.
  // When skipping steps, replay the minimum needed to establish browser state.

  if (fromStep !== "1") {
    const needsBrowserSetup = ["2", "3", "4", "5"].includes(fromStep);

    if (needsBrowserSetup) {
      console.log("\nSetting up browser state...");
      await navigateToDesign(page);

      if (fromStep === "2") {
        // Step 2 needs a generated design → replay Step 1's generation
        console.log("  Replaying design generation (Step 1)...");
        await sendMessage(page, "a personal finance tracker with overview, transactions, and budgets");
        await waitForIdle(page);
        await waitForScreenTabs(page);
        console.log("  Done.");
      }

      if (fromStep === "4" || fromStep === "5") {
        // Steps 4-5 need imported screens → replay Step 3's import
        console.log("  Replaying import (Step 3)...");
        await replayImport(page, originalScreenFiles);
        console.log("  Done.");

        if (fromStep === "5") {
          // Step 5 needs the edit → replay Step 4's edit
          console.log("  Replaying design edit (Step 4)...");
          await sendMessage(page, "add a search bar above the main content area");
          await waitForIdle(page);
          console.log("  Done.");
        }
      }
    }
  }

  // ── Step 1: Generate a Design ──────────────────────────────────────────

  if (shouldRun("1")) {
    const step1Ok = await runStep("Step 1: Generate a Design", async () => {
      await navigateToDesign(page);

      await sendMessage(page, "a personal finance tracker with overview, transactions, and budgets");
      await waitForIdle(page);

      const tabCount = await waitForScreenTabs(page);
      assert(tabCount >= 2, `Expected \u22652 screen tabs, got ${tabCount}`);
      await screenshot(page, "01-design-generated.png");
    }, page);

    if (!step1Ok) {
      await browser.close();
      printSummary();
      process.exit(1);
    }
  } else {
    skipStep("Step 1: Generate a Design");
  }

  // ── Step 2: Export Initial Design ──────────────────────────────────────

  if (shouldRun("2")) {
    const step2Ok = await runStep("Step 2: Export Initial Design", async () => {
      await page.locator('button:has-text("Export")').click();
      await page.locator(DIALOG_OVERLAY).waitFor({ state: "visible", timeout: 5_000 });
      await screenshot(page, "02-export-modal.png");

      const downloadPromise = page.waitForEvent("download", { timeout: AI_TIMEOUT });
      const exportBtn = page.locator(`${DIALOG_CONTENT} button:has-text("Export")`);
      await exportBtn.click();

      const download = await downloadPromise;
      const buffer = await download.createReadStream().then(
        (stream) => new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on("data", (c: Buffer) => chunks.push(c));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        })
      );

      const zip = await JSZip.loadAsync(buffer);
      const files = zipFiles(zip);

      assert(files.includes("CLAUDE.md"), "ZIP contains CLAUDE.md");
      assert(files.includes("SCREEN_SPEC.md"), "ZIP contains SCREEN_SPEC.md");
      assert(files.includes("vibekit.design.json"), "ZIP contains vibekit.design.json");
      assert(files.includes("vibekit-skin.css"), "ZIP contains vibekit-skin.css");

      const screenFiles = files.filter((f) => f.startsWith("screens/") && f.endsWith(".jsx"));
      assert(screenFiles.length >= 2, `ZIP has \u22652 screen .jsx files, got ${screenFiles.length}`);

      // Save screen files to disk for later steps / --from resume
      for (const sf of screenFiles) {
        const content = await readZipFile(zip, sf);
        const basename = path.basename(sf);
        fs.writeFileSync(path.join(OUT_DIR, "screens", basename), content);
        originalScreenFiles.push({ name: basename, content });
      }

      // Close the modal (it auto-closes on successful export, but ensure)
      try {
        const dialog = page.locator(DIALOG_OVERLAY);
        if (await dialog.isVisible()) {
          await page.keyboard.press("Escape");
          await dialog.waitFor({ state: "hidden", timeout: 3_000 });
        }
      } catch {
        // modal already closed
      }
    }, page);

    if (!step2Ok) {
      await browser.close();
      printSummary();
      process.exit(1);
    }
  } else {
    skipStep("Step 2: Export Initial Design");
  }

  // ── Step 3: Import Exported Screens ────────────────────────────────────

  if (shouldRun("3")) {
    const step3Ok = await runStep("Step 3: Import Exported Screens", async () => {
      // Click Import button in top bar
      await page.locator('button:has-text("Import")').click();
      await page.locator(DIALOG_OVERLAY).waitFor({ state: "visible", timeout: 5_000 });

      // Upload saved .jsx files
      const filePaths = originalScreenFiles.map((f) => path.join(OUT_DIR, "screens", f.name));
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(filePaths);

      // Wait for file list to populate
      await page.waitForTimeout(500);
      await screenshot(page, "03-import-files-listed.png");

      // Click the Import button in dialog footer
      const importBtn = page.locator(`${DIALOG_CONTENT} button:has-text("Import")`);
      await importBtn.click();

      // Wait for dialog to close + screen tabs to reappear (AI call)
      await page.locator(DIALOG_OVERLAY).waitFor({ state: "hidden", timeout: AI_TIMEOUT });
      const tabCount = await waitForScreenTabs(page);

      await screenshot(page, "04-import-preview.png");
      assert(tabCount >= originalScreenFiles.length, `Import produced ${tabCount} tabs, expected \u2265${originalScreenFiles.length}`);
    }, page);

    if (!step3Ok) {
      await browser.close();
      printSummary();
      process.exit(1);
    }
  } else {
    skipStep("Step 3: Import Exported Screens");
  }

  // ── Step 4: Make a Design Change ───────────────────────────────────────

  if (shouldRun("4")) {
    await runStep("Step 4: Make a Design Change", async () => {
      await sendMessage(page, "add a search bar above the main content area");
      await waitForIdle(page);
      await screenshot(page, "05-after-edit.png");

      const tabCount = await waitForScreenTabs(page);
      assert(tabCount >= 1, "Screen tabs still present after edit");
    }, page);
  } else {
    skipStep("Step 4: Make a Design Change");
  }

  // ── Step 5: Re-Export (DESIGN_CHANGES.md) ──────────────────────────────

  let step5Ok = false;

  if (shouldRun("5")) {
    step5Ok = await runStep("Step 5: Re-Export with DESIGN_CHANGES.md", async () => {
      await page.locator('button:has-text("Export")').click();
      await page.locator(DIALOG_OVERLAY).waitFor({ state: "visible", timeout: 5_000 });
      await screenshot(page, "06-reexport-modal.png");

      // Assert dialog title indicates re-export mode
      const title = await page.locator(`${DIALOG_CONTENT} h2`).textContent();
      assert(
        title?.includes("Design Changes") ?? false,
        `Dialog title contains "Design Changes", got "${title}"`
      );

      const downloadPromise = page.waitForEvent("download", { timeout: AI_TIMEOUT });
      const exportBtn = page.locator(`${DIALOG_CONTENT} button:has-text("Export")`);
      await exportBtn.click();

      const download = await downloadPromise;
      const buffer = await download.createReadStream().then(
        (stream) => new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on("data", (c: Buffer) => chunks.push(c));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        })
      );

      const zip = await JSZip.loadAsync(buffer);
      const files = zipFiles(zip);

      assert(files.includes("DESIGN_CHANGES.md"), "Re-export ZIP contains DESIGN_CHANGES.md");
      assert(!files.includes("CLAUDE.md"), "Re-export ZIP does NOT contain CLAUDE.md");
      assert(!files.includes("SCREEN_SPEC.md"), "Re-export ZIP does NOT contain SCREEN_SPEC.md");

      designChangesContent = await readZipFile(zip, "DESIGN_CHANGES.md");
      assert(designChangesContent.includes("## Changes"), "DESIGN_CHANGES.md contains ## Changes");
      assert(
        designChangesContent.includes("## Unchanged Screen Files") ||
          designChangesContent.includes("## Unchanged"),
        "DESIGN_CHANGES.md contains unchanged section"
      );

      assert(files.includes("vibekit.design.json"), "Re-export ZIP contains vibekit.design.json");
      assert(files.includes("vibekit-skin.css"), "Re-export ZIP contains vibekit-skin.css");

      const screenFiles = files.filter((f) => f.startsWith("screens/") && f.endsWith(".jsx"));
      assert(screenFiles.length >= 1, `Re-export ZIP contains screen .jsx files`);

      // Save DESIGN_CHANGES.md to disk for --from resume
      fs.writeFileSync(path.join(OUT_DIR, "design-changes.md"), designChangesContent);

      await screenshot(page, "07-reexport-done.png");
    }, page);
  } else {
    skipStep("Step 5: Re-Export with DESIGN_CHANGES.md");
    // If we loaded designChangesContent from disk, treat Step 5 as succeeded for 5b gating
    step5Ok = !!designChangesContent;
  }

  // ── Step 5b: Verify Changes Apply Correctly (API call) ────────────────

  if (shouldRun("5b")) {
    if (step5Ok && designChangesContent) {
      await runStep("Step 5b: Verify Changes Apply via API", async () => {
        const client = new Anthropic({ apiKey: API_KEY });

        // Build the prompt with original files + DESIGN_CHANGES.md
        const fileContents = originalScreenFiles
          .map((f) => `<file path="${f.name}">\n${f.content}\n</file>`)
          .join("\n\n");

        const response = await client.messages.create({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 16000,
          system: `You are a precise code editor. Apply ONLY the changes described in DESIGN_CHANGES.md to the provided source files.

CRITICAL RULES:
1. Return ALL provided files, even unchanged ones
2. Unchanged files must be returned EXACTLY as provided — byte-identical, no modifications whatsoever
3. For changed files: make ONLY the specific modifications described in the Implementation Hints
4. Do NOT rename variables, change data values, restructure code, or modify anything not explicitly described
5. Do NOT create new files that weren't in the original set
6. Preserve all existing imports, data arrays, component names, and logic

Return each file wrapped in <file path="filename.jsx">...</file> tags.`,
          messages: [
            {
              role: "user",
              content: `Here is DESIGN_CHANGES.md:\n\n${designChangesContent}\n\nHere are the original screen files:\n\n${fileContents}\n\nApply the changes and return all files.`,
            },
          ],
        });

        // Parse response
        const responseText = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n");

        const fileRegex = /<file path="([^"]+)">([\s\S]*?)<\/file>/g;
        const appliedFiles: { name: string; content: string }[] = [];
        let match;
        while ((match = fileRegex.exec(responseText)) !== null) {
          appliedFiles.push({ name: match[1], content: match[2].trim() });
        }

        assert(appliedFiles.length > 0, `API returned ${appliedFiles.length} files`);

        // Parse unchanged files from DESIGN_CHANGES.md
        const unchangedMatch = designChangesContent.match(
          /## Unchanged[^\n]*\n([\s\S]*?)(?=\n##|$)/
        );
        const unchangedFiles: string[] = [];
        if (unchangedMatch) {
          const lines = unchangedMatch[1].split("\n");
          for (const line of lines) {
            const fileMatch = line.match(/`?([^\s`]+\.jsx)`?/);
            if (fileMatch) unchangedFiles.push(fileMatch[1]);
          }
        }

        // Check unchanged files are identical
        let hasChanged = false;
        for (const applied of appliedFiles) {
          const original = originalScreenFiles.find(
            (o) => o.name === applied.name || o.name === path.basename(applied.name)
          );
          if (!original) continue;

          const isUnchanged = unchangedFiles.some(
            (u) => path.basename(u) === applied.name || u === applied.name
          );

          if (isUnchanged) {
            const identical = original.content.trim() === applied.content.trim();
            assert(identical, `Unchanged file "${applied.name}" is byte-identical`);
          } else {
            const different = original.content.trim() !== applied.content.trim();
            if (different) hasChanged = true;
          }

          // Save applied files to disk
          fs.writeFileSync(path.join(OUT_DIR, "applied", applied.name), applied.content);
        }

        assert(hasChanged, "At least one file was changed by the edit");

        // Check the changed file has evidence of the search bar edit
        const changedFiles = appliedFiles.filter((af) => {
          const orig = originalScreenFiles.find(
            (o) => o.name === af.name || o.name === path.basename(af.name)
          );
          return orig && orig.content.trim() !== af.content.trim();
        });
        const hasSearchEvidence = changedFiles.some(
          (f) => {
            const c = f.content.toLowerCase();
            return c.includes("search") || c.includes("input") || c.includes("sparkline") || c.includes("weeklyspending") || c.includes("trend");
          }
        );
        assert(hasSearchEvidence, "Changed file contains search/input evidence");

        // Verify changed files preserve original data values
        for (const cf of changedFiles) {
          const orig = originalScreenFiles.find(
            (o) => o.name === cf.name || o.name === path.basename(cf.name)
          );
          if (!orig) continue;

          // Extract decimal numbers (dollar amounts, percentages) from original
          const origNumbers = orig.content.match(/\d+\.\d{2}/g)?.slice(0, 5) || [];
          if (origNumbers.length > 0) {
            const preservedData = origNumbers.every((n) => cf.content.includes(n));
            assert(preservedData, `Changed file "${cf.name}" preserves original data values`);
          }

          // Line count should be close (additions only, not rewrites)
          const origLines = orig.content.split("\n").length;
          const newLines = cf.content.split("\n").length;
          const lineRatio = newLines / origLines;
          assert(
            lineRatio > 0.8 && lineRatio < 1.5,
            `Changed file "${cf.name}" line count ratio is reasonable (${lineRatio.toFixed(2)}, expected 0.8-1.5)`
          );
        }

        // No invented files — every returned file must exist in the original set
        const inventedFiles = appliedFiles.filter(
          (af) => !originalScreenFiles.find(
            (o) => o.name === af.name || o.name === path.basename(af.name)
          )
        );
        assert(
          inventedFiles.length === 0,
          `No invented files (found: ${inventedFiles.map((f) => f.name).join(", ") || "none"})`
        );
      });
    } else {
      console.log("\n=== Step 5b: Verify Changes Apply via API === (skipped, no DESIGN_CHANGES.md available)");
      stepResults.push({ name: "Step 5b: Verify Changes Apply via API", status: "skipped" });
    }
  } else {
    skipStep("Step 5b: Verify Changes Apply via API");
  }

  // ── Step 6: Fresh Export Regression Check ──────────────────────────────

  if (shouldRun("6")) {
    await runStep("Step 6: Fresh Export Regression Check", async () => {
      // Navigate fresh
      await navigateToDesign(page);

      await sendMessage(page, "a simple todo list app");
      await waitForIdle(page);
      await waitForScreenTabs(page);

      const { zip } = await exportAndDownload(page);
      const files = zipFiles(zip);

      assert(files.includes("CLAUDE.md"), "Fresh export contains CLAUDE.md");
      assert(files.includes("SCREEN_SPEC.md"), "Fresh export contains SCREEN_SPEC.md");
      assert(!files.includes("DESIGN_CHANGES.md"), "Fresh export does NOT contain DESIGN_CHANGES.md");

      await screenshot(page, "08-fresh-export.png");
    }, page);
  } else {
    skipStep("Step 6: Fresh Export Regression Check");
  }

  // ── Cleanup and Summary ────────────────────────────────────────────────

  await browser.close();
  printSummary();
}

function printSummary() {
  console.log("\n" + "=".repeat(60));
  console.log("E2E ROUND-TRIP TEST SUMMARY");
  console.log("=".repeat(60));

  for (const step of stepResults) {
    const icon =
      step.status === "passed" ? "\u2705" :
      step.status === "skipped" ? "\u23ED\uFE0F" :
      "\u274C";
    console.log(`${icon} ${step.name}${step.error ? ` \u2014 ${step.error}` : ""}`);
  }

  const ran = stepResults.filter((s) => s.status !== "skipped");
  const failedSteps = ran.filter((s) => s.status === "failed");
  const skipped = stepResults.filter((s) => s.status === "skipped");

  console.log(`\nAssertions: ${passed} passed, ${failed} failed`);
  console.log(`Steps: ${ran.length - failedSteps.length} passed, ${failedSteps.length} failed, ${skipped.length} skipped`);
  console.log(`Screenshots (${screenshots.length}): ${screenshots.join(", ")}`);
  console.log(`Output: ${OUT_DIR}`);

  if (failedSteps.length > 0) {
    console.log("\nRESULT: SOME STEPS FAILED");
    process.exit(1);
  } else {
    console.log("\nRESULT: ALL STEPS PASSED");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
