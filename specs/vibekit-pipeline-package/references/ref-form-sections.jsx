const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefFormSections() {
  const [saved, setSaved] = useState(false);
  const [plan, setPlan] = useState("pro");
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });
  const [showDelete, setShowDelete] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <nav className="sticky top-0 z-40 border-b" style={{ background: h("--bg"), borderColor: ha("--border", 0.4) }}>
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">Settings</h1>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: saved ? "hsl(152 55% 40%)" : h("--primary"), color: h("--primary-fg") }}>
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
          <h2 className="text-sm font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <label className="text-sm w-28 flex-shrink-0" style={{ color: h("--muted-fg") }}>Name</label>
              <input defaultValue="Shalini Patel" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2"
                style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.5)}`, ringColor: ha("--primary", 0.3) }} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <label className="text-sm w-28 flex-shrink-0" style={{ color: h("--muted-fg") }}>Email</label>
              <input defaultValue="shalini@teenylabs.com" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.5)}` }} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
              <label className="text-sm w-28 flex-shrink-0 mt-2" style={{ color: h("--muted-fg") }}>Bio</label>
              <textarea defaultValue="Building AI-powered apps at TeenyLabs." rows={3}
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none resize-none"
                style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.5)}` }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
          <h2 className="text-sm font-semibold mb-4">Plan</h2>
          <div className="space-y-2">
            {[{ id: "free", label: "Free", desc: "5 projects, 1 team member" }, { id: "pro", label: "Pro", desc: "Unlimited projects, 10 members, priority support" }, { id: "enterprise", label: "Enterprise", desc: "Custom limits, SSO, dedicated support" }].map(p => (
              <label key={p.id} className="flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all"
                style={{ background: plan === p.id ? ha("--primary", 0.05) : "transparent", border: `1.5px solid ${plan === p.id ? ha("--primary", 0.4) : ha("--border", 0.3)}` }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: plan === p.id ? h("--primary") : h("--border") }}>
                  {plan === p.id && <div className="w-2 h-2 rounded-full" style={{ background: h("--primary") }} />}
                </div>
                <div>
                  <div className="text-sm font-medium">{p.label}</div>
                  <div className="text-xs" style={{ color: h("--muted-fg") }}>{p.desc}</div>
                </div>
                <input type="radio" name="plan" checked={plan === p.id} onChange={() => setPlan(p.id)} className="hidden" />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
          <h2 className="text-sm font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            {[{ key: "email", label: "Email notifications", desc: "Receive updates via email" }, { key: "push", label: "Push notifications", desc: "Browser push notifications" }, { key: "weekly", label: "Weekly digest", desc: "Summary of activity every Monday" }].map(n => (
              <div key={n.key} className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-medium">{n.label}</div>
                  <div className="text-xs" style={{ color: h("--muted-fg") }}>{n.desc}</div>
                </div>
                <button onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                  className="w-10 h-6 rounded-full p-0.5 transition-colors"
                  style={{ background: notifications[n.key] ? h("--primary") : ha("--muted", 0.4) }}>
                  <div className="w-5 h-5 rounded-full shadow transition-transform"
                    style={{ background: "white", transform: notifications[n.key] ? "translateX(16px)" : "translateX(0)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ border: `1px solid ${ha("--destructive", 0.3)}` }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: h("--destructive") }}>Danger Zone</h2>
          <p className="text-xs mb-3" style={{ color: h("--muted-fg") }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{ background: ha("--destructive", 0.1), color: h("--destructive") }}>Delete Account</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: h("--destructive") }}>Are you sure?</span>
              <button onClick={() => setShowDelete(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: `1px solid ${h("--border")}` }}>Cancel</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: h("--destructive"), color: h("--destructive-fg") }}>Yes, Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
