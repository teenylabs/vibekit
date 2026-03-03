// Shared rich section description logic used by both spec-to-markdown and spec-to-claude-md

// ---------------------------------------------------------------------------
// Action description helpers
// ---------------------------------------------------------------------------

function describeAction(action: any): string {
  const props = action?.props ?? action;
  const label = props?.label ?? props?.children ?? props?.text ?? "button";
  const variant = props?.variant ? ` (${props.variant})` : "";
  const target = props?.navigateTo ?? props?.onClick?.navigateTo ?? null;
  const nav = target ? ` that opens ${target}` : "";
  return `"${label}"${variant}${nav}`;
}

function describeActions(actions: any[] | any | undefined): string {
  if (!actions) return "";
  const arr = Array.isArray(actions) ? actions : [actions];
  if (arr.length === 0) return "";
  return arr.map((a) => `Action button ${describeAction(a)}`).join(". ") + ".";
}

// ---------------------------------------------------------------------------
// Field description helper (for forms)
// ---------------------------------------------------------------------------

function describeField(field: any): string {
  const label = field.label ?? field.name ?? "field";
  const type = field.type ?? "input";
  const placeholder = field.placeholder ? `: "${field.placeholder}"` : "";
  let optionsNote = "";
  if (field.options && Array.isArray(field.options)) {
    const labels = field.options.map((o: any) =>
      typeof o === "string" ? o : o.label ?? o.value ?? String(o)
    );
    optionsNote = ` — options: ${labels.join(", ")}`;
  }
  return `- ${label} (${type})${placeholder}${optionsNote}`;
}

// ---------------------------------------------------------------------------
// Column / cell description helpers (for tables)
// ---------------------------------------------------------------------------

function describeColumnName(col: any): string {
  if (typeof col === "string") return col;
  return col.label ?? col.name ?? col.key ?? "column";
}

function describeCellValue(key: string, rows: any[]): string {
  for (const row of rows) {
    const val = row[key] ?? row[key.toLowerCase()];
    if (val == null) continue;
    if (typeof val === "object" && val.component === "Badge") {
      const badgeProps = val.props ?? {};
      const variant = badgeProps.variant ? ` (${badgeProps.variant})` : "";
      return `Badge${variant}`;
    }
    if (typeof val === "object" && val.component === "Avatar") {
      return "Avatar";
    }
    if (typeof val === "object" && val.component) {
      return val.component;
    }
    if (typeof val === "string") return "text";
    if (typeof val === "number") return "number";
    if (typeof val === "boolean") return "boolean";
  }
  return "text";
}

// ---------------------------------------------------------------------------
// Per-component-type description generators
// ---------------------------------------------------------------------------

function describePageHeader(props: Record<string, any>): string {
  const parts: string[] = [];
  const title = props.title ? `Title "${props.title}"` : "";
  const desc = props.description ? `, description "${props.description}"` : "";
  parts.push(`**Page Header:** ${title}${desc}.`);

  const actions = props.actions ?? (props.action ? [props.action] : []);
  if (actions.length > 0) {
    parts.push(describeActions(actions));
  }

  if (props.backButton || props.showBack) {
    const target =
      typeof props.backButton === "object" && props.backButton.navigateTo
        ? ` to ${props.backButton.navigateTo}`
        : "";
    parts.push(`Includes a back button${target}.`);
  }

  return parts.join(" ");
}

function describeTable(props: Record<string, any>): string {
  const lines: string[] = [];
  const rawCols = props.columns ?? props.headers ?? [];
  const colNames = rawCols.map(describeColumnName);
  lines.push(`**Table** with columns: ${colNames.join(", ")}.`);

  const rows: any[] = props.rows ?? [];
  if (rows.length > 0 && colNames.length > 0) {
    for (const name of colNames) {
      const possibleKeys = [
        name,
        name.toLowerCase(),
        name.replace(/\s+/g, ""),
        name.charAt(0).toLowerCase() + name.slice(1).replace(/\s+/g, ""),
      ];
      let cellType = "text";
      for (const key of possibleKeys) {
        const found = describeCellValue(key, rows);
        if (found !== "text") {
          cellType = found;
          break;
        }
      }
      if (cellType !== "text") {
        lines.push(`- ${name} column: ${cellType}`);
      }
    }
  }

  if (props.rowAction) {
    const target = props.rowAction.target ?? "detail";
    const type = props.rowAction.type ?? "navigate";
    lines.push(
      `Clicking a row ${type === "navigate" ? "opens" : "triggers"} ${target}.`
    );
  }

  return lines.join("\n");
}

