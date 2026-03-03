const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefPricingTable() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "For individuals getting started",
      monthly: 0,
      annual: 0,
      cta: "Get Started Free",
      featured: false,
      features: ["5 projects", "1 team member", "1 GB storage", "Community support", "Basic analytics"],
    },
    {
      name: "Pro",
      desc: "For professionals and small teams",
      monthly: 24,
      annual: 19,
      cta: "Start Free Trial",
      featured: true,
      features: ["Unlimited projects", "10 team members", "50 GB storage", "Priority support", "Advanced analytics", "Custom domains", "API access"],
    },
    {
      name: "Enterprise",
      desc: "For organizations at scale",
      monthly: 79,
      annual: 65,
      cta: "Contact Sales",
      featured: false,
      features: ["Unlimited everything", "Unlimited members", "500 GB storage", "Dedicated support", "Custom integrations", "SSO & SAML", "SLA guarantee", "Audit logs"],
    },
  ];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6" style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="text-center mb-12">
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: 16, color: ha("--fg", 0.5), maxWidth: 420, margin: "0 auto 28px" }}>
            Start free, upgrade when you need to. No hidden fees, no surprises.
          </p>
          {/* Annual/Monthly toggle */}
          <div className="inline-flex items-center gap-3 rounded-full p-1" style={{ background: ha("--muted", 0.3) }}>
            <button onClick={() => setAnnual(false)} className="rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{ background: !annual ? h("--card") : "transparent", color: !annual ? h("--fg") : h("--muted-fg"), boxShadow: !annual ? `0 1px 3px ${ha("--fg", 0.08)}` : "none" }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)} className="rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{ background: annual ? h("--card") : "transparent", color: annual ? h("--fg") : h("--muted-fg"), boxShadow: annual ? `0 1px 3px ${ha("--fg", 0.08)}` : "none" }}>
              Annual
              <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>Save 20%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map(plan => {
            const price = annual ? plan.annual : plan.monthly;
            return (
              <div key={plan.name} className="rounded-2xl transition-all"
                style={{
                  padding: plan.featured ? "2px" : 0,
                  background: plan.featured ? `linear-gradient(135deg, ${h("--primary")}, ${ha("--primary", 0.5)})` : "transparent",
                }}>
                <div className="rounded-2xl h-full" style={{
                  padding: 28,
                  background: h("--card"),
                  border: plan.featured ? "none" : `1px solid ${ha("--border", 0.5)}`,
                }}>
                  {plan.featured && (
                    <div className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-4"
                      style={{ background: ha("--primary", 0.1), color: h("--primary") }}>Most Popular</div>
                  )}
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: h("--muted-fg"), marginBottom: 16 }}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                      ${price}
                    </span>
                    {price > 0 && <span style={{ fontSize: 14, color: h("--muted-fg") }}>/month</span>}
                  </div>
                  <button className="w-full rounded-lg py-3 text-sm font-semibold transition-all mb-6"
                    style={{
                      background: plan.featured ? h("--primary") : "transparent",
                      color: plan.featured ? h("--primary-fg") : h("--fg"),
                      border: plan.featured ? "none" : `1.5px solid ${ha("--border", 0.5)}`,
                      minHeight: 44,
                    }}>
                    {plan.cta}
                  </button>
                  <div style={{ borderTop: `1px solid ${ha("--border", 0.3)}`, paddingTop: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: h("--muted-fg"), marginBottom: 12 }}>Includes</p>
                    <div className="space-y-3">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                            style={{ background: ha("--primary", 0.1), color: h("--primary") }}>✓</div>
                          <span style={{ fontSize: 13 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
