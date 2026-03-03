// lib/ai/export-pipeline.ts
//
// Assembles the full export package:
//   1. Calls Stage 3 (spec writer) to produce CLAUDE.md + SCREEN_SPEC.md
//   2. Programmatically builds vibekit.design.json from pipeline state
//   3. Copies the active skin CSS
//   4. Returns all files ready for ZIP

import { SKIN_CSS } from "@/styles/skins/all-skins"; // adjust import to your setup

// ─── Types ───

interface ScreenCode {
  id: string;
  name: string;
  type: "page" | "dialog" | "sheet";
  code: string;
}

interface NavItem {
  label: string;
  icon: string;
  screen: string;
}

interface NavStructure {
  type: "topnav" | "sidebar" | "bottom-tabs" | "none";
  items: NavItem[];
}

interface ExportInput {
  designBrief: Record<string, unknown>;
  screenCodes: ScreenCode[];
  navStructure: NavStructure;
  activeSkin: string; // e.g. "modern-saas"
  skinCSS: string; // the resolved CSS for the active skin
  iterationCount: number;
  apiKey: string;
}

interface ExportFile {
  filename: string;
  content: string;
}

interface ExportResult {
  files: ExportFile[];
}

// ─── Stage 3 Prompt ───

// Load from prompts/stage3-spec-writer.md at build time
// For now, inline or import as raw string
import STAGE3_PROMPT from "@/prompts/stage3-spec-writer.md";

// ─── Export Pipeline ───

export async function runExportPipeline(input: ExportInput): Promise<ExportResult> {
  const {
    designBrief,
    screenCodes,
    navStructure,
    activeSkin,
    skinCSS,
    iterationCount,
    apiKey,
  } = input;

  // 1. Build the Stage 3 user message with all inputs
  const stage3UserMessage = buildStage3Message(designBrief, screenCodes, skinCSS);

  // 2. Call Stage 3 to produce CLAUDE.md + SCREEN_SPEC.md
  const stage3Response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: STAGE3_PROMPT,
      messages: [{ role: "user", content: stage3UserMessage }],
    }),
  });

  if (!stage3Response.ok) {
    throw new Error(`Stage 3 API call failed: ${stage3Response.status}`);
  }

  const stage3Data = await stage3Response.json();
  const stage3Text = stage3Data.content
    .map((block: { type: string; text?: string }) =>
      block.type === "text" ? block.text : ""
    )
    .join("");

  // 3. Parse the two markdown files from Stage 3 output
  const claudeMd = extractTagContent(stage3Text, "claude_md");
  const screenSpec = extractTagContent(stage3Text, "screen_spec");

  if (!claudeMd || !screenSpec) {
    throw new Error("Stage 3 did not produce expected output format");
  }

  // 4. Programmatically build vibekit.design.json
  const designJson = buildDesignJson({
    designBrief,
    screenCodes,
    navStructure,
    activeSkin,
    iterationCount,
  });

  // 5. Assemble all export files
  const files: ExportFile[] = [
    { filename: "CLAUDE.md", content: claudeMd },
    { filename: "SCREEN_SPEC.md", content: screenSpec },
    { filename: "vibekit.design.json", content: JSON.stringify(designJson, null, 2) },
    { filename: "vibekit-skin.css", content: skinCSS },
  ];

  // 6. Optionally include individual screen files
  for (const screen of screenCodes) {
    files.push({
      filename: `screens/${screen.id}.jsx`,
      content: screen.code,
    });
  }

  return { files };
}

// ─── Helpers ───

function buildStage3Message(
  designBrief: Record<string, unknown>,
  screenCodes: ScreenCode[],
  skinCSS: string
): string {
  const parts: string[] = [];

  parts.push("## DESIGN BRIEF\n");
  parts.push("```json");
  parts.push(JSON.stringify(designBrief, null, 2));
  parts.push("```\n");

  parts.push("## SCREEN CODE\n");
  for (const screen of screenCodes) {
    parts.push(`### ${screen.name} (${screen.id}, type: ${screen.type})\n`);
    parts.push("```jsx");
    parts.push(screen.code);
    parts.push("```\n");
  }

  parts.push("## ACTIVE SKIN\n");
  parts.push("```css");
  parts.push(skinCSS);
  parts.push("```");

  return parts.join("\n");
}

function extractTagContent(text: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`);
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

interface DesignJsonInput {
  designBrief: Record<string, unknown>;
  screenCodes: ScreenCode[];
  navStructure: NavStructure;
  activeSkin: string;
  iterationCount: number;
}

interface DesignJson {
  vibekit_version: string;
  exported_at: string;
  app_name: string;
  design_brief: Record<string, unknown>;
  screens: ScreenCode[];
  nav_structure: NavStructure;
  skin: string;
  iteration_count: number;
}

function buildDesignJson(input: DesignJsonInput): DesignJson {
  return {
    vibekit_version: "1.0",
    exported_at: new Date().toISOString(),
    app_name: (input.designBrief.app_name as string) || "Untitled App",
    design_brief: input.designBrief,
    screens: input.screenCodes.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      code: s.code,
    })),
    nav_structure: input.navStructure,
    skin: input.activeSkin,
    iteration_count: input.iterationCount,
  };
}
