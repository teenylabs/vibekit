const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefTabSections() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity", count: 24 },
    { id: "files", label: "Files", count: 8 },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="border-b" style={{ borderColor: ha("--border", 0.4) }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: h("--primary"), color: h("--primary-fg") }}>QL</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Q2 Launch</h1>
              <p className="text-xs" style={{ color: h("--muted-fg") }}>Created by Sarah Chen · 24 tasks · Due Apr 15, 2026</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: `1px solid ${h("--border")}` }}>Share</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Add Task</button>
            </div>
          </div>
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-4 py-2.5 text-sm font-medium transition-colors relative"
                style={{ color: tab === t.id ? h("--fg") : h("--muted-fg") }}>
                {t.label}
                {t.count && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: ha("--muted", 0.4) }}>{t.count}</span>}
                {tab === t.id && <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ background: h("--primary") }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[{ label: "Completed", value: "18/24", pct: 75 }, { label: "On Track", value: "5", color: "hsl(152 55% 40%)" }, { label: "Overdue", value: "1", color: "hsl(0 70% 55%)" }].map(m => (
                <div key={m.label} className="rounded-xl p-4" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                  <p className="text-xs mb-1" style={{ color: h("--muted-fg") }}>{m.label}</p>
                  <p className="text-xl font-bold" style={{ color: m.color || h("--fg"), fontVariantNumeric: "tabular-nums" }}>{m.value}</p>
                  {m.pct && <div className="w-full h-1.5 rounded-full mt-2" style={{ background: ha("--muted", 0.3) }}><div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: h("--primary") }} /></div>}
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-3">Recent Tasks</h2>
              <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
                {[{ task: "Finalize landing page copy", assignee: "SC", status: "done" }, { task: "Set up analytics tracking", assignee: "JP", status: "in-progress" }, { task: "Create demo video", assignee: "DO", status: "in-progress" }, { task: "Configure email sequences", assignee: "MR", status: "overdue" }].map((t, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: i < 3 ? `1px solid ${ha("--border", 0.3)}` : "none" }}>
                    <div className="w-4 h-4 rounded flex items-center justify-center text-[9px]"
                      style={{ background: t.status === "done" ? h("--primary") : "transparent", border: t.status === "done" ? "none" : `1.5px solid ${h("--border")}`, color: h("--primary-fg") }}>
                      {t.status === "done" && "✓"}
                    </div>
                    <span className="text-sm flex-1" style={{ textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? h("--muted-fg") : h("--fg") }}>{t.task}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{t.assignee}</div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: t.status === "overdue" ? "hsl(0 70% 55% / 0.1)" : t.status === "done" ? ha("--muted", 0.3) : ha("--primary", 0.1), color: t.status === "overdue" ? "hsl(0 70% 55%)" : t.status === "done" ? h("--muted-fg") : h("--primary") }}>
                      {t.status === "in-progress" ? "In Progress" : t.status === "done" ? "Done" : "Overdue"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "activity" && (
          <div className="space-y-4">
            {[{ user: "Sarah Chen", action: 'completed "Finalize landing page copy"', time: "2 hrs ago" },
              { user: "James Park", action: 'moved "Set up analytics tracking" to In Progress', time: "4 hrs ago" },
              { user: "Diana Okafor", action: 'added 3 comments to "Create demo video"', time: "Yesterday" },
              { user: "Marcus Rivera", action: 'was assigned "Configure email sequences"', time: "2 days ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: ha("--primary", 0.1), color: h("--primary") }}>
                  {a.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm"><span className="font-medium">{a.user}</span> <span style={{ color: h("--muted-fg") }}>{a.action}</span></p>
                  <p className="text-[11px] mt-0.5" style={{ color: h("--muted-fg") }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "files" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{ name: "Brand Guidelines.pdf", size: "2.4 MB" }, { name: "Landing Mockup.fig", size: "8.1 MB" }, { name: "Copy Deck.docx", size: "142 KB" }, { name: "Analytics Setup.md", size: "3.2 KB" }].map(f => (
              <div key={f.name} className="rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-lg"
                  style={{ background: ha("--primary", 0.08) }}>📄</div>
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-[11px]" style={{ color: h("--muted-fg") }}>{f.size}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
