# VibeKit Quick Wins: Prompt Improvements

## Context

Read `vibekit-handoff-v4-final.md` for full project context. These are prompt-only changes to close the quality gap with Lovable. Apply all of them.

## Fix 1: Screen Completeness — Generate ALL Requested Pages

**Change `prompts/stage1-design-director.md`:**

Add this instruction:

```
SCREEN COUNT RULE:
If the user lists specific pages (e.g., "Homepage, Product Listing, Product Detail, Comparison, Best For page"), 
you MUST include ALL of them in the nav_structure. Do not reduce, combine, or skip pages.

If the user describes 5 pages, generate 5 screens. If they describe 8 pages, generate 8 screens.
Only reduce screen count if the user's request is clearly redundant (two pages that are identical).

Count the pages in the user's message. Count the screens in your nav_structure. 
These numbers must match.
```

**Also change `prompts/stage2-code-generator-v2.md`:**

Add:

```
SCREEN COUNT:
Generate a complete, separate JSX component for EVERY screen in the design brief's nav_structure.
If the brief lists 5 screens, you must output 5 screen components. No exceptions.
Do not combine screens or skip "less important" ones.
```

## Fix 2: Content Density — Include ALL User-Specified Data

**Change `prompts/stage2-code-generator-v2.md`:**

Add to the Quality Standards section:

```
### 8. Content Density
Every data point the user mentions MUST appear in the UI. Do not simplify or reduce.

If the user says "Product cards: image, brand, name, price, hair type compatibility dots, skill level badge"
then EVERY product card must show ALL of those: image area, brand, name, price, compatibility dots, AND skill level badge.

If the user says "Tabs: Overview, Hair Types, Ease of Use, Features, Specs"
then generate ALL 5 tabs with real content in each.

If the user says "4-5 products"
then show ALL 4-5 products, not 2.

Rules:
- Count the data points in the user's description for each component
- Count the data points in your generated component
- If yours has fewer, add the missing ones
- Show the MAXIMUM number of items the user specified (if they say "4-5", show 5)
- Every table, list, grid, or card set should feel FULL, not sparse
- If a section has tabs, every tab must have real content (not "coming soon" or empty)
```

## Fix 3: Copy Quality — Write Opinionated, Specific Content

**Change `prompts/stage2-code-generator-v2.md`:**

Add to the Quality Standards section:

```
### 9. Copy Quality
All text content must read like it was written by a subject-matter expert, not a generic AI.

BAD (generic):
- "This is a great product with many features"
- "Our tool helps you get things done"
- "A popular choice for many users"

GOOD (specific, opinionated):
- "Half the price of the Dyson Airwrap with 80% of the results"
- "The flex hinge that converts it from a dryer to a styler is genuinely clever"
- "Doesn't feel as premium — more plastic, less heft"

Rules:
- Headlines must make a specific claim or promise, not a vague one
- Product descriptions must include at least one honest trade-off or limitation
- Comparison text must take a clear position ("Choose A if... Choose B if...")
- Review/editorial copy must sound like a real human who tested the product
- CTAs must be specific to the action: "Find Your Perfect Tool" not "Get Started"
- Subheadings should inform, not just label: "Lighter than Airwrap; flex hinge feels natural" not "Weight & Ergonomics"
- If the app has an editorial voice (reviews, guides, recommendations), write in first person plural: "We tested...", "In our experience..."
```

## Fix 4: Image Placeholders (Temporary — until iframe migration)

**Change `prompts/stage2-code-generator-v2.md`:**

Add:

```
### 10. Image Placeholders
Since external images cannot load in the preview, create styled placeholder boxes that clearly communicate what image belongs there.

For PRODUCT images:
- Use a warm gray/cream background box with rounded corners
- Show the product name centered in bold
- Show the brand in smaller text above
- Add a subtle icon or emoji that suggests the category
- Example: A box saying "🔥 Dyson" above "Airwrap Multi-Styler" in a cream rounded rectangle

For CATEGORY images:
- Use a gradient background in the category's accent color
- Show the category name and item count
- Example: A gradient box saying "Multi-Stylers" with "12 products tested"

For HERO/BANNER images:
- Use a full-width gradient with the app's primary and accent colors
- Overlay the hero text on top

For AVATAR/PROFILE images:
- Use colored circles with initials (already standard)

NEVER use broken image tags, empty boxes, or generic gray rectangles.
Every image placeholder must communicate WHAT image should go there.
```

## File Summary

| File | Change |
|------|--------|
| `prompts/stage1-design-director.md` | Screen count rule (generate ALL requested pages) |
| `prompts/stage2-code-generator-v2.md` | Content density (#8), Copy quality (#9), Image placeholders (#10), Screen count reminder |
