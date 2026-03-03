# VibeKit: Export Pipeline Build Instructions

## Context

The VibeKit two-stage pipeline is built and working:
- Stage 1 (Design Director) produces a design brief from the user's app description
- Stage 2 (Code Generator) produces React/JSX screen code rendered live via react-live
- Edit pipeline lets users iterate ("make the cards bigger", "add a search bar")
- Users can switch between screens and skins

What's missing: the **Export flow**. When the user clicks Export, VibeKit needs to produce a package of files that Claude Code can build a real app from. This requires a **Stage 3** AI call (spec writer) plus some programmatic file assembly.

## What the Export Produces

A ZIP containing:

| File | How it's made | Purpose |
|------|---------------|---------|
| `CLAUDE.md` | Stage 3 AI generates | Design system rules for Claude Code |
| `SCREEN_SPEC.md` | Stage 3 AI generates | Screen-by-screen build blueprint |
| `vibekit.design.json` | Built programmatically | Machine-readable state for round-trip back to VibeKit |
| `vibekit-skin.css` | Copied from active skin | CSS variable definitions |
| `screens/{id}.jsx` | Copied from pipeline state | Individual screen React code |

## Files Provided

You're given two new files. Add them to the project:

```
vibekit/
├── prompts/
│   ├── stage1-design-director.md      ← already exists
│   ├── stage2-code-generator-v2.md    ← already exists
│   ├── selector-logic.md              ← already exists
│   └── stage3-spec-writer.md          ← NEW — add this
├── lib/
│   └── ai/
│       ├── pipeline.ts                ← already exists
│       └── export-pipeline.ts         ← NEW — add this
```

## Implementation Steps

### Step 1: Add the Stage 3 Prompt

Copy `stage3-spec-writer.md` into `prompts/`. This is the system prompt for the spec writer. It takes the design brief + final screen code + active skin CSS and produces CLAUDE.md + SCREEN_SPEC.md.

### Step 2: Add the Export Pipeline

Copy `export-pipeline.ts` into `lib/ai/`. Review the imports at the top and adjust them to match the project's actual paths:

- `STAGE3_PROMPT` — needs to load `prompts/stage3-spec-writer.md` as a raw string. Use the same approach used for loading stage1 and stage2 prompts.
- `SKIN_CSS` import — remove or adjust. The skin CSS is passed in as a parameter, not imported.

The key function is `runExportPipeline(input)` which:
1. Calls the Anthropic API with the Stage 3 prompt
2. Parses `<claude_md>` and `<screen_spec>` tags from the response
3. Builds `vibekit.design.json` programmatically (no AI needed — just serializes the pipeline state)
4. Returns all files as `{ filename, content }` pairs

### Step 3: Wire Up the Export Button

Find the existing `ExportModal.tsx` (or wherever the Export button lives). Update it to:

1. **Gather the current pipeline state.** You need:
   - `designBrief` — stored in state since Stage 1 ran (the JSON object from the `<design_brief>` tags)
   - `screenCodes` — the current array of `{ id, name, type, code }` objects that the preview panel renders from
   - `navStructure` — the `{ type, items }` object parsed from Stage 2's `<nav_structure>` output
   - `activeSkin` — the currently selected skin identifier (e.g. "modern-saas")
   - `skinCSS` — the CSS text for the active skin. You can grab this from `styles/skins/all-skins.css` or from the individual skin definitions.
   - `iterationCount` — how many edit rounds have been applied (track this in state; increment each time editPipeline runs)
   - `apiKey` — the user's Anthropic API key

2. **Call `runExportPipeline()`** with all of the above.

3. **Show a loading state.** Stage 3 takes ~30-60 seconds (one API call with ~20K tokens of context). Show a progress indicator.

4. **Create and download the ZIP.** Use JSZip (already in the project) or a similar library:

```typescript
import JSZip from "jszip";

const zip = new JSZip();
for (const file of result.files) {
  zip.file(file.filename, file.content);
}
const blob = await zip.generateAsync({ type: "blob" });

// Trigger download
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `${appName}-vibekit-export.zip`;
a.click();
URL.revokeObjectURL(url);
```

### Step 4: Track Iteration Count

Add a counter to the pipeline state that increments each time `editPipeline()` runs. This goes into `vibekit.design.json` so the round-trip import knows how much the design has been modified from the original brief.

In `app/design/page.tsx` (or wherever pipeline state lives):

```typescript
const [iterationCount, setIterationCount] = useState(0);

// In the edit handler:
const handleEdit = async (message: string) => {
  const result = await editPipeline(/* ... */);
  setIterationCount(prev => prev + 1);
  // ... update screens, etc.
};
```

### Step 5: Make the Skin CSS Accessible

The export needs the raw CSS text for the active skin. Options:

**Option A (simplest):** Store all skin CSS as a JS object:

```typescript
// lib/skins.ts
export const SKIN_CSS: Record<string, string> = {
  "modern-saas": `:root {
  --bg: 0 0% 98%;
  --fg: 222 14% 12%;
  /* ... */
}`,
  "warm-amber": `[data-skin="warm-amber"] {
  --bg: 35 28% 97%;
  /* ... */
}`,
  // ... other skins
};
```

**Option B:** Read from `styles/skins/all-skins.css` at build time and split by skin name.

Either way, `runExportPipeline` receives the CSS string as the `skinCSS` parameter.

## State the Export Needs Access To

Make sure these are all stored in the page/component state and accessible when the user clicks Export:

| State | Set when | Used for |
|-------|----------|----------|
| `designBrief` | Stage 1 completes | Original design intent + data model |
| `screenCodes` | Stage 2 completes, updated by editPipeline | Source of truth for current UI |
| `navStructure` | Stage 2 completes | Navigation structure |
| `activeSkin` | User picks a skin | Skin identifier for design.json |
| `iterationCount` | Incremented on each edit | Tracks divergence from original brief |
| `apiKey` | User enters it | Needed for Stage 3 API call |

If any of these aren't currently in state, add them. The `designBrief` is the most likely one that might be getting discarded after Stage 1 — make sure it's preserved.

## Error Handling

- If Stage 3 fails (API error), show an error toast. Don't crash.
- If Stage 3 returns text that doesn't contain the expected `<claude_md>` / `<screen_spec>` tags, show "Export failed — the spec writer didn't produce the expected format. Try again."
- If JSZip isn't installed, run `npm install jszip`.

## Testing

After implementation, test with at least two different app types:

1. **Finance tracker** (tab nav, comfortable density) — you have the Pocketbook test export as a reference for what good output looks like
2. **Recipe/consumer app** (browse-and-drill, spacious) — verify the CLAUDE.md has image card patterns instead of progress bar patterns
3. **SaaS dashboard** (sidebar, compact) — verify it describes sidebar layout, not centered single column

For each, check:
- Does CLAUDE.md describe the component patterns actually used in the screens?
- Does SCREEN_SPEC.md describe every section of every screen accurately?
- Does vibekit.design.json contain the full screen code?
- Can you give the CLAUDE.md + SCREEN_SPEC.md + skin CSS to Claude Code and get a recognizable app back?

## Don'ts

- Don't modify the Stage 1 or Stage 2 prompts. This is additive.
- Don't change how the preview panel or edit pipeline works. Export reads from the same state, it doesn't change it.
- Don't try to have the AI generate the vibekit.design.json. It's built programmatically — simpler and more reliable.
