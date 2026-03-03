const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefOverlayModal() {
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const members = [
    { name: "Sarah Chen", email: "sarah@acme.dev", role: "Admin", joined: "Jan 12, 2026" },
    { name: "Marcus Rivera", email: "marcus@acme.dev", role: "Editor", joined: "Feb 3, 2026" },
    { name: "Diana Okafor", email: "diana@acme.dev", role: "Viewer", joined: "Feb 15, 2026" },
    { name: "James Park", email: "james@acme.dev", role: "Editor", joined: "Mar 1, 2026" },
  ];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Team Members</h1>
            <p className="text-xs mt-0.5" style={{ color: h("--muted-fg") }}>{members.length} people have access</p>
          </div>
          <button onClick={() => setModal("invite")} className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: h("--primary"), color: h("--primary-fg") }}>Invite Member</button>
        </div>

        <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
          {members.map((m, i) => (
            <div key={m.email} className="px-4 py-3.5 flex items-center gap-3"
              style={{ borderBottom: i < members.length - 1 ? `1px solid ${ha("--border", 0.3)}` : "none" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: ha("--primary", 0.12), color: h("--primary") }}>{m.name.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs" style={{ color: h("--muted-fg") }}>{m.email}</div>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: m.role === "Admin" ? ha("--primary", 0.1) : ha("--muted", 0.3), color: m.role === "Admin" ? h("--primary") : h("--muted-fg") }}>{m.role}</span>
              <button onClick={() => { setDeleteTarget(m); setModal("delete"); }}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ color: h("--muted-fg") }}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 transition-opacity" style={{ background: ha("--fg", 0.4) }} onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
            {modal === "invite" && (
              <>
                <h2 className="text-lg font-bold mb-1">Invite team member</h2>
                <p className="text-xs mb-5" style={{ color: h("--muted-fg") }}>They'll receive an email invitation to join your workspace.</p>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: h("--muted-fg") }}>Email address</label>
                    <input placeholder="name@company.com" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                      style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.5)}` }} autoFocus />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: h("--muted-fg") }}>Role</label>
                    <select className="w-full rounded-lg px-3 py-2.5 text-sm outline-none appearance-none"
                      style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.5)}` }}>
                      <option>Viewer</option><option>Editor</option><option>Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ border: `1px solid ${h("--border")}` }}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: h("--primary"), color: h("--primary-fg") }}>Send Invite</button>
                </div>
              </>
            )}
            {modal === "delete" && deleteTarget && (
              <>
                <h2 className="text-lg font-bold mb-1" style={{ color: h("--destructive") }}>Remove team member</h2>
                <p className="text-sm mb-6" style={{ color: h("--muted-fg") }}>
                  Are you sure you want to remove <span className="font-semibold" style={{ color: h("--fg") }}>{deleteTarget.name}</span>? They will lose access to all projects and data in this workspace.
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ border: `1px solid ${h("--border")}` }}>Cancel</button>
                  <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: h("--destructive"), color: h("--destructive-fg") }}>Remove</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
