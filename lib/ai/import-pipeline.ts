// lib/ai/import-pipeline.ts
//
// Stage 0: Reads real source files and produces self-contained preview JSX,
// component maps, and design metadata via the codebase reader AI.
// Uses a single API call for all files to minimize latency.

import stage0Prompt from "@/prompts/stage0-codebase-reader.md";
import type { ScreenCode } from "./pipeline";

// ─── Types ───

export interface ImportInput {
  files: { path: string; content: string }[];
  apiKey: string;
}

export interface ComponentMapSection {
  id: string;
  label: string;
  source_file: string;
  line_range: [number, number] | null;
  description: string;
}

export interface ComponentMapEntry {
  screen_id: string;
  screen_name: string;
  route: string;
  source_files: string[];
  sections: ComponentMapSection[];
}

export type ComponentMap = ComponentMapEntry[];

export interface ImportResult {
  screenCodes: ScreenCode[];
  componentMap: ComponentMap;
  navStructure: Record<string, unknown>;
  designBrief: Record<string, unknown>;
}

// ─── Helpers ───

function identifyPages(
  files: { path: string; content: string }[]
): { pages: typeof files; components: typeof files } {
  const pages: typeof files = [];
  const components: typeof files = [];

  for (const file of files) {
    const isPagePath =
      file.path.includes("app/") ||
      file.path.includes("pages/");
    const hasDefaultExport =
      /export\s+default/.test(file.content);

    if (isPagePath && hasDefaultExport) {
      pages.push(file);
    } else {
      components.push(file);
    }
  }

  // If no pages found by path heuristic, treat files with default export as pages
  if (pages.length === 0) {
    for (const file of files) {
      if (/export\s+default/.test(file.content)) {
        pages.push(file);
      } else {
        components.push(file);
      }
    }
  }

  return { pages, components };
}

function buildFileContext(files: { path: string; content: string }[]): string {
  return files
    .map((f) => `--- ${f.path} ---\n${f.content}`)
    .join("\n\n");
}

function parseAllScreenCodes(text: string): ScreenCode[] {
  const results: ScreenCode[] = [];
  const regex =
    /<screen_code\s+[^>]*?id="([^"]+)"[^>]*?name="([^"]+)"[^>]*?type="([^"]+)"[^>]*?>([\s\S]*?)<\/screen_code>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      id: match[1],
      name: match[2],
      type: match[3],
      code: match[4].trim(),
    });
  }
  return results;
}

function parseAllComponentMaps(text: string): ComponentMapEntry[] {
  const results: ComponentMapEntry[] = [];
  const regex = /<component_map>([\s\S]*?)<\/component_map>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      results.push(JSON.parse(match[1].trim()));
    } catch {
      console.warn("[Import Pipeline] Failed to parse a component_map JSON block");
    }
  }
  return results;
}

function parseDesignMeta(
  text: string
): Record<string, unknown> | null {
  const regex = /<design_meta>([\s\S]*?)<\/design_meta>/;
  const match = text.match(regex);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    console.warn("[Import Pipeline] Failed to parse design_meta JSON");
    return null;
  }
}

async function callStage0(
  systemPrompt: string,
  userMessage: string,
  apiKey: string
): Promise<string> {
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
      max_tokens: 16384,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Stage 0 API error ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();
  return data.content[0].text;
}

// ─── Import Pipeline ───

export async function runImportPipeline(
  input: ImportInput
): Promise<ImportResult> {
  const { files, apiKey } = input;

  if (files.length === 0) {
    throw new Error("No files provided for import");
  }

  console.log("[Import Pipeline] Starting with", files.length, "files");

  const { pages, components } = identifyPages(files);
  console.log(
    "[Import Pipeline] Identified",
    pages.length,
    "pages and",
    components.length,
    "components"
  );

  if (pages.length === 0) {
    throw new Error(
      "No page files found. Make sure your files include components with default exports."
    );
  }

  const allFileContext = buildFileContext(files);
  const pageList = pages.map((p) => p.path).join(", ");

  // Single API call with all files — prompt handles multiple pages
  console.log("[Import Pipeline] Sending all files in a single API call");

  const userMessage = `Process ALL of these page files: ${pageList}

Produce a <screen_code>, <component_map>, and (for the first page only) <design_meta> block for EACH page.

Here are all the source files:

${allFileContext}`;

  const responseText = await callStage0(stage0Prompt, userMessage, apiKey);

  // Parse all blocks from the single response
  const screenCodes = parseAllScreenCodes(responseText);
  const componentMap = parseAllComponentMaps(responseText);
  const designBrief = parseDesignMeta(responseText) || {};

  console.log(
    "[Import Pipeline] Complete.",
    screenCodes.length,
    "screens,",
    componentMap.length,
    "maps"
  );

  if (screenCodes.length === 0) {
    throw new Error(
      "Stage 0 did not produce any screen previews. Try with different files."
    );
  }

  const navStructure: Record<string, unknown> = {
    type: (designBrief as Record<string, unknown>).nav_model || "sidebar",
    items: componentMap.length > 0
      ? componentMap[0].sections
          .filter(
            (s) =>
              s.id.includes("nav") ||
              s.label.toLowerCase().includes("nav")
          )
          .map((s) => ({ label: s.label, screen: componentMap[0].screen_id }))
      : [],
  };

  return {
    screenCodes,
    componentMap,
    navStructure,
    designBrief,
  };
}
