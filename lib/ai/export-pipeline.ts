// lib/ai/export-pipeline.ts
//
// Stage 3: Assembles the full export package:
//   1. Calls Stage 3 (spec writer) to produce CLAUDE.md + SCREEN_SPEC.md
//   2. Programmatically builds vibekit.design.json from pipeline state
//   3. Copies the active skin CSS
//   4. Returns all files ready for ZIP

import stage3Prompt from "@/prompts/stage3-spec-writer.md";
import stage3bPrompt from "@/prompts/stage3b-change-detector.md";
import type { ComponentMap, ComponentMapEntry } from "./import-pipeline";

// ─── Types ───

interface ScreenCode {
  id: string;
  name: string;
  type: string;
  code: string;
}

interface NavItem {
  label: string;
  icon: string;
  screen: string;
}

interface NavStructure {
  type: string;
  items: NavItem[];
}

export interface ExportInput {
  designBrief: Record<string, unknown>;
  screenCodes: ScreenCode[];
  navStructure: NavStructure | Record<string, unknown> | null;
  activeSkin: string;
  skinCSS: string;
  iterationCount: number;
  apiKey: string;
  fontImportUrl?: string | null;
}

export interface ExportFile {
  filename: string;
  content: string;
}

export interface ExportResult {
  files: ExportFile[];
}

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
    fontImportUrl,
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
      system: stage3Prompt,
      messages: [{ role: "user", content: stage3UserMessage }],
    }),
  });

  if (!stage3Response.ok) {
    const errorBody = await stage3Response.text();
    throw new Error(`Stage 3 API call failed (${stage3Response.status}): ${errorBody}`);
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

  // 3b. Prepend reference implementation note to CLAUDE.md
  const referenceNote = `## Reference Implementation

The \`screens/\` directory contains the React/JSX code from the VibeKit design preview. These are reference implementations — use them to understand the exact visual treatment, data structure, and interaction patterns. When building real components, adapt these to your project's architecture (routing, state management, API calls) but preserve the visual details exactly.

`;
  const claudeMdWithRef = claudeMd.replace(
    "## Design System",
    referenceNote + "## Design System"
  );

  // 4. Programmatically build vibekit.design.json
  const designJson = buildDesignJson({
    designBrief,
    screenCodes,
    navStructure,
    activeSkin,
    iterationCount,
  });

  // 5. Assemble all export files
  const exportSkinCSS = fontImportUrl
    ? `@import url('${fontImportUrl}');\n\n${skinCSS}`
    : skinCSS;
  const files: ExportFile[] = [
    { filename: "CLAUDE.md", content: claudeMdWithRef },
    { filename: "SCREEN_SPEC.md", content: screenSpec },
    { filename: "vibekit.design.json", content: JSON.stringify(designJson, null, 2) },
    { filename: "vibekit-skin.css", content: exportSkinCSS },
  ];

  // 6. Include individual screen files
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
  navStructure: NavStructure | Record<string, unknown> | null;
  activeSkin: string;
  iterationCount: number;
}

