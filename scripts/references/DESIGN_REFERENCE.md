# Design Reference Extractions

> Generated on 2026-02-24
> Sources: shadcn-blocks, shadcn-dashboard, shadcn-cards, shadcn-forms, shadcn-mail, linear, vercel

---

## shadcn-blocks
**URL:** https://ui.shadcn.com/blocks

Based on my analysis of this screenshot, here are the extracted design system values:

## **Card**
- padding: ~24px
- box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
- border-radius: ~8px
- border: 1px solid #e5e7eb

## **Badge**
- padding: ~4px 8px (vertical/horizontal)
- font-size: ~12px
- font-weight: 500
- border-radius: ~4px

## **Button**
- height: ~36px
- padding: ~8px 16px (horizontal)
- font-size: ~14px
- font-weight: 500

## **Table**
- row height: ~48px
- cell padding: ~12px 16px
- header style: font-weight: 600, background: #f9fafb, text-transform: none

## **Spacing**
- section gaps: ~48px
- content margins: ~24px (horizontal page margins)
- component gaps: ~16px (between sibling elements)

## **Typography**
- h1: ~32px, font-weight: 700
- h2: ~24px, font-weight: 600
- h3: ~18px, font-weight: 600
- body text: ~14px
- line-height: ~1.5
- font-family: sans-serif (appears to be system font stack or similar to Inter/Helvetica)

## **Colors**
- background (page): #ffffff
- background (card): #ffffff
- background (sidebar): #f9fafb
- text (primary): #111827
- text (secondary/muted): #6b7280
- border colors: #e5e7eb
- accent/brand color: #3b82f6 (blue)

Note: Many values are estimated (~) based on visual analysis of the screenshot. Actual implementation may vary slightly.

---

## shadcn-dashboard
**URL:** https://ui.shadcn.com/examples/dashboard

Based on my analysis of this design system dashboard screenshot, here are the extracted CSS property values:

## **Card**
- padding: ~24px
- box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
- border-radius: ~6px
- border: 1px solid #e5e7eb

## **Badge**
- padding: ~4px 8px (vertical ~4px, horizontal ~8px)
- font-size: ~12px
- font-weight: 500
- border-radius: ~12px

## **Button**
- height: ~36px
- padding: ~8px 16px (horizontal)
- font-size: ~14px
- font-weight: 500

## **Table**
- row height: ~48px
- cell padding: ~12px 16px
- header style: 
  - font-weight: 600
  - background: #f9fafb
  - text-transform: none

## **Spacing**
- section gaps: ~32px (space between major sections)
- content margins: ~24px (page-level horizontal margins)
- component gaps: ~16px (space between sibling elements)

## **Typography**
- h1 (main heading): ~32px, font-weight: 600
- h2 (section headings): ~20px, font-weight: 600
- h3 (card titles): ~16px, font-weight: 600
- body text: ~14px
- line-height: ~1.5
- font-family: sans-serif (appears to be system font stack)

## **Colors**
- background (page): #ffffff
- background (sidebar): #f9fafb
- background (card): #ffffff
- text (primary): #111827
- text (secondary/muted): #6b7280
- border colors: #e5e7eb
- accent/brand color: #2563eb (blue)
- success color: #10b981 (green)
- warning color: #f59e0b (amber)

## **Additional Notable Elements**
- Graph area: ~300px height with gradient fill
- Status indicators (green dots): ~8px diameter
- Dropdown arrows: ~16px size
- Search input: ~36px height with ~12px padding

---

## shadcn-cards
**URL:** https://ui.shadcn.com/examples/cards

Based on the screenshot showing a 404 error page, here's my analysis of the visible UI elements:

## **Card**
Not visible - No card components present in this error page

## **Badge**
Not visible - No badge components present

## **Button**
Not visible - No button components present

## **Table**
Not visible - No table components present

## **Spacing**
- **Content margins**: ~200px horizontal margins (content appears centered with significant whitespace)
- **Section gaps**: N/A - minimal content present
- **Component gaps**: ~8px between the "404" and error message text

## **Typography**
- **Heading sizes**: 
  - "404" text: ~48px, appears to be primary heading
  - Error message: ~16px, body text size
- **Body text size**: 16px
- **Line-height**: ~1.5 (estimated standard)
- **Font-family**: Sans-serif (appears to be system font stack)

## **Colors**
- **Background**: #ffffff (pure white)
- **Text primary**: #000000 or ~#1a1a1a (dark gray/black for "404")
- **Text secondary**: ~#666666 (medium gray for "This page could not be found.")
- **Border colors**: ~#e5e5e5 (thin vertical separator line between "404" and error message)
- **Accent/brand colors**: Not visible

## **Layout Structure**
- **Container**: Centered layout with flex or similar centering
- **Vertical alignment**: Content appears vertically centered on the page
- **Horizontal separator**: ~1px width, light gray border between "404" and message text

