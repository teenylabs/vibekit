const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefWorkspaceSidebar() {
  const [nav, setNav] = useState("Dashboard");
  const [teamOpen, setTeamOpen] = useState(true);
  const metrics = [
    { label: "Revenue", value: "$48,290", change: "+12.5%", up: true },
    { label: "Active Users", value: "2,847", change: "+8.2%", up: true },
    { label: "Churn Rate", value: "3.1%", change: "-0.4%", up: false },
    { label: "Avg. Session", value: "4m 32s", change: "+0.8%", up: true },
  ];
  const activity = [
    { user: "Priya Sharma", action: "upgraded to Pro plan", time: "2 min ago" },
    { user: "James Park", action: "created project 'Q2 Launch'", time: "18 min ago" },
    { user: "Sarah Chen", action: "invited 3 team members", time: "1 hr ago" },
    { user: "Marcus Rivera", action: "exported analytics report", time: "2 hrs ago" },
    { user: "Diana Okafor", action: "connected Slack integration", time: "5 hrs ago" },
  ];
  const projects = [
    { name: "Q2 Launch", status: "active", tasks: 24, complete: 18 },
    { name: "Mobile Redesign", status: "active", tasks: 31, complete: 12 },
    { name: "API v3 Migration", status: "paused", tasks: 15, complete: 9 },
  ];

  return (
    <div className="flex h-screen" style={{ background: h("--bg"), color: h("--fg") }}>
      <aside className="w-56 flex-shrink-0 flex flex-col border-r" style={{ background: h("--card"), borderColor: h("--border") }}>
        <div className="px-3 py-3 flex items-center gap-2 text-sm font-bold">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: h("--primary"), color: h("--primary-fg") }}>A</div>
          Acme Analytics
        </div>
        <nav className="px-2 mt-1 space-y-0.5 flex-1">
          {[{ label: "Dashboard", count: null }, { label: "Projects", count: 3 }, { label: "Team", count: null }, { label: "Billing", count: null }].map(item => (
            <button key={item.label} onClick={() => setNav(item.label)} className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-colors"
              style={{ background: nav === item.label ? ha("--primary", 0.08) : "transparent", color: nav === item.label ? h("--fg") : h("--muted-fg"), fontWeight: nav === item.label ? 600 : 400 }}>
              <span className="flex-1">{item.label}</span>
              {item.count && <span className="text-[10px] px-1.5 rounded-full" style={{ background: ha("--muted", 0.6) }}>{item.count}</span>}
            </button>
          ))}
          <div className="pt-4">
            <button onClick={() => setTeamOpen(!teamOpen)} className="w-full flex items-center justify-between px-2.5 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: h("--muted-fg") }}>Teams</span>
              <span className="text-[10px]" style={{ color: h("--muted-fg") }}>{teamOpen ? "−" : "+"}</span>
            </button>
            {teamOpen && ["Engineering", "Design", "Marketing"].map(t => (
              <button key={t} className="w-full text-left px-4 py-1 text-[13px] rounded-md transition-colors" style={{ color: h("--muted-fg") }}>{t}</button>
            ))}
          </div>
        </nav>
        <div className="px-3 py-3 border-t" style={{ borderColor: ha("--border", 0.5) }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: ha("--primary", 0.12), color: h("--primary") }}>PS</div>
            <div className="text-xs"><div className="font-medium">Priya Sharma</div><div style={{ color: h("--muted-fg") }}>Admin</div></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="px-6 py-5 border-b" style={{ borderColor: ha("--border", 0.4) }}>
          <h1 className="text-xl font-bold tracking-tight">{nav}</h1>
          <p className="text-xs mt-0.5" style={{ color: h("--muted-fg") }}>Last 30 days · Updated 2 min ago</p>
        </header>
        <div className="px-6 py-6">
          {nav === "Dashboard" && <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {metrics.map(m => (
                <div key={m.label} className="rounded-xl p-4" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                  <p className="text-xs mb-1" style={{ color: h("--muted-fg") }}>{m.label}</p>
                  <p className="text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: m.up ? "hsl(152 55% 40%)" : h("--destructive") }}>{m.change} vs last month</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: ha("--border", 0.4) }}>
                <h2 className="text-sm font-semibold">Recent Activity</h2>
                <button className="text-xs font-medium" style={{ color: h("--primary") }}>View all</button>
              </div>
              {activity.map((a, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < activity.length - 1 ? `1px solid ${ha("--border", 0.3)}` : "none" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{a.user.split(" ").map(n => n[0]).join("")}</div>
                  <p className="text-sm flex-1 truncate"><span className="font-medium">{a.user}</span> <span style={{ color: h("--muted-fg") }}>{a.action}</span></p>
                  <span className="text-[11px] flex-shrink-0" style={{ color: h("--muted-fg") }}>{a.time}</span>
                </div>
              ))}
            </div>
          </>}
          {nav === "Projects" && <div className="space-y-3">
            {projects.map(p => (
              <div key={p.name} className="rounded-xl p-4 flex items-center gap-4" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-1">{p.name}</h3>
                  <p className="text-xs" style={{ color: h("--muted-fg") }}>{p.complete}/{p.tasks} tasks complete</p>
                </div>
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: ha("--muted", 0.3) }}>
                  <div className="h-full rounded-full" style={{ width: `${(p.complete / p.tasks) * 100}%`, background: h("--primary") }} />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: p.status === "active" ? "hsl(152 55% 40% / 0.1)" : ha("--muted", 0.3), color: p.status === "active" ? "hsl(152 55% 40%)" : h("--muted-fg") }}>{p.status}</span>
              </div>
            ))}
          </div>}
        </div>
      </main>
    </div>
  );
}
