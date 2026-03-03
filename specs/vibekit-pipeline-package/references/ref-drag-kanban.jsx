const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefDragKanban() {
  const [columns, setColumns] = useState({
    todo: { label: "To Do", items: [
      { id: 1, title: "Design onboarding flow", assignee: "SC", priority: "high", tags: ["design"] },
      { id: 2, title: "Write API documentation", assignee: "JP", priority: "medium", tags: ["docs"] },
      { id: 3, title: "Research competitor pricing", assignee: "PS", priority: "low", tags: ["research"] },
    ]},
    progress: { label: "In Progress", items: [
      { id: 4, title: "Build dashboard components", assignee: "MR", priority: "high", tags: ["eng"] },
      { id: 5, title: "Set up CI/CD pipeline", assignee: "JP", priority: "medium", tags: ["eng", "devops"] },
    ]},
    review: { label: "In Review", items: [
      { id: 6, title: "Landing page copy", assignee: "DO", priority: "medium", tags: ["marketing"] },
    ]},
    done: { label: "Done", items: [
      { id: 7, title: "Set up project repo", assignee: "MR", priority: "high", tags: ["eng"] },
      { id: 8, title: "Define brand guidelines", assignee: "SC", priority: "medium", tags: ["design"] },
    ]},
  });
  const [moving, setMoving] = useState(null);

  const moveCard = (itemId, fromCol, toCol) => {
    if (fromCol === toCol) return;
    setColumns(prev => {
      const item = prev[fromCol].items.find(i => i.id === itemId);
      return {
        ...prev,
        [fromCol]: { ...prev[fromCol], items: prev[fromCol].items.filter(i => i.id !== itemId) },
        [toCol]: { ...prev[toCol], items: [...prev[toCol].items, item] },
      };
    });
    setMoving(null);
  };

  const priorityDot = { high: "hsl(0 70% 55%)", medium: "hsl(45 90% 50%)", low: "hsl(152 55% 50%)" };

  return (
    <div className="h-screen flex flex-col" style={{ background: h("--bg"), color: h("--fg") }}>
      <header className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: ha("--border", 0.4) }}>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Board View</h1>
          <p className="text-xs" style={{ color: h("--muted-fg") }}>Q2 Launch · 8 tasks</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: `1px solid ${h("--border")}` }}>Filter</button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Add Task</button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full" style={{ minWidth: "fit-content" }}>
          {Object.entries(columns).map(([colId, col]) => (
            <div key={colId} className="w-72 flex-shrink-0 flex flex-col rounded-xl"
              style={{ background: ha("--muted", 0.12) }}>
              <div className="px-3 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{col.label}</span>
                  <span className="text-[10px] font-medium px-1.5 rounded-full" style={{ background: ha("--muted", 0.4), color: h("--muted-fg") }}>{col.items.length}</span>
                </div>
                <button className="text-lg leading-none" style={{ color: h("--muted-fg") }}>+</button>
              </div>

              <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
                {col.items.map(item => (
                  <div key={item.id}
                    className="rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.4)}`,
                      opacity: moving?.id === item.id ? 0.5 : 1 }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[13px] font-medium leading-snug">{item.title}</span>
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: priorityDot[item.priority] }} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {item.tags.map(t => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: ha("--muted", 0.3), color: h("--muted-fg") }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                        style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{item.assignee}</div>
                      {!moving && (
                        <button onClick={() => setMoving({ id: item.id, from: colId })}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors"
                          style={{ color: h("--muted-fg") }}>Move →</button>
                      )}
                      {moving && moving.id === item.id && (
                        <button onClick={() => setMoving(null)} className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ color: h("--destructive") }}>Cancel</button>
                      )}
                    </div>
                  </div>
                ))}

                {moving && moving.from !== colId && (
                  <button onClick={() => moveCard(moving.id, moving.from, colId)}
                    className="w-full py-3 rounded-lg border-2 border-dashed text-xs font-medium transition-colors"
                    style={{ borderColor: ha("--primary", 0.4), color: h("--primary"), background: ha("--primary", 0.05) }}>
                    Drop here
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
