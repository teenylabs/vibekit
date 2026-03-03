# VibeKit Custom Skin Generation

## Problem

VibeKit has 6 preset skins (Modern SaaS, Warm Amber, Cool Indigo, Dark Technical, Rose Garden, Forest). When a user asks for "cream background, gold accents, Playfair Display," VibeKit picks the closest preset (Modern SaaS blue) which looks completely wrong. Every non-SaaS brief produces a mismatched design.

Lovable generates the correct aesthetic because it has no preset constraint — it just builds what you describe.

This is a blocker for MVP. If the output doesn't match what the user asked for visually, the product fails.

## Solution: Stage 1 Generates a Custom Skin

Stage 1 (Design Director) already analyzes the user's brief and produces a Design Brief JSON. Extend it to also generate a custom CSS skin based on the user's aesthetic description.

### How It Works

1. User describes their app (including any aesthetic preferences)
2. Stage 1 reads the description and generates:
   - Design Brief JSON (already exists)
   - **Custom skin CSS** (new) — CSS variables tailored to the brief
3. The custom skin gets injected into the preview alongside the existing skin system
4. Stage 2 receives the custom skin values and uses them in the generated code

### Changes Required

#### 1. Update Stage 1 Prompt (`prompts/stage1-design-director.md`)

Add this to the output format:

```
In addition to the design brief JSON, generate a custom skin.

Analyze the user's description for ANY aesthetic cues:
- Explicit: "cream background", "gold accents", "dark mode", "serif headings"
- Implied: "editorial" → warm/cream/serif, "technical" → dark/monospace, "playful" → bright/rounded, "luxury" → dark/gold/serif, "minimal" → lots of white space/thin fonts
- Brand-adjacent: "like Apple" → clean/SF Pro, "like Notion" → warm gray/serif, "like Stripe" → purple-blue/gradient

Generate a <custom_skin> block:

<custom_skin>
:root {
  /* Base */
  --background: [H S% L%];
  --foreground: [H S% L%];
  
  /* Cards & surfaces */
  --card: [H S% L%];
  --card-foreground: [H S% L%];
  
  /* Primary action color */
  --primary: [H S% L%];
  --primary-foreground: [H S% L%];
  
  /* Secondary */
  --secondary: [H S% L%];
  --secondary-foreground: [H S% L%];
  
  /* Muted / subdued */
  --muted: [H S% L%];
  --muted-foreground: [H S% L%];
  
  /* Accent (highlights, hover states) */
  --accent: [H S% L%];
  --accent-foreground: [H S% L%];
  
  /* Semantic */
  --destructive: [H S% L%];
  --destructive-foreground: [H S% L%];
  --success: [H S% L%];
  --success-foreground: [H S% L%];
  --warning: [H S% L%];
  --warning-foreground: [H S% L%];
  
  /* Borders & inputs */
  --border: [H S% L%];
  --input: [H S% L%];
  --ring: [H S% L%];
  
  /* Layout */
  --radius: [value];
  
  /* Typography */
  --font-heading: [font stack];
  --font-body: [font stack];
  --font-import: [Google Fonts URL or empty];
  
  /* Shorthand aliases */
  --bg: var(--background);
  --fg: var(--foreground);
  --primary-fg: var(--primary-foreground);
  --muted-fg: var(--muted-foreground);
  --card-fg: var(--card-foreground);
  --destructive-fg: var(--destructive-foreground);
  --accent-fg: var(--accent-foreground);
}
</custom_skin>

RULES for skin generation:
- ALWAYS generate a custom skin, even if the user doesn't mention aesthetics. Infer from the app type.
- Use HSL values without the hsl() wrapper (the h()/ha() helpers add it)
- For fonts: use Google Fonts. Include the import URL. Fall back to system fonts.
- Ensure sufficient contrast: foreground on background must be readable (WCAG AA)
- Primary color should feel intentional, not default blue
- If user says "no dark mode" or doesn't mention dark mode, generate light theme only
- Border colors should be subtle (high lightness, low saturation)

EXAMPLES:

User says "warm editorial, cream, gold, serif":
--background: 40 33% 96%;
--foreground: 30 10% 15%;
--primary: 38 75% 55%;
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-import: https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap;
--radius: 0.375rem;

User says "modern SaaS dashboard":
--background: 0 0% 100%;
--foreground: 222 47% 11%;
--primary: 221 83% 53%;
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-import: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap;
--radius: 0.5rem;

User says "dark technical, developer tool":
--background: 222 47% 8%;
--foreground: 210 40% 90%;
--primary: 142 70% 45%;
--font-heading: 'JetBrains Mono', monospace;
--font-body: 'Inter', system-ui, sans-serif;
--font-import: https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap;
--radius: 0.25rem;

User says "playful kids education app":
--background: 45 100% 97%;
--foreground: 250 30% 20%;
--primary: 262 83% 58%;
--font-heading: 'Fredoka', system-ui, sans-serif;
--font-body: 'Nunito', system-ui, sans-serif;
--font-import: https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600&display=swap;
--radius: 1rem;
```

