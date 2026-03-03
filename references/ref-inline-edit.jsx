const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefInlineEdit() {
  const [data, setData] = useState([
    { id: 1, name: "Website Redesign", owner: "Sarah Chen", status: "In Progress", priority: "High", due: "Mar 15, 2026" },
    { id: 2, name: "API Documentation", owner: "James Park", status: "In Review", priority: "Medium", due: "Mar 20, 2026" },
    { id: 3, name: "Mobile App MVP", owner: "Diana Okafor", status: "Not Started", priority: "High", due: "Apr 1, 2026" },
    { id: 4, name: "User Interviews", owner: "Priya Sharma", status: "Done", priority: "Low", due: "Feb 28, 2026" },
    { id: 5, name: "CI/CD Pipeline", owner: "Marcus Rivera", status: "In Progress", priority: "Medium", due: "Mar 10, 2026" },
  ]);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id, field, value) => { setEditing({ id, field }); setEditValue(value); };
  const saveEdit = () => {
    if (editing) {
      setData(d => d.map(row => row.id === editing.id ? { ...row, [editing.field]: editValue } : row));
      setEditing(null);
    }
  };
  const cancelEdit = () => setEditing(null);

  const statusColors = {
    "Done": { bg: "hsl(152 55% 40% / 0.1)", fg: "hsl(152 55% 40%)" },
    "In Progress": { bg: ha("--primary", 0.1), fg: h("--primary") },
    "In Review": { bg: "hsl(45 90% 50% / 0.1)", fg: "hsl(45 90% 40%)" },
    "Not Started": { bg: ha("--muted", 0.3), fg: h("--muted-fg") },
  };
  const priorityColors = {
    "High": { bg: "hsl(0 70% 55% / 0.1)", fg: "hsl(0 70% 55%)" },
    "Medium": { bg: "hsl(45 90% 50% / 0.1)", fg: "hsl(45 90% 40%)" },
    "Low": { bg: ha("--muted", 0.3), fg: h("--muted-fg") },
  };

  const Cell = ({ row, field, value, children }) => {
    const isEditing = editing?.id === row.id && editing?.field === field;
    if (isEditing) {
      return (
        <input value={editValue} onChange={e => setEditValue(e.target.value)}
          onBlur={saveEdit} onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
          className="w-full rounded px-2 py-1 text-sm outline-none"
          style={{ background: ha("--bg", 1), border: `2px solid ${h("--primary")}` }} autoFocus />
      );
    }
    return (
      <div onClick={() => startEdit(row.id, field, value)}
        className="cursor-text rounded px-2 py-1 -mx-2 transition-colors hover:bg-opacity-50"
        style={{ minHeight: "28px" }}
        onMouseEnter={e => e.currentTarget.style.background = ha("--muted", 0.2)}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        {children || <span className="text-sm">{value}</span>}
      </div>
    );
  };

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Projects</h1>
            <p className="text-xs mt-0.5" style={{ color: h("--muted-fg") }}>Click any cell to edit inline</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Add Project</button>
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ borderColor: ha("--border", 0.5) }}>
          <div className="grid grid-cols-[1fr_140px_110px_90px_110px] px-4 py-2.5 border-b text-[11px] font-semibold uppercase tracking-wider"
            style={{ background: ha("--muted", 0.15), borderColor: ha("--border", 0.3), color: h("--muted-fg") }}>
            <span>Project</span><span>Owner</span><span>Status</span><span>Priority</span><span>Due Date</span>
          </div>
          {data.map((row, i) => (
            <div key={row.id} className="grid grid-cols-[1fr_140px_110px_90px_110px] px-4 py-2 items-center transition-colors"
              style={{ borderBottom: i < data.length - 1 ? `1px solid ${ha("--border", 0.2)}` : "none" }}>
              <Cell row={row} field="name" value={row.name}>
                <span className="text-sm font-medium">{row.name}</span>
              </Cell>
              <Cell row={row} field="owner" value={row.owner}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                    style={{ background: ha("--primary", 0.1), color: h("--primary") }}>
                    {row.owner.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-sm">{row.owner.split(" ")[0]}</span>
                </div>
              </Cell>
              <div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: statusColors[row.status]?.bg, color: statusColors[row.status]?.fg }}>{row.status}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: priorityColors[row.priority]?.bg, color: priorityColors[row.priority]?.fg }}>{row.priority}</span>
              </div>
              <Cell row={row} field="due" value={row.due}>
                <span className="text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>{row.due}</span>
              </Cell>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
