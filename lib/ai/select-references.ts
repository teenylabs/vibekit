interface DesignBrief {
  app_type: string;
  nav_model: string;
  content_relationship: string;
  mutation_model: string;
  [key: string]: unknown;
}

const NAV_MAP: Record<string, string> = {
  browse_and_drill: "ref-browse-drill",
  workspace_switch: "ref-workspace-sidebar",
  sequential_flow: "ref-sequential-flow",
  conversational: "ref-conversational",
  feed_timeline: "ref-feed-timeline",
  tab_peers: "ref-tab-sections",
};

const CONTENT_MAP: Record<string, string | null> = {
  full_replace: null,
  split_pane: "ref-split-pane",
  overlay_modal: "ref-overlay-modal",
  overlay_sheet: null,
  expand_in_place: "ref-expand-in-place",
  filter_refine: null,
};

const MUTATION_MAP: Record<string, string | null> = {
  form_submit: "ref-form-sections",
  inline_edit: "ref-inline-edit",
  drag_and_drop: "ref-drag-kanban",
  conversational_input: "ref-conversational",
  direct_manipulation: null,
  toggle_switch: "ref-form-sections",
};

const APP_TYPE_EXTRAS: Record<string, string> = {
  consumer: "ref-browse-drill",
  saas: "ref-workspace-sidebar",
  chat: "ref-conversational",
  dashboard: "ref-dashboard-charts",
  marketing: "ref-landing-page",
  tool: "ref-form-sections",
  ecommerce: "ref-product-detail",
};

export function selectReferences(brief: DesignBrief): string[] {
  const refs: string[] = [];
  const seen = new Set<string>();

  // 1. Nav model reference (always include)
  const navRef = NAV_MAP[brief.nav_model];
  if (navRef) { refs.push(navRef); seen.add(navRef); }

  // 2. Content relationship (if different)
  const contentRef = CONTENT_MAP[brief.content_relationship];
  if (contentRef && !seen.has(contentRef)) { refs.push(contentRef); seen.add(contentRef); }

  // 3. Mutation model (if different)
  const mutationRef = MUTATION_MAP[brief.mutation_model];
  if (mutationRef && !seen.has(mutationRef)) { refs.push(mutationRef); seen.add(mutationRef); }

  // 4. App type extra if we have < 3 refs
  if (refs.length < 3) {
    const extra = APP_TYPE_EXTRAS[brief.app_type];
    if (extra && !seen.has(extra)) { refs.push(extra); }
  }

  return refs.slice(0, 4);
}
