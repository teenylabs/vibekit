# DESIGN_CHANGES.md — MoneyFlow Budgets

## Summary
Added weekly spending trend sparklines to each budget card to provide historical context and spending pattern visualization alongside existing budget progress indicators.

## Changes

### Budget Cards Grid → `app/budgets/page.tsx`
**Before:** Budget cards showed only current spending amounts, progress bars, status badges, and remaining amounts
**After:** Budget cards now include weekly spending sparklines with trend visualization, budget limit reference lines, and weekly data context

**Implementation hints:**
- Add `weeklySpending` array property to each budget object in the sample data with historical weekly spending amounts
- Insert sparkline section between the progress bar and status badge sections using `<div className="pt-2">`
- Create SVG sparklines with `viewBox="0 0 200 32"` and `className="w-full h-full"`
- Add polygon fill area using `fill={status.color}` with `opacity="0.1"` for background trend visualization
- Add polyline stroke using `stroke={status.color}` with `strokeWidth="1.5"` and `opacity="0.8"` for the main trend line
- Include dashed reference line for budget limit using `stroke={ha("--muted-fg", 0.4)}` with `strokeDasharray="2,2"`
- Add sparkline header with "Weekly trend" label and week count display using `text-xs` styling
- Calculate sparkline coordinates by mapping weekly spending values to SVG coordinate system with proper min/max scaling
- Set sparkline container height to `h-8` with `relative` positioning

## Unchanged
Do not modify:
- Sidebar Navigation → `app/budgets/page.tsx`
- Page Header → `app/budgets/page.tsx` 
- Budget Overview Card → `app/budgets/page.tsx`
- Add Budget Button → `app/budgets/page.tsx`

## Updated Design Tokens
No token changes.