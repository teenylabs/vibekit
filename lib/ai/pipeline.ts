import { selectReferences } from "./select-references";
import { loadReferences } from "./load-references";
import stage1Prompt from "@/prompts/stage1-design-director.md";
import stage2Template from "@/prompts/stage2-code-generator-v2.md";

export interface ScreenCode {
  id: string;
  name: string;
  type: string;
  code: string;
}

export interface PipelineResult {
  conversationalText: string;
  designBrief: Record<string, unknown> | null;
  screenCodes: ScreenCode[];
  navStructure: Record<string, unknown> | null;
  customSkin: string | null;
  fontImportUrl: string | null;
}

export async function editPipeline(
  editMessage: string,
  currentScreenCodes: ScreenCode[],
  designBrief: Record<string, unknown>,
  apiKey: string
): Promise<PipelineResult> {
  console.log("[VibeKit Edit Pipeline] Starting edit pipeline");
  console.log("[VibeKit Edit Pipeline] Edit message:", editMessage.slice(0, 100));
  console.log("[VibeKit Edit Pipeline] Current screens:", currentScreenCodes.map(s => s.id));

  // Build current screens context
  const currentScreensBlock = currentScreenCodes
    .map(sc => `<current_screen id="${sc.id}" name="${sc.name}" type="${sc.type}">\n${sc.code}\n</current_screen>`)
    .join("\n\n");

  // Build edit-specific system prompt reusing CSS variable system and visual rules from stage2
  const editSystemPrompt = `# Screen Edit Mode

You are an expert React/Tailwind developer. You are given the current screens of an app and a user's edit request. Apply the requested change while keeping everything else the same.

---

## CSS VARIABLE SYSTEM

All colors MUST use CSS variables via these helpers. Include them at the top of every component:

\`\`\`jsx
const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;
\`\`\`

Available variables:
- \`h("--bg")\`, \`h("--fg")\` — page background and text
- \`h("--primary")\`, \`h("--primary-fg")\` — primary actions and their text
- \`h("--muted")\`, \`h("--muted-fg")\` — muted backgrounds and secondary text
- \`h("--card")\`, \`h("--card-fg")\` — card surfaces
- \`h("--border")\` — borders and dividers
- \`h("--ring")\` — focus rings
- \`h("--destructive")\`, \`h("--destructive-fg")\` — danger/delete actions
- \`h("--accent")\`, \`h("--accent-fg")\` — accent highlights

For opacity variants: \`ha("--primary", 0.1)\` produces \`hsl(var(--primary) / 0.1)\`

**NEVER use:**
- Raw Tailwind colors (bg-blue-500, text-red-600)
- Hardcoded hex or rgb values
- Exception: semantic status colors (green for success, amber for warning) may use hsl() directly

---

## OUTPUT FORMAT

Output ALL screens using the same \`<screen_code>\` format, even if unchanged. This allows a full replacement.

\`\`\`
<screen_code id="screen-id" name="Screen Name" type="page|dialog|sheet">
import { useState } from "react";

const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function ScreenName() {
  return (
    <div style={{ background: h("--bg"), color: h("--fg") }}>
      {/* Complete screen UI */}
    </div>
  );
}
</screen_code>
\`\`\`

Navigation between screens: \`data-navigate="screen-id"\` on clickable elements.
Overlays: \`data-overlay="screen-id"\` for dialogs/sheets.

---

## DESIGN BRIEF (for reference)

${JSON.stringify(designBrief, null, 2)}

---

## CURRENT SCREENS

Study the current screen code carefully. Understand what's working well — the layout choices, spacing, color usage, interaction patterns. Now incorporate the user's requested change in a way that makes the overall design BETTER, not just different. The change should feel like it was always part of the design, not bolted on. Preserve the app name, data, and personality. Improve spacing, alignment, and visual hierarchy if incorporating the change creates opportunities to do so. Output all screens with the changes incorporated using the same \`<screen_code>\` format.

${currentScreensBlock}

---

## INSTRUCTIONS

1. Study the current screens — understand what's working well
2. Incorporate the user's requested change so it feels native to the design
3. If the change creates opportunities to improve spacing, alignment, or visual hierarchy, take them
4. Preserve the app's identity: same app name, data, and personality
5. Output ALL screens (even unchanged ones) so the full set can be replaced
6. Keep the same screen IDs, names, and types
7. Keep realistic data, hover states, and visual polish intact
8. 1-2 sentences confirming what you changed, then the screen_code blocks`;

  const editResponse = await fetch("https://api.anthropic.com/v1/messages", {
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
      system: editSystemPrompt,
      messages: [{ role: "user", content: editMessage }],
    }),
  });

  if (!editResponse.ok) {
    const errorBody = await editResponse.text();
    throw new Error(`Edit Pipeline API error ${editResponse.status}: ${errorBody}`);
  }

  const editData = await editResponse.json();
  const editText = editData.content[0].text;
  const stopReason = editData.stop_reason;
  console.log("[VibeKit Edit Pipeline] Response length:", editText.length, "stop_reason:", stopReason);
  if (stopReason === "max_tokens") {
    console.warn("[VibeKit Edit Pipeline] Response was TRUNCATED — output hit max_tokens limit");
  }

  // Parse screen_code blocks — same regex as runPipeline
  const screenCodes: ScreenCode[] = [];
  const codeRegex = /<screen_code\s+[^>]*?id="([^"]+)"[^>]*?name="([^"]+)"[^>]*?type="([^"]+)"[^>]*?>([\s\S]*?)<\/screen_code>/g;
  let match;
  while ((match = codeRegex.exec(editText)) !== null) {
    screenCodes.push({
      id: match[1],
      name: match[2],
      type: match[3],
      code: match[4].trim(),
    });
  }

  if (screenCodes.length === 0 || stopReason === "max_tokens") {
    const openTags = [...editText.matchAll(/<screen_code\s+[^>]*?id="([^"]+)"[^>]*?>/g)];
    if (openTags.length > screenCodes.length) {
      console.warn(`[VibeKit Edit Pipeline] Found ${openTags.length} <screen_code> open tags but only ${screenCodes.length} complete blocks`);
    }
  }
  console.log("[VibeKit Edit Pipeline] Parsed", screenCodes.length, "screen codes:", screenCodes.map(s => `${s.id} (${s.type})`));

  // Extract conversational text (everything before the first <screen_code> tag)
  const firstScreenTag = editText.indexOf("<screen_code");
  const conversationalText = firstScreenTag > 0
    ? editText.slice(0, firstScreenTag).trim()
    : "Changes applied.";

  return {
    conversationalText,
    designBrief,
    screenCodes,
    navStructure: null,
    customSkin: null,
    fontImportUrl: null,
  };
}