#### 2. Update Pipeline to Extract and Apply Custom Skin (`lib/ai/pipeline.ts`)

In `runPipeline()`, after calling Stage 1:

1. Parse the `<custom_skin>` block from Stage 1's response
2. Extract the CSS string
3. Store it in DesignState as `customSkin: string`
4. If `--font-import` is present, extract the URL

#### 3. Inject Custom Skin into Preview (`components/companion/WireframePanel.tsx`)

Before rendering the react-live preview:

1. If `customSkin` exists in state, inject it as a `<style>` tag inside the preview iframe/container
2. If `--font-import` URL exists, inject a `<link>` tag for the Google Font
3. This replaces the skin dropdown — when a custom skin is generated, it's used automatically
4. The skin dropdown can still exist for switching between custom + presets, but custom is default

```tsx
// In WireframePanel, before the react-live component:
{customSkin && (
  <>
    {fontImportUrl && <link href={fontImportUrl} rel="stylesheet" />}
    <style>{customSkin}</style>
  </>
)}
```

#### 4. Update Stage 2 Prompt (`prompts/stage2-code-generator-v2.md`)

Add instruction to use font variables:

```
TYPOGRAPHY:
- Use var(--font-heading) for all headings (h1, h2, h3, page titles, card titles)
- Use var(--font-body) for all body text, labels, metadata
- Apply font-family inline: style={{ fontFamily: 'var(--font-heading)' }}
- This ensures the custom skin's fonts are used automatically
```

#### 5. Update Export to Include Custom Skin

In `lib/ai/export-pipeline.ts`:

- Replace the preset `vibekit-skin.css` with the custom skin CSS
- Include the font import URL in CLAUDE.md instructions
- The exported skin CSS should be the custom one, not a preset

#### 6. Remove or Demote Skin Dropdown

The skin dropdown (`modern-saas` selector in the top bar) should:
- Default to "Custom" when a custom skin was generated
- Still allow switching to presets for comparison
- When user switches to a preset, it overrides the custom skin

### What This Enables

With custom skin generation, VibeKit can match ANY aesthetic:
- "Cream editorial with gold accents" → cream bg, gold primary, Playfair Display
- "Dark hacker terminal" → near-black bg, green primary, JetBrains Mono
- "Soft pastel wellness app" → light lavender bg, sage green primary, rounded corners
- "Brutalist bold" → white bg, black primary, tight spacing, sharp corners
- No aesthetic mentioned → infer from app type (finance = professional blue, kids = playful, etc.)

### File Summary

| File | Change |
|------|--------|
| `prompts/stage1-design-director.md` | Add custom_skin generation to output format |
| `prompts/stage2-code-generator-v2.md` | Add font variable usage instructions |
| `lib/ai/pipeline.ts` | Parse custom_skin block, store in state |
| `components/companion/WireframePanel.tsx` | Inject custom skin CSS + font link |
| `lib/ai/export-pipeline.ts` | Export custom skin instead of preset |
| `app/design/page.tsx` | Add customSkin + fontImportUrl to DesignState |

### Testing

After implementation, test with the hair tool prompt:
```
Build a hair tools affiliate comparison site called "The Dryer Edit." 
Warm editorial design — cream background, serif headings (Playfair Display), 
clean sans body (Inter), gold accents. No dark mode.
```

Expected: cream background, Playfair Display headings, gold accents, Inter body text. Not blue SaaS.

Also test with NO aesthetic cues:
```
Build me a task management app with projects, tasks, and team views.
```

Expected: Stage 1 infers "productivity SaaS" → generates clean professional skin automatically, not just defaulting to Modern SaaS blue.
