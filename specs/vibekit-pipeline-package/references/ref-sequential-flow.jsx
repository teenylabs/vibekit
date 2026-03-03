const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefSequentialFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", type: "saas", team: "solo", features: [] });
  const steps = ["Basics", "Details", "Features", "Launch"];

  const featureOptions = [
    { id: "auth", label: "User Authentication", desc: "Login, signup, password reset" },
    { id: "payments", label: "Payments", desc: "Stripe integration, subscriptions" },
    { id: "analytics", label: "Analytics Dashboard", desc: "Usage metrics and charts" },
    { id: "notifications", label: "Notifications", desc: "Email and push notifications" },
    { id: "api", label: "API Access", desc: "REST API with documentation" },
    { id: "collab", label: "Team Collaboration", desc: "Shared workspaces, permissions" },
  ];

  const toggleFeature = (id) => {
    setData(d => ({ ...d, features: d.features.includes(id) ? d.features.filter(f => f !== id) : [...d.features, id] }));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: h("--bg"), color: h("--fg") }}>
      <nav className="px-6 h-14 flex items-center border-b" style={{ borderColor: ha("--border", 0.4) }}>
        <span className="text-sm font-bold">AppForge</span>
        <div className="ml-auto flex items-center gap-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={{ background: i <= step ? h("--primary") : ha("--muted", 0.3), color: i <= step ? h("--primary-fg") : h("--muted-fg") }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="text-xs hidden sm:block" style={{ color: i <= step ? h("--fg") : h("--muted-fg"), fontWeight: i === step ? 600 : 400 }}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px mx-1" style={{ background: i < step ? h("--primary") : ha("--border", 0.5) }} />}
            </div>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">What are you building?</h1>
              <p className="text-sm mb-8" style={{ color: h("--muted-fg") }}>Give your project a name to get started.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Project Name</label>
                  <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="My Awesome App..."
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                    style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.5)}`, ringColor: ha("--primary", 0.3) }}
                    autoFocus />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">What type of app?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ id: "saas", label: "SaaS", emoji: "⚡" }, { id: "marketplace", label: "Marketplace", emoji: "🏪" }, { id: "consumer", label: "Consumer", emoji: "📱" }].map(t => (
                      <button key={t.id} onClick={() => setData({ ...data, type: t.id })}
                        className="rounded-xl px-4 py-4 text-center transition-all"
                        style={{ background: data.type === t.id ? ha("--primary", 0.08) : ha("--muted", 0.2), border: `1.5px solid ${data.type === t.id ? ha("--primary", 0.4) : "transparent"}` }}>
                        <div className="text-2xl mb-1">{t.emoji}</div>
                        <div className="text-xs font-medium">{t.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Tell us about your team</h1>
              <p className="text-sm mb-8" style={{ color: h("--muted-fg") }}>This helps us configure the right defaults.</p>
              <div className="space-y-2">
                {[{ id: "solo", label: "Just me", desc: "Solo developer, doing everything" }, { id: "small", label: "Small team (2-5)", desc: "A few people wearing many hats" }, { id: "growing", label: "Growing team (6-20)", desc: "Dedicated roles, need structure" }].map(t => (
                  <button key={t.id} onClick={() => setData({ ...data, team: t.id })}
                    className="w-full text-left rounded-xl px-5 py-4 transition-all flex items-center gap-4"
                    style={{ background: data.team === t.id ? ha("--primary", 0.06) : "transparent", border: `1.5px solid ${data.team === t.id ? ha("--primary", 0.4) : ha("--border", 0.3)}` }}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: data.team === t.id ? h("--primary") : h("--border") }}>
                      {data.team === t.id && <div className="w-2 h-2 rounded-full" style={{ background: h("--primary") }} />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs" style={{ color: h("--muted-fg") }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Pick your features</h1>
              <p className="text-sm mb-8" style={{ color: h("--muted-fg") }}>Select what you need. You can always add more later.</p>
              <div className="grid grid-cols-2 gap-3">
                {featureOptions.map(f => (
                  <button key={f.id} onClick={() => toggleFeature(f.id)}
                    className="text-left rounded-xl px-4 py-3.5 transition-all"
                    style={{ background: data.features.includes(f.id) ? ha("--primary", 0.06) : ha("--muted", 0.15), border: `1.5px solid ${data.features.includes(f.id) ? ha("--primary", 0.4) : "transparent"}` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                        style={{ background: data.features.includes(f.id) ? h("--primary") : ha("--muted", 0.4), color: h("--primary-fg") }}>
                        {data.features.includes(f.id) && "✓"}
                      </div>
                      <span className="text-sm font-medium">{f.label}</span>
                    </div>
                    <p className="text-xs pl-6" style={{ color: h("--muted-fg") }}>{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
                style={{ background: `linear-gradient(135deg, ${ha("--primary", 0.2)}, ${ha("--primary", 0.05)})` }}>🚀</div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">You're all set!</h1>
              <p className="text-sm mb-2" style={{ color: h("--muted-fg") }}>
                <span className="font-semibold" style={{ color: h("--fg") }}>{data.name || "Your project"}</span> is ready to go.
              </p>
              <p className="text-xs mb-8" style={{ color: h("--muted-fg") }}>
                {data.features.length} features selected · {data.team === "solo" ? "Solo" : data.team === "small" ? "Small team" : "Growing team"} plan
              </p>
              <button className="px-8 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: h("--primary"), color: h("--primary-fg") }}>
                Open Dashboard
              </button>
            </div>
          )}

          {step < 3 && (
            <div className="flex items-center justify-between mt-10">
              <button onClick={() => setStep(Math.max(0, step - 1))}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ visibility: step > 0 ? "visible" : "hidden", border: `1px solid ${h("--border")}` }}>
                Back
              </button>
              <button onClick={() => setStep(Math.min(3, step + 1))}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: h("--primary"), color: h("--primary-fg") }}>
                {step === 2 ? "Launch" : "Continue"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