The page uses a minimal, clean design with generous whitespace and simple typography hierarchy typical of error pages.

---

## shadcn-forms
**URL:** https://ui.shadcn.com/examples/forms

Based on the screenshot showing a 404 error page, here's my analysis of the visible UI elements:

## **Card**
- padding: Not visible (no distinct card container)
- box-shadow: Not visible
- border-radius: Not visible
- border style: Not visible

## **Badge**
- padding: Not visible
- font-size: Not visible
- font-weight: Not visible
- border-radius: Not visible

## **Button**
- height: Not visible
- padding: Not visible
- font-size: Not visible
- font-weight: Not visible

## **Table**
- row height: Not visible
- cell padding: Not visible
- header style: Not visible

## **Spacing**
- section gaps: ~40px (estimated vertical spacing around the 404 content)
- content margins: ~20px (estimated page-level horizontal margins)
- component gaps: ~16px (estimated space between the "404" and error message)

## **Typography**
- heading sizes: 
  - h1 (404): ~48px
  - Body text: ~16px
- line-height: ~1.5 (estimated)
- font-family: sans-serif (appears to be a system font stack)

## **Colors**
- background: #ffffff (white page background)
- text primary: ~#333333 (dark gray for "404")
- text secondary: ~#666666 (medium gray for "This page could not be found.")
- border colors: ~#e5e5e5 (light gray vertical separator line between "404" and error message)
- accent/brand color: Not visible

## **Additional Notes**
The layout appears to be a minimal, centered 404 error page with very clean typography and spacing. The design follows a simple horizontal layout with the error code "404" separated by a vertical line from the explanatory text "This page could not be found."

---

## shadcn-mail
**URL:** https://ui.shadcn.com/examples/mail

Based on the screenshot showing a 404 error page, here's my analysis of the visible UI elements:

## **Card**
- padding: Not visible (no card component present)
- box-shadow: Not visible
- border-radius: Not visible
- border style: Not visible

## **Badge**
- padding: Not visible
- font-size: Not visible
- font-weight: Not visible
- border-radius: Not visible

## **Button**
- height: Not visible
- padding: Not visible
- font-size: Not visible
- font-weight: Not visible

## **Table**
- row height: Not visible
- cell padding: Not visible
- header style: Not visible

## **Spacing**
- section gaps: Not visible (minimal content)
- content margins: ~40px horizontal margins (estimated from center alignment)
- component gaps: ~16px (gap between "404" and error message)

## **Typography**
- heading sizes: 
  - h1 (404): ~48px
- body text size: ~16px
- line-height: ~1.5 (estimated standard)
- font-family: sans-serif (appears to be system font stack)

## **Colors**
- background (page): #ffffff or very light gray (~#fafafa)
- text (primary): #000000 or very dark gray (~#1a1a1a)
- text (secondary/muted): ~#666666 (error message appears slightly lighter)
- border colors: Not visible
- accent/brand color usage: Not visible

## **Specific Elements Visible**
- "404" text: Large, bold, black text
- "This page could not be found." message: Smaller, slightly muted text
- Layout: Centered both horizontally and vertically on the page
- Separator: Appears to be a thin vertical line (~1px) between "404" and the message

The page uses a minimalist design with very basic styling, typical of default error pages.

---

## vercel
**URL:** https://vercel.com

Based on my analysis of the Vercel website screenshot, here are the extracted CSS property values:

## **Card**
- padding: ~24px
- box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- border-radius: ~8px
- border style: 1px solid #eaeaea

## **Badge**
- padding: ~4px 8px (vertical/horizontal)
- font-size: ~12px
- font-weight: 500
- border-radius: ~4px

## **Button**
- height: ~40px
- padding: ~12px 24px (horizontal)
- font-size: ~14px
- font-weight: 500

## **Table**
- row height: ~48px
- cell padding: ~12px 16px
- header style: font-weight: 600, background: #fafafa, text-transform: none

## **Spacing**
- section gaps: ~80px to ~120px
- content margins: ~24px on mobile, ~48px on desktop
- component gaps: ~16px to ~24px between sibling elements

## **Typography**
- h1: ~48px to ~56px
- h2: ~32px to ~36px
- h3: ~24px
- body text size: ~16px
- line-height: ~1.5 to ~1.6
- font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

## **Colors**
- background (page): #ffffff
- background (card): #ffffff
- background (sidebar): #fafafa
- text (primary): #000000
- text (secondary/muted): #666666
- border colors: #eaeaea
- accent/brand color: #0070f3 (Vercel blue)

Note: Many values are estimated (~) based on visual analysis of the screenshot. Actual implementation may vary slightly.

---

## Summary & Ranges

Review the per-site extractions above to identify:
- **Median values** for each property across all sites
- **Ranges** showing min–max for each property
- **Consensus patterns** where 4+ sites agree

Use these values as baseline targets for VibeKit component styling.
