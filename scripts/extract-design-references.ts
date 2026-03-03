/**
 * Design Reference Extraction Script
 *
 * Screenshots well-designed apps, sends them to Claude Vision API,
 * and compiles extracted CSS values into DESIGN_REFERENCE.md.
 *
 * Run: npm run extract-refs
 * Requires: ANTHROPIC_API_KEY env var
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";
import Anthropic from "@anthropic-ai/sdk";

// Load .env.local from project root
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const REFS_DIR = path.join(__dirname, "references");

const SITES = [
  { name: "shadcn-blocks", url: "https://ui.shadcn.com/blocks" },
  { name: "shadcn-dashboard", url: "https://ui.shadcn.com/examples/dashboard" },
  { name: "shadcn-cards", url: "https://ui.shadcn.com/examples/cards" },
  { name: "shadcn-forms", url: "https://ui.shadcn.com/examples/forms" },
  { name: "shadcn-mail", url: "https://ui.shadcn.com/examples/mail" },
  { name: "linear", url: "https://linear.app" },
  { name: "vercel", url: "https://vercel.com" },
];

const VISION_PROMPT = `You are a design systems expert. Analyze this screenshot and extract precise CSS property values for the following UI elements. Be as specific as possible with exact pixel values, colors, and measurements you can observe or estimate from the screenshot.

Extract values for:

**Card**
- padding (inner spacing)
- box-shadow
- border-radius
- border style (color, width)

**Badge**
- padding (horizontal and vertical)
- font-size
- font-weight
- border-radius

**Button**
- height
- padding (horizontal)
- font-size
- font-weight

**Table** (if visible)
- row height
- cell padding
- header style (font-weight, background, text-transform)

**Spacing**
- section gaps (space between major sections)
- content margins (page-level horizontal margins)
- component gaps (space between sibling elements)

**Typography**
- heading sizes (h1, h2, h3 if visible)
- body text size
- line-height
- font-family (serif, sans-serif, mono — and specific family if identifiable)

**Colors**
- background (page, card, sidebar)
- text (primary, secondary/muted)
- border colors
- accent/brand color usage

Format your response as a structured list with clear headings. Use CSS-style values (px, rem, hex colors). If a value is estimated, prefix with "~". If a component is not visible in the screenshot, say "Not visible".`;

async function takeScreenshots(): Promise<Map<string, string>> {
  const screenshots = new Map<string, string>();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  for (const site of SITES) {
    const page = await context.newPage();
    const filepath = path.join(REFS_DIR, `${site.name}.png`);
    console.log(`Screenshotting ${site.name} (${site.url})...`);

    try {
      await page.goto(site.url, { timeout: 60000, waitUntil: "networkidle" });
      // Wait a bit for any animations/lazy content
      await page.waitForTimeout(2000);
      await page.screenshot({ path: filepath, fullPage: true });
      screenshots.set(site.name, filepath);
      console.log(`  ✓ Saved ${filepath}`);
    } catch (err) {
      console.error(`  ✗ Failed to screenshot ${site.name}: ${(err as Error).message}`);
    }

    await page.close();
  }

  await browser.close();
  return screenshots;
}

async function extractDesignValues(
  client: Anthropic,
  siteName: string,
  screenshotPath: string
): Promise<string> {
  console.log(`Analyzing ${siteName} with Claude Vision...`);

  const imageData = fs.readFileSync(screenshotPath);
  const base64 = imageData.toString("base64");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: base64,
            },
          },
          {
            type: "text",
            text: VISION_PROMPT,
          },
        ],
      },
    ],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  console.log(`  ✓ Got analysis for ${siteName}`);
  return text;
}

function buildMarkdown(extractions: Map<string, string>): string {
  let md = `# Design Reference Extractions\n\n`;
  md += `> Generated on ${new Date().toISOString().split("T")[0]}\n`;
  md += `> Sources: ${SITES.map((s) => s.name).join(", ")}\n\n`;
  md += `---\n\n`;

  // Per-site sections
  for (const [name, analysis] of extractions) {
    const site = SITES.find((s) => s.name === name)!;
    md += `## ${name}\n`;
    md += `**URL:** ${site.url}\n\n`;
    md += analysis + "\n\n";
    md += `---\n\n`;
  }

  // Summary prompt — we'll add a static summary header;
  // the individual extractions are the main value
  md += `## Summary & Ranges\n\n`;
  md += `Review the per-site extractions above to identify:\n`;
  md += `- **Median values** for each property across all sites\n`;
  md += `- **Ranges** showing min–max for each property\n`;
  md += `- **Consensus patterns** where 4+ sites agree\n\n`;
  md += `Use these values as baseline targets for VibeKit component styling.\n`;

  return md;
}

async function main() {
  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is required.");
    console.error("Set it with: export ANTHROPIC_API_KEY=your-key-here");
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(REFS_DIR, { recursive: true });

  console.log("=== Design Reference Extraction ===\n");

  // Step 1: Take screenshots
  console.log("Step 1: Taking screenshots...\n");
  const screenshots = await takeScreenshots();

  if (screenshots.size === 0) {
    console.error("No screenshots were captured. Exiting.");
    process.exit(1);
  }

  console.log(`\nCaptured ${screenshots.size}/${SITES.length} screenshots.\n`);

  // Step 2: Analyze with Claude Vision
  console.log("Step 2: Analyzing screenshots with Claude Vision...\n");
  const client = new Anthropic();
  const extractions = new Map<string, string>();

  for (const [name, filepath] of screenshots) {
    try {
      const analysis = await extractDesignValues(client, name, filepath);
      extractions.set(name, analysis);
    } catch (err) {
      console.error(`  ✗ Failed to analyze ${name}: ${(err as Error).message}`);
    }
  }

  if (extractions.size === 0) {
    console.error("No extractions succeeded. Exiting.");
    process.exit(1);
  }

  console.log(`\nExtracted design values from ${extractions.size} sites.\n`);

  // Step 3: Compile markdown
  console.log("Step 3: Compiling DESIGN_REFERENCE.md...\n");
  const markdown = buildMarkdown(extractions);
  const outPath = path.join(REFS_DIR, "DESIGN_REFERENCE.md");
  fs.writeFileSync(outPath, markdown, "utf-8");

  console.log(`✓ Written to ${outPath}`);
  console.log("\nDone!");
  process.exit(0);
}

main();
