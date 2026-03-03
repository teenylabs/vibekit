import type { ScreenSpec } from "@/lib/spec-types";

export function parseAIResponse(rawText: string): {
  message: string;
  spec: ScreenSpec | null;
} {
  const openTag = "<screen_spec>";
  const closeTag = "</screen_spec>";

  const openIndex = rawText.indexOf(openTag);
  let closeIndex = rawText.indexOf(closeTag);

  if (openIndex === -1) {
    return { message: rawText, spec: null };
  }

  // If closing tag is missing (truncated response), try to parse
  // everything after the open tag as JSON
  const isTruncated = closeIndex === -1 || closeIndex <= openIndex;

  const beforeTag = rawText.slice(0, openIndex).trim();
  let jsonString: string;
  let afterTag = "";

  if (isTruncated) {
    jsonString = rawText.slice(openIndex + openTag.length).trim();
    // Try to fix truncated JSON by closing any open braces/brackets
    jsonString = attemptFixTruncatedJson(jsonString);
  } else {
    jsonString = rawText
      .slice(openIndex + openTag.length, closeIndex)
      .trim();
    afterTag = rawText.slice(closeIndex + closeTag.length).trim();
  }

  const message = [beforeTag, afterTag].filter(Boolean).join("\n\n");

  try {
    const spec = JSON.parse(jsonString) as ScreenSpec;
    console.log("[parseAIResponse] Successfully parsed spec with", spec.screens?.length, "screens");
    return { message: message || "Here's the design I've put together.", spec };
  } catch (err) {
    console.warn("[parseAIResponse] Failed to parse JSON:", err);
    console.warn("[parseAIResponse] JSON starts with:", jsonString.slice(0, 100));
    console.warn("[parseAIResponse] JSON ends with:", jsonString.slice(-100));
    return { message: message || rawText, spec: null };
  }
}

/**
 * Attempts to fix truncated JSON by closing open braces/brackets.
 * This handles the common case where the API response was cut off
 * before the closing </screen_spec> tag.
 */
function attemptFixTruncatedJson(json: string): string {
  // Strip any trailing incomplete string (cut mid-value)
  // Find the last complete key-value or array element
  let trimmed = json.replace(/,\s*$/, "");

  // Count open vs close braces and brackets
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;

  for (const ch of trimmed) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") openBraces++;
    if (ch === "}") openBraces--;
    if (ch === "[") openBrackets++;
    if (ch === "]") openBrackets--;
  }

  // If we're inside a string, close it
  if (inString) {
    trimmed += '"';
  }

  // Remove any trailing partial key-value pair (e.g., `"key": ` with no value)
  trimmed = trimmed.replace(/,?\s*"[^"]*":\s*$/, "");
  // Remove trailing comma
  trimmed = trimmed.replace(/,\s*$/, "");

  // Close any open brackets then braces
  for (let i = 0; i < openBrackets; i++) trimmed += "]";
  for (let i = 0; i < openBraces; i++) trimmed += "}";

  return trimmed;
}
