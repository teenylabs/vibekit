# Example Selector

Maps a Stage 1 design brief to the 2-4 most relevant reference files from the library.

## Selection Logic

```python
REFERENCE_MAP = {
    # Navigation model → primary reference
    "nav_model": {
        "browse_and_drill": "ref-browse-drill.jsx",
        "workspace_switch": "ref-workspace-sidebar.jsx",
        "sequential_flow": "ref-sequential-flow.jsx",
        "conversational": "ref-conversational.jsx",
        "feed_timeline": "ref-feed-timeline.jsx",
        "tab_peers": "ref-tab-sections.jsx",
    },
    # Content relationship → secondary reference
    "content_relationship": {
        "full_replace": None,  # covered by browse_and_drill
        "split_pane": "ref-split-pane.jsx",
        "overlay_modal": "ref-overlay-modal.jsx",
        "overlay_sheet": None,  # similar to overlay_modal
        "expand_in_place": "ref-expand-in-place.jsx",
        "filter_refine": None,  # covered by browse_and_drill
    },
    # Mutation model → tertiary reference
    "mutation_model": {
        "form_submit": "ref-form-sections.jsx",
        "inline_edit": "ref-inline-edit.jsx",
        "drag_and_drop": "ref-drag-kanban.jsx",
        "conversational_input": "ref-conversational.jsx",
        "direct_manipulation": None,  # no reference yet
        "toggle_switch": "ref-form-sections.jsx",
    },
}

def select_references(brief: dict) -> list[str]:
    """Select 2-4 reference files based on design brief."""
    refs = []
    seen = set()

    # 1. Always include nav model reference
    nav_ref = REFERENCE_MAP["nav_model"].get(brief["nav_model"])
    if nav_ref:
        refs.append(nav_ref)
        seen.add(nav_ref)

    # 2. Include content relationship if different
    content_ref = REFERENCE_MAP["content_relationship"].get(brief["content_relationship"])
    if content_ref and content_ref not in seen:
        refs.append(content_ref)
        seen.add(content_ref)

    # 3. Include mutation model if different
    mutation_ref = REFERENCE_MAP["mutation_model"].get(brief["mutation_model"])
    if mutation_ref and mutation_ref not in seen:
        refs.append(mutation_ref)
        seen.add(mutation_ref)

    # 4. If we only have 1-2 refs, add a complementary one
    #    based on app type for visual diversity
    if len(refs) < 3:
        app_type_extras = {
            "consumer": "ref-browse-drill.jsx",
            "saas": "ref-workspace-sidebar.jsx",
            "chat": "ref-conversational.jsx",
            "dashboard": "ref-tab-sections.jsx",
            "marketing": "ref-browse-drill.jsx",
            "tool": "ref-form-sections.jsx",
        }
        extra = app_type_extras.get(brief.get("app_type"))
        if extra and extra not in seen:
            refs.append(extra)

    # Cap at 4 to manage context window
    return refs[:4]
```

## Example Selections

### "Build me a recipe app"
Brief: nav=browse_and_drill, content=full_replace, mutation=form_submit
Selected: ref-browse-drill.jsx, ref-form-sections.jsx
(full_replace maps to None, covered by browse-drill)

### "Build me a project management tool"
Brief: nav=workspace_switch, content=split_pane, mutation=drag_and_drop
Selected: ref-workspace-sidebar.jsx, ref-split-pane.jsx, ref-drag-kanban.jsx

### "Build me an AI chat assistant"
Brief: nav=conversational, content=none, mutation=conversational_input
Selected: ref-conversational.jsx + ref-browse-drill.jsx (extra for visual diversity)

### "Build me an analytics dashboard"
Brief: nav=workspace_switch, content=filter_refine, mutation=toggle_switch
Selected: ref-workspace-sidebar.jsx, ref-form-sections.jsx, ref-tab-sections.jsx

### "Build me a multi-step onboarding"
Brief: nav=sequential_flow, content=full_replace, mutation=form_submit
Selected: ref-sequential-flow.jsx, ref-form-sections.jsx

## Context Window Budget

Each reference file: ~80-120 lines ≈ 2-4K tokens
Stage 2 prompt: ~200 lines ≈ 3K tokens
Design brief: ~50-80 lines ≈ 1-2K tokens
4 references: ~400 lines ≈ 12K tokens

Total Stage 2 context: ~18K tokens — well within limits.
Leaves plenty of room for the model's output (typically 200-400 lines per screen × 3-4 screens).