function describeForm(props: Record<string, any>): string {
  const lines: string[] = [];
  const title = props.title ? `**${props.title} Form:**` : "**Form:**";
  lines.push(title);

  const fields: any[] = props.fields ?? [];
  if (fields.length > 0) {
    for (const field of fields) {
      lines.push(describeField(field));
    }
  }

  if (props.submitLabel) {
    const nav = props.onSubmit?.navigateTo
      ? ` that navigates to ${props.onSubmit.navigateTo}`
      : "";
    lines.push(`Submit button "${props.submitLabel}"${nav}.`);
  }

  return lines.join("\n");
}

function describeTabs(props: Record<string, any>): string {
  const lines: string[] = [];
  const tabs: any[] = props.tabs ?? props.items ?? [];
  const tabLabels = tabs.map(
    (t) => t.label ?? t.name ?? t.title ?? t.value ?? "tab"
  );
  lines.push(`**Tabs:** ${tabLabels.join(", ")}.`);

  for (const tab of tabs) {
    const label = tab.label ?? tab.name ?? tab.title ?? tab.value ?? "tab";
    const content = tab.content ?? tab.sections ?? null;

    if (typeof content === "string") {
      lines.push(`- ${label}: ${content}`);
    } else if (Array.isArray(content)) {
      const childDescs = content.map((child: any) => describeSection(child));
      lines.push(
        `- ${label}:\n${childDescs
          .map((d) => "  " + d.replace(/\n/g, "\n  "))
          .join("\n")}`
      );
    } else if (content && typeof content === "object") {
      if (content.fields) {
        const fieldDescs = content.fields.map(describeField);
        lines.push(
          `- ${label}:\n${fieldDescs.map((d: string) => "  " + d).join("\n")}`
        );
      } else if (content.component) {
        lines.push(`- ${label}: ${describeSection(content)}`);
      } else if (tab.description) {
        lines.push(`- ${label}: ${tab.description}`);
      }
    } else if (tab.description) {
      lines.push(`- ${label}: ${tab.description}`);
    }
  }

  return lines.join("\n");
}

function describeCardGrid(props: Record<string, any>): string {
  const lines: string[] = [];
  const cards: any[] = props.cards ?? [];
  const cols = props.columns ?? 3;
  lines.push(`**Card Grid** (${cols} columns):`);

  for (const card of cards) {
    const title = card.title ?? "";
    const value = card.value ? ` showing "${card.value}"` : "";
    const desc = card.description ? ` — ${card.description}` : "";
    const badge = card.badge ? ` [${card.badge}]` : "";
    const nav = card.navigateTo ? ` → opens ${card.navigateTo}` : "";
    lines.push(`- "${title}"${value}${desc}${badge}${nav}`);
  }

  return lines.join("\n");
}

function describeCard(props: Record<string, any>): string {
  const lines: string[] = [];
  const hasTitle = !!props.title;
  const title = props.title ? `"${props.title}"` : "";
  const desc = props.description ? (hasTitle ? ` — ${props.description}` : props.description) : "";

  if (props.value && !props.children && !props.sections && !props.content) {
    return `Metric card ${title || "untitled"} showing "${props.value}"${desc ? `. ${desc}` : ""}.`;
  }

  if (hasTitle) {
    lines.push(`**${props.title}** card${desc}:`);
  } else {
    lines.push(`**Card**${desc ? `: ${desc}` : ""}:`);
  }

  const content = props.children ?? props.sections ?? props.content;
  if (content) {
    const contentLines = describeContent(content);
    if (contentLines) lines.push(contentLines);
  }

  return lines.join("\n");
}

function describeSplitLayout(props: Record<string, any>): string {
  const lines: string[] = [];
  const ratio = props.ratio ?? "1:1";
  lines.push(`**Split Layout** (${ratio}):`);

  const left = props.left ?? props.primary ?? [];
  const right = props.right ?? props.secondary ?? [];

  if (Array.isArray(left) && left.length > 0) {
    lines.push("Left/Primary panel:");
    for (const section of left) {
      lines.push("  " + describeSection(section).replace(/\n/g, "\n  "));
    }
  }

  if (Array.isArray(right) && right.length > 0) {
    lines.push("Right/Secondary panel:");
    for (const section of right) {
      lines.push("  " + describeSection(section).replace(/\n/g, "\n  "));
    }
  }

  return lines.join("\n");
}

function describeEmptyState(props: Record<string, any>): string {
  const title = props.title ?? "Empty";
  const desc = props.description ?? "";
  const icon = props.icon ? ` (icon: ${props.icon})` : "";
  let result = `**Empty State:**${icon} "${title}" — ${desc}.`;
  if (props.action) {
    const label = props.action.label ?? "Action";
    const target = props.action.navigateTo ?? "";
    result += ` Action: "${label}" navigates to ${target}.`;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Content / children recursive description
// ---------------------------------------------------------------------------

function describeContent(content: any): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return `- ${item}`;
        return describeSection(item);
      })
      .join("\n");
  }

  if (typeof content === "object" && content !== null) {
    if (content.component) {
      return describeSection(content);
    }
    if (content.fields) {
      return describeForm(content);
    }
    const parts: string[] = [];
    if (content.title) parts.push(`title: "${content.title}"`);
    if (content.description) parts.push(content.description);
    if (content.label) parts.push(`"${content.label}"`);
    if (content.text) parts.push(content.text);
    if (parts.length > 0) return parts.join(", ");
  }

  return "";
}

