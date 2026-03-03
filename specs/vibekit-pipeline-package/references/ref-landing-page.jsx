const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefLandingPage() {
  const [annual, setAnnual] = useState(true);

  const features = [
    { icon: "⚡", title: "Ship 10x Faster", desc: "AI-powered code generation that understands your design system. No more translating mockups to code." },
    { icon: "🎨", title: "Design-First Workflow", desc: "Start with how it looks, not how it works. The code follows the design, not the other way around." },
    { icon: "🔄", title: "Stay in Sync", desc: "Change the design, the code updates. Change the code, the design reflects it. Always aligned." },
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "CTO at Flowbase", text: "We shipped our entire V2 redesign in 3 weeks instead of 3 months. The design-to-code bridge eliminated our handoff bottleneck.", avatar: "SC" },
    { name: "James Park", role: "Solo Founder, Punchlist", text: "I'm a developer, not a designer. This gave me a designer's eye without hiring one. My app finally looks like I care.", avatar: "JP" },
    { name: "Diana Okafor", role: "Lead Engineer at Meridian", text: "The consistency alone was worth it. Every new page looks like it belongs. No more design drift.", avatar: "DO" },
  ];

  const logos = ["TechFlow", "Meridian", "Flowbase", "Punchlist", "Lattice"];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: ha("--bg", 0.92), backdropFilter: "blur(12px)", borderBottom: `1px solid ${ha("--border", 0.3)}` }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-base font-bold tracking-tight">VibeKit</span>
            <div className="hidden md:flex items-center gap-6 text-sm">
              {["Features", "Pricing", "Docs"].map(item => (
                <a key={item} className="cursor-pointer transition-colors" style={{ color: h("--muted-fg") }}
                  onMouseEnter={e => e.currentTarget.style.color = h("--fg")}
                  onMouseLeave={e => e.currentTarget.style.color = h("--muted-fg")}>
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium" style={{ color: h("--muted-fg") }}>Sign in</button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute pointer-events-none" style={{ top: -160, right: -160, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ha("--primary", 0.08)}, transparent 70%)` }} />
        <div className="absolute pointer-events-none" style={{ bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${ha("--accent", 0.06)}, transparent 70%)` }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center" style={{ paddingTop: 96, paddingBottom: 80 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: ha("--primary", 0.08), color: h("--primary") }}>
            ✦ Now in public beta
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}>
            Design systems that<br />
            <span style={{ color: h("--primary") }}>vibe coders</span> love
          </h1>
          <p className="max-w-xl mx-auto" style={{ fontSize: 18, lineHeight: 1.6, color: ha("--fg", 0.55), marginBottom: 40 }}>
            Stop building apps that look like they were coded by robots. VibeKit gives your AI coding tools a designer's eye — beautiful, consistent, and yours.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-3.5 rounded-full text-base font-semibold transition-all"
              style={{ background: h("--primary"), color: h("--primary-fg") }}>
              Start Building Free
            </button>
            <button className="px-8 py-3.5 rounded-full text-base font-medium transition-all"
              style={{ border: `1.5px solid ${ha("--border", 0.6)}` }}>
              View Examples
            </button>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section style={{ paddingBottom: 64 }}>
        <p className="text-center text-xs font-medium mb-6" style={{ color: h("--muted-fg"), letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Trusted by teams at
        </p>
        <div className="flex items-center justify-center gap-10 flex-wrap px-6">
          {logos.map(name => (
            <span key={name} className="text-base font-bold tracking-tight" style={{ color: ha("--fg", 0.25) }}>{name}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6" style={{ paddingBottom: 96 }}>
        <div className="text-center mb-16">
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Everything you need to ship beautiful apps
          </h2>
          <p style={{ fontSize: 16, color: ha("--fg", 0.5), maxWidth: 480, margin: "0 auto" }}>
            A complete design system that works with your AI coding tools out of the box.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl p-7 transition-all"
              style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.4)}` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${ha("--fg", 0.06)}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: ha("--primary", 0.08) }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: h("--muted-fg") }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ paddingBottom: 96, background: ha("--muted", 0.15) }}>
        <div className="max-w-5xl mx-auto px-6" style={{ paddingTop: 64 }}>
          <h2 className="text-center" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 48 }}>
            Loved by builders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="rounded-2xl p-6" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.4)}` }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: ha("--fg", 0.8), marginBottom: 20 }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: ha("--primary", 0.12), color: h("--primary") }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: h("--muted-fg") }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 text-center" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Ready to build something beautiful?
        </h2>
        <p style={{ fontSize: 16, color: ha("--fg", 0.5), marginBottom: 40 }}>
          Start free. No credit card required. Ship your first design in under 5 minutes.
        </p>
        <button className="px-10 py-4 rounded-full text-base font-semibold transition-all"
          style={{ background: h("--primary"), color: h("--primary-fg") }}>
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${ha("--border", 0.3)}`, padding: "32px 0" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">VibeKit</span>
          <p className="text-xs" style={{ color: h("--muted-fg") }}>© 2026 TeenyLabs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
