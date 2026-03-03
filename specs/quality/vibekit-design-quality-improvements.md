# VibeKit Design Quality: Stage 2 Prompt Improvements

## Context

Read `vibekit-handoff-v3-march3.md` for full project context. The pipeline generates functional apps but the visual quality is noticeably below hand-crafted examples. All 7 fixes below are additions to `prompts/stage2-code-generator-v2.md`. No code changes needed — pure prompt engineering.

These rules should be added as a new section called "## Quality Standards" near the end of the prompt, after the code generation rules but before any output format instructions.

## Changes to `prompts/stage2-code-generator-v2.md`

Add this section:

```markdown
## Quality Standards (Mandatory)

Every screen you generate MUST meet ALL of these standards. Check each one before outputting.

### 1. Sample Data Quality
Never use placeholder or generic data. Every data item must be specific and realistic:
- Use real brand names: "Whole Foods Market", "Blue Bottle Coffee", "Spotify Premium" — not "Store 1" or "Item A"
- Dollar amounts must include cents: $127.43, $6.50, $15.99 — not $100 or $50
- Names must be diverse and realistic (first + last): "Marcus Johnson", "Priya Patel", "Emma Zhang" — not "User 1"
- Descriptions must include a specific number or metric: "Cut research time by 92%", "3.2 days average" — not "A great tool"
- Dates must be specific: "Jan 15, 2024", "Mar 8" — not "Recently" or "Last week"

### 2. Color Distribution (minimum 6 uses of primary)
Every screen MUST have at least 6 distinct uses of primary color beyond the main CTA button. Count them before outputting:
1. Nav logo/icon background: `h("--primary")` or gradient with primary
2. Active nav item: `ha("--primary", 0.08)` background
3. Avatar/initials circles: `ha("--primary", 0.12)` background + `h("--primary")` text
4. Key metric numbers: `h("--primary")` color
5. Category/status badges: `ha("--primary", 0.1)` background + `h("--primary")` text
6. "View all" / action links: `h("--primary")` color
7. Active filter pills: `h("--primary")` background
8. Tab underlines or active indicators: `h("--primary")`
If you count fewer than 6, add more before outputting.

### 3. Mandatory Gradients
Flat backgrounds look generic. These elements MUST use gradients:
- The most prominent card/hero section: `linear-gradient(135deg, ${ha("--primary", 0.08)}, ${ha("--primary", 0.02)})` background + `ha("--primary", 0.15)` border
- App logo/icon: `linear-gradient(135deg, ${ha("--primary", 0.25)}, ${ha("--primary", 0.08)})` — not flat primary
- Any hero or banner section: Add radial gradient blobs for depth: `radial-gradient(circle, ${ha("--primary", 0.08)}, transparent 70%)` positioned with absolute divs
- If images are present, EVERY image must have a gradient overlay: `linear-gradient(to top, ${ha("--fg", 0.35)}, transparent 50%)`

### 4. Multi-Property Hover States
Single-property hovers look cheap. Use these exact recipes:
- **Cards**: `transform: translateY(-3px)` + `boxShadow: 0 8px 24px ${ha("--fg", 0.08)}` — always combine lift AND shadow
- **Images inside cards**: `transform: scale(1.05)` with `transition: 0.5s` and `overflow: hidden` on container
- **Primary CTA buttons**: `opacity: 0.9` + `transform: translateY(-1px)` + `boxShadow: 0 8px 24px ${ha("--primary", 0.3)}`
- **Secondary buttons**: `background: ${ha("--muted", 0.5)}` (darken slightly)
- **List items / table rows**: `background: ${ha("--muted", 0.15)}`
- **FAB button**: `transform: scale(1.1)`
- **Text links**: color change from `h("--muted-fg")` to `h("--primary")`
Always include `transition: all 0.2s` on the base element. Implement via onMouseEnter/onMouseLeave setting state or direct style mutation.

### 5. Typography Hierarchy (3:1+ ratio)
Everything the same size looks flat. Enforce dramatic contrast:
- Hero headlines / balance numbers: minimum fontSize 28, ideally 36+, fontWeight 800
- Stat card numbers / key metrics: minimum fontSize 20, fontWeight 700
- Section headers: fontSize 14, fontWeight 600
- Body text / descriptions: fontSize 13-14, color ha("--fg", 0.85)
- Card titles: fontSize 14-15, fontWeight 600
- Metadata / timestamps: fontSize 11-12, color h("--muted-fg")
- Tiny badges: fontSize 10-11
The ratio between the largest text (hero) and smallest text (metadata) must be at least 3:1. If your largest is 18px and smallest is 14px, that's only 1.3:1 — too flat. Fix it.

### 6. Intentional Negative Space (2:1+ spacing ratio)
Uniform spacing looks robotic. Create rhythm:
- Hero sections: paddingTop ≥ 64px, paddingBottom ≥ 48px — generous, lets it breathe
- Space between major sections: ≥ 24px (use space-y-6 or gap-6)
- Space between related items within a section: ≤ 12px (use space-y-2 or gap-3)
- Card grid gaps: ≥ 20px (gap-5 or style gap: 20px)
- Inside card padding: 16-20px
- Between a label and its value: 4-8px (tight, signals grouping)
The ratio between section spacing and item spacing must be at least 2:1. If everything uses gap-4 (16px), that's 1:1 — too uniform. Fix it.

### 7. Finishing Touches Checklist
Every screen MUST include ALL of these. Check before outputting:
- [ ] `fontVariantNumeric: "tabular-nums"` on ALL numbers (prices, stats, counts, dates with numbers)
- [ ] `letterSpacing: "-0.02em"` on all headlines (fontSize ≥ 18)
- [ ] `lineHeight: 1.1` to `1.2` on hero text (not default 1.5)
- [ ] Line clamping on card titles/descriptions: add `overflow: hidden`, `display: -webkit-box`, `WebkitLineClamp: 2`, `WebkitBoxOrient: vertical` for any text that could overflow
- [ ] Number formatting with proper signs, commas, decimals: "+$4,250.00", "-$127.43" — use toLocaleString('en-US', { minimumFractionDigits: 2 })
- [ ] Category-specific or status-specific colors where applicable (not everything primary)
- [ ] Dividers between list items: `borderBottom: 1px solid ${ha("--border", 0.2)}`
- [ ] Hidden scrollbars on horizontal scroll containers: `scrollbarWidth: "none"`, `WebkitOverflowScrolling: "touch"`
```

## Verification

After applying, test by generating a new app:
1. Open VibeKit, type "Build me a recipe discovery app with home feed, search, and recipe detail"
2. Check the output against each of the 7 standards
3. Compare visually to the test harness apps (vibekit-test-harness.html, pocketbook-pipeline-test.html)

The output should have: real food names and recipe titles, 6+ primary color uses, gradient on the hero/featured section, multi-property hover on recipe cards, dramatic type scale (recipe title 28px+ vs metadata 11px), generous hero spacing with tight card internals, and tabular-nums on all cooking times and ratings.

## File Summary

| File | Change |
|------|--------|
| `prompts/stage2-code-generator-v2.md` | Add "Quality Standards" section with 7 mandatory rules |