// ---------------------------------------------------------------------------
// Main section describer (dispatches by component type)
// ---------------------------------------------------------------------------

export function describeSection(section: any): string {
  if (!section || typeof section !== "object") return "";

  const component: string = section.component ?? "";
  const props: Record<string, any> = section.props ?? {};

  switch (component) {
    case "PageHeader":
      return describePageHeader(props);
    case "Table":
      return describeTable(props);
    case "Form":
      return describeForm(props);
    case "Tabs":
      return describeTabs(props);
    case "CardGrid":
      return describeCardGrid(props);
    case "Card":
      return describeCard(props);
    case "SplitLayout":
      return describeSplitLayout(props);
    case "EmptyState":
      return describeEmptyState(props);
    case "Button":
      return describeButton(props);
    case "Label":
      return describeLabel(props);
    case "Input":
      return describeInput(props);
    case "Select":
      return describeSelect(props);
    case "Badge":
      return describeBadge(props);
    case "Switch":
      return describeSwitch(props);
    case "Checkbox":
      return describeCheckbox(props);
    case "Separator":
      return "---";
    default:
      return describeGenericSection(component, props);
  }
}

function describeButton(props: Record<string, any>): string {
  const label = props.label ?? props.children ?? props.text ?? "Button";
  const variant = props.variant ? ` (${props.variant})` : "";
  const target = props.navigateTo ?? props.onClick?.navigateTo ?? null;
  const nav = target ? ` that opens ${target}` : "";
  return `Button "${label}"${variant}${nav}`;
}

function describeLabel(props: Record<string, any>): string {
  const text = props.text ?? props.children ?? props.label ?? "";
  return text ? `Label: "${text}"` : "Label";
}

function describeInput(props: Record<string, any>): string {
  const label = props.label ?? "";
  const type = props.type ?? "text";
  const placeholder = props.placeholder ? ` with placeholder "${props.placeholder}"` : "";
  const prefix = label ? `"${label}" input` : "Input";
  return `${prefix} (${type})${placeholder}`;
}

function describeSelect(props: Record<string, any>): string {
  const label = props.label ?? props.placeholder ?? "";
  const options = props.options ?? [];
  const labels = options.map((o: any) =>
    typeof o === "string" ? o : o.label ?? o.value ?? String(o)
  );
  const prefix = label ? `"${label}" select` : "Select";
  return labels.length > 0
    ? `${prefix} — options: ${labels.join(", ")}`
    : prefix;
}

function describeBadge(props: Record<string, any>): string {
  const text = props.label ?? props.children ?? props.text ?? "";
  const variant = props.variant ? ` (${props.variant})` : "";
  return `Badge "${text}"${variant}`;
}

function describeSwitch(props: Record<string, any>): string {
  const label = props.label ?? props.name ?? "";
  const desc = props.description ? ` — ${props.description}` : "";
  return label ? `Switch "${label}"${desc}` : `Switch${desc}`;
}

function describeCheckbox(props: Record<string, any>): string {
  const label = props.label ?? props.name ?? "";
  const desc = props.description ? ` — ${props.description}` : "";
  return label ? `Checkbox "${label}"${desc}` : `Checkbox${desc}`;
}

function describeGenericSection(
  component: string,
  props: Record<string, any>
): string {
  const lines: string[] = [];
  const title = props.title ? ` "${props.title}"` : "";
  const desc = props.description ? `: ${props.description}` : "";
  lines.push(`**${component}**${title}${desc}`);

  if (props.placeholder) lines.push(`Placeholder: "${props.placeholder}"`);
  if (props.label) lines.push(`Label: "${props.label}"`);
  if (props.variant) lines.push(`Variant: ${props.variant}`);
  if (props.icon) lines.push(`Icon: ${props.icon}`);

  if (props.actions && Array.isArray(props.actions)) {
    lines.push(describeActions(props.actions));
  }

  if (props.fields && Array.isArray(props.fields)) {
    for (const field of props.fields) {
      lines.push(describeField(field));
    }
  }

  if (props.options && Array.isArray(props.options)) {
    const labels = props.options.map((o: any) =>
      typeof o === "string" ? o : o.label ?? o.value ?? String(o)
    );
    lines.push(`Options: ${labels.join(", ")}`);
  }

  if (props.navigateTo) lines.push(`Navigates to: ${props.navigateTo}`);

  const nested = props.children ?? props.sections ?? props.content;
  if (nested) {
    const nestedDesc = describeContent(nested);
    if (nestedDesc) lines.push(nestedDesc);
  }

  return lines.join("\n");
}
