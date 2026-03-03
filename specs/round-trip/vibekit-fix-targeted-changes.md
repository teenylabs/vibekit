# Fix: Claude Rewrites Files Instead of Applying Targeted Changes

## Problem

When Claude receives DESIGN_CHANGES.md + original source files and is asked to apply the changes, it rewrites entire files instead of making targeted edits. The budgets.jsx came back with different data, different app name ("MoneyTracker" instead of "MoneyFlow"), different sidebar width, and completely restructured code. Only the sparkline addition was correct. It also invented a file (add-transaction.jsx) that didn't exist.

This defeats the purpose of targeted diffs.

## Fix 1: Strengthen DESIGN_CHANGES.md Output

**Change `prompts/stage3b-change-detector.md`:**

Add these instructions prominently (near the top of the prompt, not buried):

```
CRITICAL INSTRUCTION FOR CLAUDE CODE:

The purpose of this document is SURGICAL MODIFICATION, not rewriting. 
When applying these changes:

1. Open each file listed under "## Changes"
2. Find the SPECIFIC section described
3. Make ONLY the described modification
4. Do NOT rename variables, restructure code, change data values, 
   or modify anything not explicitly listed
5. Files under "## Unchanged" must not be opened or modified AT ALL
6. If a file is not mentioned in this document, do not touch it

Every line of code not mentioned in the Implementation Hints 
should remain byte-identical to the original.
```

Also add this to the end of every DESIGN_CHANGES.md output (make the Stage 3b prompt include it):

```markdown
## Application Instructions

Apply changes surgically. For each change listed above:
1. Locate the exact section in the source file
2. Add or modify ONLY what the implementation hints describe
3. Preserve ALL existing code, data, variable names, and structure
4. Do NOT rewrite, refactor, or restructure any file
5. Unchanged files must remain byte-identical to their originals
```

## Fix 2: Strengthen Step 5b Test Assertions

**Change `scripts/e2e-roundtrip.ts` Step 5b:**

Add these assertions after the existing ones:

```typescript
// 1. Unchanged files must be byte-identical
for (const af of appliedFiles) {
  const orig = originalScreens.find(o => o.path === af.path);
  if (!orig) continue; // new file, skip
  
  const isInChangedSection = designChangesContent
    .split("## Changes")[1]
    ?.split("## Unchanged")[0]
    ?.includes(af.path);
  
  if (!isInChangedSection) {
    const identical = orig.content.trim() === af.content.trim();
    assert(identical, `Unchanged file ${af.path} is byte-identical to original`);
  }
}

// 2. Changed file preserves original data values
const changedFile = appliedFiles.find(f => {
  const orig = originalScreens.find(o => o.path === f.path);
  return orig && orig.content.trim() !== f.content.trim();
});
if (changedFile) {
  const orig = originalScreens.find(o => o.path === changedFile.path);
  
  // Extract first 3 data values from original (dollar amounts, names, etc.)
  const origNumbers = orig.content.match(/\d+\.\d{2}/g)?.slice(0, 5) || [];
  const preservedData = origNumbers.every(n => changedFile.content.includes(n));
  assert(preservedData, "Changed file preserves original data values");
  
  // Line count should be close (additions only, not rewrites)
  const origLines = orig.content.split('\n').length;
  const newLines = changedFile.content.split('\n').length;
  const lineRatio = newLines / origLines;
  assert(
    lineRatio > 0.8 && lineRatio < 1.5, 
    `Changed file line count ratio is reasonable (${lineRatio.toFixed(2)}, expected 0.8-1.5)`
  );
}

// 3. No invented files
const inventedFiles = appliedFiles.filter(
  af => !originalScreens.find(o => o.path === af.path)
);
assert(
  inventedFiles.length === 0, 
  `No invented files (found: ${inventedFiles.map(f => f.path).join(', ')})`
);
```

## Fix 3: Improve Step 5b System Prompt

**In `scripts/e2e-roundtrip.ts`, find the system prompt for Step 5b's Claude API call.**

Change it to:

```
You are a precise code editor. Apply ONLY the changes described in DESIGN_CHANGES.md to the provided source files.

CRITICAL RULES:
1. Return ALL provided files, even unchanged ones
2. Unchanged files must be returned EXACTLY as provided — byte-identical, no modifications whatsoever
3. For changed files: make ONLY the specific modifications described in the Implementation Hints
4. Do NOT rename variables, change data values, restructure code, or modify anything not explicitly described
5. Do NOT create new files that weren't in the original set
6. Preserve all existing imports, data arrays, component names, and logic

Return each file wrapped in <file path="filename.jsx">...</file> tags.
```

## Summary

| File | Change |
|------|--------|
| `prompts/stage3b-change-detector.md` | Add "Application Instructions" section to output + critical preservation language |
| `scripts/e2e-roundtrip.ts` | Stronger Step 5b assertions (byte-identical unchanged, data preservation, line ratio, no invented files) + stricter system prompt |