export async function runPipeline(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<PipelineResult> {
  console.log("[VibeKit Pipeline] Starting Stage 1 — Design Director");
  console.log("[VibeKit Pipeline] User message:", userMessage.slice(0, 100));
  console.log("[VibeKit Pipeline] API key present:", !!apiKey, "length:", apiKey.length);

  // ── STAGE 1: Design Director ──
  const stage1Response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: stage1Prompt,
      messages: [...conversationHistory, { role: "user", content: userMessage }],
    }),
  });

  if (!stage1Response.ok) {
    const errorBody = await stage1Response.text();
    throw new Error(`Stage 1 API error ${stage1Response.status}: ${errorBody}`);
  }

  const stage1Data = await stage1Response.json();
  const stage1Text = stage1Data.content[0].text;
  console.log("[VibeKit Pipeline] Stage 1 response received, length:", stage1Text.length);

  // Parse design brief from <design_brief> tags
  const briefMatch = stage1Text.match(/<design_brief>([\s\S]*?)<\/design_brief>/);
  if (!briefMatch) {
    // Stage 1 is asking a clarifying question — return just the text
    console.log("[VibeKit Pipeline] No design brief found — clarifying question");
    return {
      conversationalText: stage1Text,
      designBrief: null,
      screenCodes: [],
      navStructure: null,
      customSkin: null,
      fontImportUrl: null,
    };
  }

  const designBrief = JSON.parse(briefMatch[1]);
  const conversationalText = stage1Text
    .replace(/<design_brief>[\s\S]*?<\/design_brief>/, "")
    .replace(/<custom_skin>[\s\S]*?<\/custom_skin>/, "")
    .trim();
  console.log("[VibeKit Pipeline] Design brief parsed, app:", designBrief.app_name);

  // Parse custom skin from <custom_skin> tags
  const skinMatch = stage1Text.match(/<custom_skin>([\s\S]*?)<\/custom_skin>/);
  let customSkin: string | null = null;
  let fontImportUrl: string | null = null;
  if (skinMatch) {
    const skinContent = skinMatch[1].trim();
    // Rewrite :root selector to [data-skin="custom"] so it works with the skin system
    customSkin = skinContent.replace(/^:root\s*\{/, '[data-skin="custom"] {');
    console.log("[VibeKit Pipeline] Custom skin parsed");
    // Extract font import URL
    const fontImportMatch = skinContent.match(/--font-import:\s*(.+?);/);
    if (fontImportMatch) {
      const url = fontImportMatch[1].trim();
      if (url && url !== "empty" && url.startsWith("http")) {
        fontImportUrl = url;
        console.log("[VibeKit Pipeline] Font import URL:", fontImportUrl);
      }
    }
  }

  // ── SELECTOR ──
  const refNames = selectReferences(designBrief);
  console.log("[VibeKit Pipeline] Selected references:", refNames);
  console.log("[VibeKit Pipeline] Starting Stage 2 — Code Generator");
  const refContents = loadReferences(refNames);

  // ── STAGE 2: Code Generator ──
  let stage2Prompt = stage2Template
    .replace("{INJECT_DESIGN_BRIEF}", JSON.stringify(designBrief, null, 2));

  refContents.forEach((content, i) => {
    stage2Prompt = stage2Prompt.replace(
      `{INJECT_REFERENCE_${i + 1}}`,
      "```jsx\n" + content + "\n```"
    );
  });

  // Remove any remaining unreplaced reference slots
  stage2Prompt = stage2Prompt.replace(/\{INJECT_REFERENCE_\d+\}/g, "(no additional reference)");

  const stage2Response = await fetch("https://api.anthropic.com/v1/messages", {
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
      system: stage2Prompt,
      messages: [{ role: "user", content: "Generate the screens now." }],
    }),
  });

  if (!stage2Response.ok) {
    const errorBody = await stage2Response.text();
    throw new Error(`Stage 2 API error ${stage2Response.status}: ${errorBody}`);
  }

  const stage2Data = await stage2Response.json();
  const stage2Text = stage2Data.content[0].text;
  const stopReason = stage2Data.stop_reason;
  console.log("[VibeKit Pipeline] Stage 2 response length:", stage2Text.length, "stop_reason:", stopReason);
  if (stopReason === "max_tokens") {
    console.warn("[VibeKit Pipeline] Stage 2 was TRUNCATED — output hit max_tokens limit");
  }

  // Parse screen_code blocks — flexible attribute order and whitespace
  const screenCodes: ScreenCode[] = [];
  const codeRegex = /<screen_code\s+[^>]*?id="([^"]+)"[^>]*?name="([^"]+)"[^>]*?type="([^"]+)"[^>]*?>([\s\S]*?)<\/screen_code>/g;
  let match;
  while ((match = codeRegex.exec(stage2Text)) !== null) {
    screenCodes.push({
      id: match[1],
      name: match[2],
      type: match[3],
      code: match[4].trim(),
    });
  }

  // If regex missed some, try to find unclosed screen_code blocks (truncated response)
  if (screenCodes.length === 0 || stopReason === "max_tokens") {
    const openTags = [...stage2Text.matchAll(/<screen_code\s+[^>]*?id="([^"]+)"[^>]*?>/g)];
    if (openTags.length > screenCodes.length) {
      console.warn(`[VibeKit Pipeline] Found ${openTags.length} <screen_code> open tags but only ${screenCodes.length} complete blocks`);
      console.log("[VibeKit Pipeline] All screen IDs found in open tags:", openTags.map(m => m[1]));
    }
  }
  console.log("[VibeKit Pipeline] Parsed", screenCodes.length, "screen codes:", screenCodes.map(s => `${s.id} (${s.type})`));

  // Parse nav_structure
  const navMatch = stage2Text.match(/<nav_structure[^>]*>([\s\S]*?)<\/nav_structure>/);
  let navStructure = null;
  if (navMatch) {
    try {
      navStructure = JSON.parse(navMatch[1]);
    } catch {
      console.warn("Failed to parse nav_structure JSON");
    }
  }

  return { conversationalText, designBrief, screenCodes, navStructure, customSkin, fontImportUrl };
}