function buildDesignJson(input: DesignJsonInput) {
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

// ─── Re-Export Pipeline (Round-Trip) ───

export interface ReExportInput {
  originalScreenCodes: ScreenCode[];
  currentScreenCodes: ScreenCode[];
  componentMap: ComponentMap;
  designBrief: Record<string, unknown>;
  activeSkin: string;
  skinCSS: string;
  apiKey: string;
  fontImportUrl?: string | null;
}

export async function runReExportPipeline(
  input: ReExportInput
): Promise<ExportResult> {
  const {
    originalScreenCodes,
    currentScreenCodes,
    componentMap,
    designBrief,
    activeSkin,
    skinCSS,
    apiKey,
    fontImportUrl,
  } = input;

  console.log("[Re-Export Pipeline] Starting change detection");

  // 1. Find changed screens by comparing code strings
  const changedScreens: {
    before: ScreenCode;
    after: ScreenCode;
    mapEntry: ComponentMapEntry | undefined;
  }[] = [];

  for (const current of currentScreenCodes) {
    const original = originalScreenCodes.find((s) => s.id === current.id);
    if (!original) {
      // New screen — no BEFORE exists
      changedScreens.push({
        before: { id: current.id, name: current.name, type: current.type, code: "" },
        after: current,
        mapEntry: componentMap.find((m) => m.screen_id === current.id),
      });
    } else if (original.code !== current.code) {
      changedScreens.push({
        before: original,
        after: current,
        mapEntry: componentMap.find((m) => m.screen_id === current.id),
      });
    }
  }

  console.log(
    "[Re-Export Pipeline]",
    changedScreens.length,
    "changed screens out of",
    currentScreenCodes.length
  );

  // 2. Call Stage 3b for all changed screens in parallel
  console.log("[Re-Export Pipeline] Calling Stage 3b for", changedScreens.length, "screens in parallel");

  const changePromises = changedScreens.map(async ({ before, after, mapEntry }) => {
    console.log("[Re-Export Pipeline] Processing changes for:", after.id);

    const userMessage = buildStage3bMessage(before, after, mapEntry);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
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
        system: stage3bPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Stage 3b API call failed (${response.status}): ${errorBody}`
      );
    }

    const data = await response.json();
    const text = data.content
      .map((block: { type: string; text?: string }) =>
        block.type === "text" ? block.text : ""
      )
      .join("");

    return extractTagContent(text, "design_changes");
  });

  const changeResults = await Promise.all(changePromises);
  const changeDocuments = changeResults.filter(
    (doc): doc is string => doc != null
  );

  // 3. Combine all change documents into one DESIGN_CHANGES.md
  const appName =
    (designBrief.app_name as string) || "Untitled App";
  let designChangesMd: string;

  if (changeDocuments.length === 0) {
    designChangesMd = `# DESIGN_CHANGES.md — ${appName}\n\n## Summary\nNo design changes detected.\n`;
  } else if (changeDocuments.length === 1) {
    designChangesMd = changeDocuments[0];
  } else {
    // Merge multiple change documents
    designChangesMd = `# DESIGN_CHANGES.md — ${appName}\n\n## Summary\nDesign changes across ${changeDocuments.length} screens.\n\n`;
    for (const doc of changeDocuments) {
      // Strip the top-level header and summary from subsequent docs, keep the Changes/Unchanged sections
      const withoutHeader = doc
        .replace(/^# DESIGN_CHANGES\.md.*\n+## Summary\n.*\n*/m, "")
        .trim();
      designChangesMd += withoutHeader + "\n\n";
    }
  }

  // 3b. Programmatically append unchanged screen files list
  const changedScreenIds = changedScreens.map((s) => s.after.id);
  const unchangedScreens = originalScreenCodes
    .filter((s) => !changedScreenIds.includes(s.id))
    .map((s) => `- \`${s.id}.jsx\` — No changes`);

  if (unchangedScreens.length > 0) {
    designChangesMd += `\n## Unchanged Screen Files\nDo not modify these files:\n${unchangedScreens.join("\n")}\n`;
  }

  // 4. Build vibekit.design.json
  const designJson = buildDesignJson({
    designBrief,
    screenCodes: currentScreenCodes,
    navStructure: null,
    activeSkin,
    iterationCount: 0,
  });

  // 5. Assemble export files
  const reExportSkinCSS = fontImportUrl
    ? `@import url('${fontImportUrl}');\n\n${skinCSS}`
    : skinCSS;
  const files: ExportFile[] = [
    { filename: "DESIGN_CHANGES.md", content: designChangesMd },
    {
      filename: "vibekit.design.json",
      content: JSON.stringify(designJson, null, 2),
    },
    { filename: "vibekit-skin.css", content: reExportSkinCSS },
  ];

  for (const screen of currentScreenCodes) {
    files.push({
      filename: `screens/${screen.id}.jsx`,
      content: screen.code,
    });
  }

  return { files };
}

function buildStage3bMessage(
  before: ScreenCode,
  after: ScreenCode,
  mapEntry: ComponentMapEntry | undefined
): string {
  const parts: string[] = [];

  parts.push("## BEFORE CODE\n");
  if (before.code) {
    parts.push(`Screen: ${before.name} (${before.id})\n`);
    parts.push("```jsx");
    parts.push(before.code);
    parts.push("```\n");
  } else {
    parts.push("(New screen — no previous version)\n");
  }

  parts.push("## AFTER CODE\n");
  parts.push(`Screen: ${after.name} (${after.id})\n`);
  parts.push("```jsx");
  parts.push(after.code);
  parts.push("```\n");

  parts.push("## COMPONENT MAP\n");
  if (mapEntry) {
    parts.push("```json");
    parts.push(JSON.stringify(mapEntry, null, 2));
    parts.push("```");
  } else {
    parts.push("(No component map available for this screen)");
  }

  return parts.join("\n");
}
