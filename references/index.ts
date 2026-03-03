export const referenceFiles: Record<string, string> = {
  "ref-browse-drill": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefBrowseDrill() {
  const [selected, setSelected] = useState(null);
  const items = [
    { id: 1, title: "Crispy Sesame Tofu Bowl", sub: "30 min · Vegetarian", img: "https://picsum.photos/seed/tofu/600/400", stat: "4,201 made this", detail: "A perfectly balanced bowl with crispy baked tofu, pickled vegetables, and a sesame-ginger dressing that brings everything together." },
    { id: 2, title: "One-Pan Lemon Herb Salmon", sub: "25 min · Gluten-free", img: "https://picsum.photos/seed/salmon/600/400", stat: "3,847 made this", detail: "Tender salmon fillets roasted alongside asparagus and cherry tomatoes with a bright lemon-herb butter sauce." },
    { id: 3, title: "Spicy Black Bean Tacos", sub: "15 min · Vegan", img: "https://picsum.photos/seed/tacos/600/400", stat: "6,122 made this", detail: "Smoky spiced black beans piled into charred corn tortillas with quick-pickled onions, avocado crema, and fresh cilantro." },
    { id: 4, title: "Thai Basil Chicken Stir-Fry", sub: "20 min · Dairy-free", img: "https://picsum.photos/seed/stirfry/600/400", stat: "5,503 made this", detail: "Ground chicken wok-fired with Thai basil, chili, garlic, and a savory-sweet sauce. Served over jasmine rice." },
    { id: 5, title: "Mushroom Risotto", sub: "40 min · Vegetarian", img: "https://picsum.photos/seed/risotto/600/400", stat: "2,919 made this", detail: "Creamy arborio rice slowly stirred with mixed wild mushrooms, parmesan, and a splash of white wine." },
    { id: 6, title: "Grilled Peach & Burrata Salad", sub: "10 min · Seasonal", img: "https://picsum.photos/seed/peach/600/400", stat: "1,703 made this", detail: "Caramelized grilled peaches paired with creamy burrata, arugula, toasted pistachios, and a honey-balsamic drizzle." },
  ];
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Quick", "Vegetarian", "Seasonal"];

  if (selected) {
    const item = items.find(i => i.id === selected);
    return (
      <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
        <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ background: ha("--bg", 0.9), borderBottom: \`1px solid \${ha("--border", 0.4)}\` }}>
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight">ForkYeah</span>
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Submit Recipe</button>
          </div>
        </nav>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <button onClick={() => setSelected(null)} className="text-sm font-medium mb-6 flex items-center gap-1" style={{ color: h("--muted-fg") }}>← Back to recipes</button>
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
            <img src={item.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2 text-xs mb-2" style={{ color: h("--muted-fg") }}><span>{item.sub}</span></div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">{item.title}</h1>
          <p className="text-sm mb-4" style={{ color: ha("--primary", 0.8) }}>{item.stat}</p>
          <div className="text-[15px] leading-relaxed space-y-4" style={{ color: ha("--fg", 0.85) }}>
            <p>{item.detail}</p>
            <h2 className="text-lg font-semibold pt-2" style={{ color: h("--fg") }}>Ingredients</h2>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: h("--primary") }} />2 blocks firm tofu, pressed and cubed</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: h("--primary") }} />3 tbsp sesame oil</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: h("--primary") }} />1 cup jasmine rice</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ background: ha("--bg", 0.9), borderBottom: \`1px solid \${ha("--border", 0.4)}\` }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">ForkYeah</span>
          <div className="flex items-center gap-5 text-sm">
            <a className="font-medium">Recipes</a>
            <a style={{ color: h("--muted-fg") }}>Collections</a>
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Submit Recipe</button>
          </div>
        </div>
      </nav>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-3">Dinner, decided.</h1>
        <p className="text-base" style={{ color: h("--muted-fg") }}>Recipes tested by 50,000 home cooks. No fluff.</p>
      </section>
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex gap-2 mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ background: filter === f ? h("--primary") : ha("--muted", 0.4), color: filter === f ? h("--primary-fg") : h("--fg") }}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map(item => (
            <div key={item.id} onClick={() => setSelected(item.id)} className="group cursor-pointer">
              <div className="aspect-[3/2] rounded-2xl overflow-hidden mb-3">
                <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-xs" style={{ color: h("--muted-fg") }}>{item.sub}</p>
              <p className="text-xs mt-1" style={{ color: ha("--primary", 0.8) }}>{item.stat}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`,
  "ref-conversational": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefConversational() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "assistant", text: "Hey! I'm your AI cooking assistant. Tell me what ingredients you have or what you're in the mood for, and I'll suggest recipes.", time: "10:30 AM" },
    { id: 2, from: "user", text: "I have chicken thighs, coconut milk, and some Thai basil. About 30 minutes to cook.", time: "10:31 AM" },
    { id: 3, from: "assistant", text: "Perfect combo! I'd go with a Thai Basil Coconut Chicken.\\n\\nHere's the quick version:\\n\\n1. Season and sear chicken thighs (5 min)\\n2. Add minced garlic, ginger, and chili flakes (1 min)\\n3. Pour in coconut milk, simmer until chicken is cooked through (15 min)\\n4. Stir in Thai basil and fish sauce at the end (2 min)\\n\\nServe over jasmine rice. Total time: about 25 minutes.\\n\\nWant the full recipe with exact measurements?", time: "10:31 AM" },
    { id: 4, from: "user", text: "Yes please! Also, can I substitute anything for fish sauce? I don't have any.", time: "10:33 AM" },
    { id: 5, from: "assistant", text: "Absolutely! Soy sauce works as a substitute — use about half the amount since it's saltier. Or a pinch of salt with a squeeze of lime gets you close.\\n\\nHere's the full recipe:\\n\\n• 4 chicken thighs, boneless\\n• 1 can (400ml) coconut milk\\n• 3 cloves garlic, minced\\n• 1 tbsp fresh ginger, grated\\n• 1 tsp red chili flakes\\n• 1 cup Thai basil leaves\\n• 1 tbsp soy sauce (or 2 tsp fish sauce)\\n• Salt and pepper to taste\\n• Jasmine rice for serving", time: "10:34 AM" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: messages.length + 1, from: "user", text: input, time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
    setMessages([...messages, newMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: prev.length + 1, from: "assistant", text: "Great question! Let me think about that...", time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: h("--bg"), color: h("--fg") }}>
      <header className="h-14 px-5 flex items-center gap-3 border-b flex-shrink-0" style={{ borderColor: ha("--border", 0.5) }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: \`linear-gradient(135deg, \${ha("--primary", 0.3)}, \${ha("--primary", 0.1)})\` }}>
          <span className="text-sm">🧑‍🍳</span>
        </div>
        <div>
          <div className="text-sm font-semibold">Chef AI</div>
          <div className="text-[10px]" style={{ color: h("--muted-fg") }}>Always ready to cook</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>History</button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>New Chat</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map(m => (
            <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex gap-3"}>
              {m.from === "assistant" && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1" style={{ background: ha("--primary", 0.1) }}>🧑‍🍳</div>
              )}
              <div>
                {m.from === "assistant" && <p className="text-[10px] font-medium mb-1" style={{ color: h("--muted-fg") }}>Chef AI · {m.time}</p>}
                <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                  style={m.from === "user"
                    ? { background: h("--primary"), color: h("--primary-fg"), borderBottomRightRadius: "6px", maxWidth: "80%" }
                    : { background: ha("--muted", 0.35), borderBottomLeftRadius: "6px", maxWidth: "85%" }}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: ha("--primary", 0.1) }}>🧑‍🍳</div>
              <div className="rounded-2xl px-4 py-3" style={{ background: ha("--muted", 0.35), borderBottomLeftRadius: "6px" }}>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: h("--muted-fg"), animationDelay: \`\${i * 200}ms\` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: ha("--border", 0.4) }}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask about recipes, ingredients, techniques..."
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: ha("--muted", 0.3), border: \`1px solid \${ha("--border", 0.5)}\` }} />
          <button onClick={handleSend} className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: input.trim() ? h("--primary") : ha("--muted", 0.3), color: input.trim() ? h("--primary-fg") : h("--muted-fg") }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
`,
  "ref-dashboard-charts": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

// Note: In the VibeKit pipeline, Recharts is available via the react-live scope.
// The CSS variable colors need to be resolved to actual HSL strings for Recharts.
// Use getComputedStyle to resolve at render time.

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export default function RefDashboardCharts() {
  const [period, setPeriod] = useState("7d");

  const revenueData = [
    { date: "Mon", revenue: 4200, users: 182 },
    { date: "Tue", revenue: 3800, users: 169 },
    { date: "Wed", revenue: 5100, users: 214 },
    { date: "Thu", revenue: 4600, users: 198 },
    { date: "Fri", revenue: 6200, users: 257 },
    { date: "Sat", revenue: 3400, users: 143 },
    { date: "Sun", revenue: 2900, users: 121 },
  ];

  const channelData = [
    { name: "Organic", value: 4820 },
    { name: "Direct", value: 3200 },
    { name: "Referral", value: 2100 },
    { name: "Social", value: 1600 },
    { name: "Email", value: 980 },
  ];

  const categoryData = [
    { category: "Enterprise", amount: 48200, pct: 42 },
    { category: "Pro", amount: 31400, pct: 27 },
    { category: "Starter", amount: 21800, pct: 19 },
    { category: "Free trial", amount: 13600, pct: 12 },
  ];

  const metrics = [
    { label: "Revenue", value: "$31,240", change: "+12.5%", up: true },
    { label: "Active Users", value: "1,284", change: "+8.1%", up: true },
    { label: "Conversion", value: "3.24%", change: "+0.4%", up: true },
    { label: "Churn Rate", value: "2.1%", change: "-0.3%", up: false },
  ];

  // Recharts needs actual color strings, not CSS var references.
  // In production, resolve via getComputedStyle. For the reference, use semantic colors.
  const chartPrimary = "hsl(252 60% 52%)"; // matches --primary in modern-saas skin
  const chartSecondary = "hsl(220 10% 78%)";
  const chartSuccess = "hsl(152 55% 40%)";
  const pieColors = ["hsl(252 60% 52%)", "hsl(210 70% 50%)", "hsl(168 60% 45%)", "hsl(45 90% 45%)", "hsl(0 70% 55%)"];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
            <p className="text-xs mt-0.5" style={{ color: h("--muted-fg") }}>Revenue and user activity overview</p>
          </div>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: ha("--muted", 0.3) }}>
            {["24h", "7d", "30d", "90d"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  background: period === p ? h("--card") : "transparent",
                  color: period === p ? h("--fg") : h("--muted-fg"),
                  boxShadow: period === p ? \`0 1px 3px \${ha("--fg", 0.08)}\` : "none",
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map(m => (
            <div key={m.label} className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
              <p className="text-xs mb-1.5" style={{ color: h("--muted-fg") }}>{m.label}</p>
              <p className="text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</p>
              <p className="text-xs mt-1.5 font-medium" style={{ color: m.up ? "hsl(152 55% 40%)" : h("--destructive") }}>
                {m.change} <span style={{ color: h("--muted-fg"), fontWeight: 400 }}>vs last period</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Revenue line chart */}
          <div className="lg:col-span-2 rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold">Revenue Trend</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>+12.5%</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ha("--border", 0.3)} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: ha("--muted-fg", 1) }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: ha("--muted-fg", 1) }} axisLine={false} tickLine={false} tickFormatter={v => \`$\${(v / 1000).toFixed(1)}k\`} />
                <Tooltip
                  contentStyle={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(value) => [\`$\${value.toLocaleString()}\`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke={chartPrimary} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic sources pie */}
          <div className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
            <h2 className="text-sm font-semibold mb-4">Traffic Sources</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {channelData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\`, borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [value.toLocaleString(), "Visitors"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {channelData.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: pieColors[i] }} />
                    <span className="text-xs">{c.name}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by plan — bar chart */}
        <div className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Revenue by Plan</h2>
            <button className="text-xs font-medium" style={{ color: h("--primary") }}>View details</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={ha("--border", 0.3)} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: ha("--muted-fg", 1) }} axisLine={false} tickLine={false} tickFormatter={v => \`$\${(v / 1000)}k\`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: h("--fg") }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\`, borderRadius: 8, fontSize: 12 }}
                formatter={(value) => [\`$\${value.toLocaleString()}\`, "Revenue"]}
              />
              <Bar dataKey="amount" fill={chartPrimary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
`,
  "ref-drag-kanban": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>Filter</button>
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
                    style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.4)}\`,
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
`,
  "ref-empty-loading-error": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefEmptyLoadingError() {
  const [view, setView] = useState("empty");
  const views = ["empty", "loading", "error", "success"];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold tracking-tight mb-2">State Patterns</h1>
        <p className="text-xs mb-6" style={{ color: h("--muted-fg") }}>Empty, loading, error, and success states for common UI situations.</p>

        <div className="flex gap-2 mb-8">
          {views.map(v => (
            <button key={v} onClick={() => setView(v)} className="rounded-full px-4 py-2 text-sm font-medium capitalize transition-all"
              style={{ background: view === v ? h("--primary") : ha("--muted", 0.4), color: view === v ? h("--primary-fg") : h("--fg") }}>
              {v}
            </button>
          ))}
        </div>

        {view === "empty" && (
          <div className="space-y-8">
            {/* Empty state: no projects */}
            <div className="rounded-2xl text-center" style={{ padding: "60px 24px", background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl"
                style={{ background: ha("--primary", 0.08) }}>📁</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No projects yet</h3>
              <p style={{ fontSize: 14, color: h("--muted-fg"), maxWidth: 320, margin: "0 auto 20px" }}>
                Create your first project to start organizing your work and collaborating with your team.
              </p>
              <button className="rounded-lg px-6 py-2.5 text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>
                Create Project
              </button>
            </div>

            {/* Empty state: no search results */}
            <div className="rounded-2xl text-center" style={{ padding: "48px 24px", background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
              <div className="text-3xl mb-4">🔍</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>No results for "quantum flux"</h3>
              <p style={{ fontSize: 13, color: h("--muted-fg"), maxWidth: 280, margin: "0 auto 16px" }}>
                Try a different search term or remove some filters.
              </p>
              <button className="text-sm font-medium" style={{ color: h("--primary") }}>Clear filters</button>
            </div>

            {/* Empty state: no notifications */}
            <div className="rounded-xl flex items-center gap-4" style={{ padding: 20, background: ha("--muted", 0.15), border: \`1px solid \${ha("--border", 0.3)}\` }}>
              <div className="text-2xl">🔔</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>You're all caught up</p>
                <p style={{ fontSize: 13, color: h("--muted-fg") }}>No new notifications. We'll let you know when something needs your attention.</p>
              </div>
            </div>
          </div>
        )}

        {view === "loading" && (
          <div className="space-y-8">
            {/* Skeleton card grid */}
            <div>
              <div className="h-5 w-32 rounded mb-4" style={{ background: ha("--muted", 0.4), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-xl overflow-hidden" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
                    <div style={{ aspectRatio: "3/2", background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite", animationDelay: \`\${i * 200}ms\` }} />
                    <div style={{ padding: 16 }}>
                      <div className="h-4 rounded w-3/4 mb-3" style={{ background: ha("--muted", 0.4), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
                      <div className="h-3 rounded w-full mb-2" style={{ background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
                      <div className="h-3 rounded w-2/3" style={{ background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton list */}
            <div className="rounded-xl" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3" style={{ padding: "14px 16px", borderBottom: i < 4 ? \`1px solid \${ha("--border", 0.2)}\` : "none" }}>
                  <div className="w-10 h-10 rounded-full" style={{ background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite", animationDelay: \`\${i * 150}ms\` }} />
                  <div style={{ flex: 1 }}>
                    <div className="h-3.5 rounded w-1/3 mb-2" style={{ background: ha("--muted", 0.4), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
                    <div className="h-3 rounded w-1/2" style={{ background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
                  </div>
                  <div className="h-4 w-16 rounded" style={{ background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "error" && (
          <div className="space-y-8">
            {/* Full page error */}
            <div className="rounded-2xl text-center" style={{ padding: "60px 24px", background: h("--card"), border: \`1px solid \${ha("--destructive", 0.2)}\` }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl"
                style={{ background: ha("--destructive", 0.08) }}>⚠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: h("--destructive") }}>Something went wrong</h3>
              <p style={{ fontSize: 14, color: h("--muted-fg"), maxWidth: 360, margin: "0 auto 20px" }}>
                We couldn't load your data. This is usually temporary — try refreshing the page.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="rounded-lg px-5 py-2.5 text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Retry</button>
                <button className="rounded-lg px-5 py-2.5 text-sm font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>Contact Support</button>
              </div>
            </div>

            {/* Inline error */}
            <div className="rounded-xl flex items-start gap-3" style={{ padding: 16, background: ha("--destructive", 0.05), border: \`1px solid \${ha("--destructive", 0.2)}\` }}>
              <span style={{ fontSize: 16 }}>❌</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: h("--destructive"), marginBottom: 2 }}>Failed to save changes</p>
                <p style={{ fontSize: 13, color: h("--muted-fg") }}>Your internet connection may be unstable. Changes are saved locally and will sync when you're back online.</p>
              </div>
            </div>
          </div>
        )}

        {view === "success" && (
          <div className="space-y-8">
            {/* Success state */}
            <div className="rounded-2xl text-center" style={{ padding: "60px 24px", background: h("--card"), border: \`1px solid hsl(152 55% 40% / 0.2)\` }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                style={{ background: "hsl(152 55% 40% / 0.08)" }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Project created!</h3>
              <p style={{ fontSize: 14, color: h("--muted-fg"), maxWidth: 320, margin: "0 auto 20px" }}>
                Your project "Q2 Launch" is ready. Invite your team to start collaborating.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="rounded-lg px-5 py-2.5 text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Invite Team</button>
                <button className="rounded-lg px-5 py-2.5 text-sm font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>Go to Project</button>
              </div>
            </div>

            {/* Inline success toast */}
            <div className="rounded-xl flex items-center gap-3" style={{ padding: 16, background: "hsl(152 55% 40% / 0.05)", border: \`1px solid hsl(152 55% 40% / 0.2)\` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: "hsl(152 55% 40% / 0.12)", color: "hsl(152 55% 40%)" }}>✓</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Changes saved</p>
                <p style={{ fontSize: 12, color: h("--muted-fg") }}>Your preferences have been updated successfully.</p>
              </div>
              <button style={{ fontSize: 12, color: h("--muted-fg") }}>Dismiss</button>
            </div>
          </div>
        )}
      </div>

      <style>{\`
        @keyframes vk-shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
      \`}</style>
    </div>
  );
}
`,
  "ref-expand-in-place": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefExpandInPlace() {
  const [expandedId, setExpandedId] = useState(1);
  const faqs = [
    { id: 1, q: "How does the AI learn my preferences?", a: "The AI analyzes your interaction patterns over time — which suggestions you accept, which you modify, and which you dismiss. It builds a preference model that improves with every session. After about 10-15 interactions, you'll notice significantly more relevant suggestions.\\n\\nYou can also explicitly tell the AI your preferences in the Settings > AI Preferences panel." },
    { id: 2, q: "Can I export my data?", a: "Yes! Go to Settings > Data & Privacy > Export Data. You can export everything as JSON or CSV. We also support direct integrations with Google Drive and Dropbox for automatic backups.\\n\\nExports include all your projects, tasks, notes, and AI conversation history." },
    { id: 3, q: "What happens when I cancel my subscription?", a: "Your data stays safe for 90 days after cancellation. During this period, you can reactivate anytime and pick up where you left off. After 90 days, we permanently delete all data.\\n\\nYou can export everything before canceling — we make it easy, no dark patterns." },
    { id: 4, q: "Is my data used to train AI models?", a: "No, never. Your data is used exclusively to provide the service to you. We don't use customer data for model training, and we don't sell or share data with third parties.\\n\\nOur privacy policy is written in plain English — no legalese. Read it at privacy.acme.dev." },
    { id: 5, q: "Do you offer team plans?", a: "Yes! Team plans start at $12/user/month and include shared workspaces, role-based permissions, team analytics, and priority support. Enterprise plans with SSO and custom contracts are also available.\\n\\nContact sales@acme.dev for teams of 20+." },
  ];

  const issues = [
    { id: 10, key: "ENG-142", title: "Fix sidebar collapse animation", status: "in-progress", assignee: "SC", priority: "high",
      subtasks: [
        { title: "Investigate CSS transition timing", done: true },
        { title: "Test with prefers-reduced-motion", done: false },
        { title: "Update animation to use transform only", done: false },
      ],
      comments: 3 },
    { id: 11, key: "ENG-143", title: "Add keyboard navigation to command palette", status: "todo", assignee: "JP", priority: "medium",
      subtasks: [
        { title: "Arrow key navigation between results", done: false },
        { title: "Enter to select, Escape to close", done: false },
      ],
      comments: 1 },
    { id: 12, key: "ENG-144", title: "Optimize dashboard initial load time", status: "done", assignee: "MR", priority: "high",
      subtasks: [
        { title: "Lazy load chart components", done: true },
        { title: "Implement data prefetching", done: true },
        { title: "Reduce bundle size by 40%", done: true },
      ],
      comments: 5 },
  ];

  const [expandedIssue, setExpandedIssue] = useState(null);
  const [view, setView] = useState("faq");

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          <button onClick={() => setView("faq")} className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: view === "faq" ? ha("--primary", 0.1) : "transparent", color: view === "faq" ? h("--primary") : h("--muted-fg") }}>FAQ Accordion</button>
          <button onClick={() => setView("issues")} className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: view === "issues" ? ha("--primary", 0.1) : "transparent", color: view === "issues" ? h("--primary") : h("--muted-fg") }}>Issue Expand</button>
        </div>

        {view === "faq" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Frequently Asked Questions</h1>
            <p className="text-sm mb-8" style={{ color: h("--muted-fg") }}>Everything you need to know about the product.</p>
            <div className="space-y-2">
              {faqs.map(faq => (
                <div key={faq.id} className="rounded-xl overflow-hidden transition-all"
                  style={{ background: expandedId === faq.id ? ha("--muted", 0.15) : "transparent", border: \`1px solid \${expandedId === faq.id ? ha("--border", 0.5) : ha("--border", 0.3)}\` }}>
                  <button onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">{faq.q}</span>
                    <span className="text-xs flex-shrink-0 transition-transform" style={{ color: h("--muted-fg"), transform: expandedId === faq.id ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-5 pb-4">
                      <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: ha("--fg", 0.8) }}>{faq.a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {view === "issues" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight mb-6">Engineering Tasks</h1>
            <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
              {issues.map((issue, i) => (
                <div key={issue.id} style={{ borderBottom: i < issues.length - 1 ? \`1px solid \${ha("--border", 0.3)}\` : "none" }}>
                  <button onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: h("--muted-fg") }}>{issue.key}</span>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: issue.status === "done" ? "hsl(152 55% 40%)" : issue.status === "in-progress" ? h("--primary") : ha("--muted", 0.5) }} />
                    <span className="text-sm flex-1" style={{ textDecoration: issue.status === "done" ? "line-through" : "none", color: issue.status === "done" ? h("--muted-fg") : h("--fg") }}>{issue.title}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{issue.assignee}</div>
                    <span className="text-[10px]" style={{ color: h("--muted-fg"), transform: expandedIssue === issue.id ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
                  </button>
                  {expandedIssue === issue.id && (
                    <div className="px-4 pb-4 pl-16">
                      <p className="text-xs font-medium mb-2" style={{ color: h("--muted-fg") }}>Subtasks ({issue.subtasks.filter(s => s.done).length}/{issue.subtasks.length})</p>
                      <div className="space-y-1.5 mb-3">
                        {issue.subtasks.map((st, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded flex items-center justify-center text-[8px]"
                              style={{ background: st.done ? h("--primary") : "transparent", border: st.done ? "none" : \`1.5px solid \${h("--border")}\`, color: h("--primary-fg") }}>
                              {st.done && "✓"}
                            </div>
                            <span className="text-xs" style={{ color: st.done ? h("--muted-fg") : h("--fg"), textDecoration: st.done ? "line-through" : "none" }}>{st.title}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px]" style={{ color: h("--muted-fg") }}>{issue.comments} comments</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
`,
  "ref-feed-timeline": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefFeedTimeline() {
  const [likedIds, setLikedIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const items = [
    { id: 1, type: "post", user: "Sarah Chen", role: "Design Lead", avatar: "SC", time: "12 min ago",
      text: "Just shipped the new onboarding flow! 3 steps instead of 7. Conversion rate already up 23% in the first hour. Sometimes the best feature is removing features.",
      likes: 42, comments: 8, replies: [
        { user: "Marcus Rivera", avatar: "MR", text: "The step indicator animation is *chef's kiss*", time: "8 min ago" },
        { user: "Diana Okafor", avatar: "DO", text: "Love the progress bar. Much clearer than the old dots.", time: "5 min ago" },
      ] },
    { id: 2, type: "milestone", user: "Acme Analytics", time: "2 hrs ago",
      text: "🎉 We just crossed 10,000 active users! Thank you to everyone who's been part of this journey.", likes: 156, comments: 34, replies: [] },
    { id: 3, type: "post", user: "James Park", role: "Engineering", avatar: "JP", time: "4 hrs ago",
      text: "PSA: We're migrating the API from v2 to v3 this weekend. Key changes:\\n\\n• Rate limits increased from 100 to 500 req/min\\n• New batch endpoints for bulk operations\\n• WebSocket support for real-time updates\\n\\nFull migration guide: docs.acme.dev/v3-migration",
      likes: 18, comments: 5, replies: [] },
    { id: 4, type: "post", user: "Priya Sharma", role: "Product", avatar: "PS", time: "Yesterday",
      text: "User interviews this week surfaced a pattern: people love the dashboard but can't find the export button. Moving it from the kebab menu to a top-level action in the next sprint.",
      likes: 31, comments: 12, replies: [] },
    { id: 5, type: "post", user: "Toni Albrecht", role: "Marketing", avatar: "TA", time: "2 days ago",
      text: "Blog post about our design system is live! Covers how we handle theming with CSS variables and why we chose Tailwind over styled-components. Link in bio.",
      likes: 27, comments: 6, replies: [] },
  ];

  const toggleLike = (id) => {
    setLikedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <nav className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ background: ha("--bg", 0.9), borderColor: ha("--border", 0.4) }}>
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">Feed</span>
          <div className="flex items-center gap-3">
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: \`1px solid \${h("--border")}\` }}>Filter</button>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: h("--primary"), color: h("--primary-fg") }}>New Post</button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {items.map(item => (
          <div key={item.id} className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.4)}\` }}>
            <div className="flex items-start gap-3 mb-3">
              {item.type === "milestone" ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: \`linear-gradient(135deg, \${ha("--primary", 0.2)}, \${ha("--primary", 0.05)})\` }}>🎉</div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: ha("--primary", 0.12), color: h("--primary") }}>{item.avatar}</div>
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{item.user}</span>
                  {item.role && <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: ha("--muted", 0.3), color: h("--muted-fg") }}>{item.role}</span>}
                </div>
                <span className="text-[11px]" style={{ color: h("--muted-fg") }}>{item.time}</span>
              </div>
            </div>

            <div className="text-sm leading-relaxed whitespace-pre-line mb-4" style={{ color: ha("--fg", 0.9) }}>{item.text}</div>

            <div className="flex items-center gap-4 pt-2" style={{ borderTop: \`1px solid \${ha("--border", 0.3)}\` }}>
              <button onClick={() => toggleLike(item.id)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: likedIds.has(item.id) ? h("--primary") : h("--muted-fg") }}>
                <span>{likedIds.has(item.id) ? "♥" : "♡"}</span>
                {item.likes + (likedIds.has(item.id) ? 1 : 0)}
              </button>
              <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex items-center gap-1.5 text-xs font-medium" style={{ color: h("--muted-fg") }}>
                💬 {item.comments}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium ml-auto" style={{ color: h("--muted-fg") }}>
                ↗ Share
              </button>
            </div>

            {expandedId === item.id && item.replies.length > 0 && (
              <div className="mt-4 pl-4 space-y-3" style={{ borderLeft: \`2px solid \${ha("--border", 0.4)}\` }}>
                {item.replies.map((r, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                      style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{r.avatar}</div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold">{r.user}</span>
                        <span className="text-[10px]" style={{ color: h("--muted-fg") }}>{r.time}</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: ha("--fg", 0.85) }}>{r.text}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input placeholder="Write a reply..." className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none"
                    style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.4)}\` }} />
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: h("--primary"), color: h("--primary-fg") }}>Reply</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ background: ha("--muted", 0.2), color: h("--muted-fg") }}>
          Load more
        </button>
      </div>
    </div>
  );
}
`,
  "ref-form-sections": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
        <div className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
          <h2 className="text-sm font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <label className="text-sm w-28 flex-shrink-0" style={{ color: h("--muted-fg") }}>Name</label>
              <input defaultValue="Shalini Patel" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2"
                style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.5)}\`, ringColor: ha("--primary", 0.3) }} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <label className="text-sm w-28 flex-shrink-0" style={{ color: h("--muted-fg") }}>Email</label>
              <input defaultValue="shalini@teenylabs.com" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.5)}\` }} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
              <label className="text-sm w-28 flex-shrink-0 mt-2" style={{ color: h("--muted-fg") }}>Bio</label>
              <textarea defaultValue="Building AI-powered apps at TeenyLabs." rows={3}
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none resize-none"
                style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.5)}\` }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
          <h2 className="text-sm font-semibold mb-4">Plan</h2>
          <div className="space-y-2">
            {[{ id: "free", label: "Free", desc: "5 projects, 1 team member" }, { id: "pro", label: "Pro", desc: "Unlimited projects, 10 members, priority support" }, { id: "enterprise", label: "Enterprise", desc: "Custom limits, SSO, dedicated support" }].map(p => (
              <label key={p.id} className="flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all"
                style={{ background: plan === p.id ? ha("--primary", 0.05) : "transparent", border: \`1.5px solid \${plan === p.id ? ha("--primary", 0.4) : ha("--border", 0.3)}\` }}>
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

        <div className="rounded-xl p-5" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
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

        <div className="rounded-xl p-5" style={{ border: \`1px solid \${ha("--destructive", 0.3)}\` }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: h("--destructive") }}>Danger Zone</h2>
          <p className="text-xs mb-3" style={{ color: h("--muted-fg") }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{ background: ha("--destructive", 0.1), color: h("--destructive") }}>Delete Account</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: h("--destructive") }}>Are you sure?</span>
              <button onClick={() => setShowDelete(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>Cancel</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: h("--destructive"), color: h("--destructive-fg") }}>Yes, Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`,
  "ref-inline-edit": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
          style={{ background: ha("--bg", 1), border: \`2px solid \${h("--primary")}\` }} autoFocus />
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
              style={{ borderBottom: i < data.length - 1 ? \`1px solid \${ha("--border", 0.2)}\` : "none" }}>
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
`,
  "ref-landing-page": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
      <nav className="sticky top-0 z-50" style={{ background: ha("--bg", 0.92), backdropFilter: "blur(12px)", borderBottom: \`1px solid \${ha("--border", 0.3)}\` }}>
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
        <div className="absolute pointer-events-none" style={{ top: -160, right: -160, width: 600, height: 600, borderRadius: "50%", background: \`radial-gradient(circle, \${ha("--primary", 0.08)}, transparent 70%)\` }} />
        <div className="absolute pointer-events-none" style={{ bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: \`radial-gradient(circle, \${ha("--accent", 0.06)}, transparent 70%)\` }} />
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
              style={{ border: \`1.5px solid \${ha("--border", 0.6)}\` }}>
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
              style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.4)}\` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = \`0 12px 32px \${ha("--fg", 0.06)}\`; }}
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
              <div key={t.name} className="rounded-2xl p-6" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.4)}\` }}>
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
      <footer style={{ borderTop: \`1px solid \${ha("--border", 0.3)}\`, padding: "32px 0" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">VibeKit</span>
          <p className="text-xs" style={{ color: h("--muted-fg") }}>© 2026 TeenyLabs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
`,
  "ref-overlay-modal": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
              style={{ borderBottom: i < members.length - 1 ? \`1px solid \${ha("--border", 0.3)}\` : "none" }}>
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
          <div className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
            {modal === "invite" && (
              <>
                <h2 className="text-lg font-bold mb-1">Invite team member</h2>
                <p className="text-xs mb-5" style={{ color: h("--muted-fg") }}>They'll receive an email invitation to join your workspace.</p>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: h("--muted-fg") }}>Email address</label>
                    <input placeholder="name@company.com" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                      style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.5)}\` }} autoFocus />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: h("--muted-fg") }}>Role</label>
                    <select className="w-full rounded-lg px-3 py-2.5 text-sm outline-none appearance-none"
                      style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.5)}\` }}>
                      <option>Viewer</option><option>Editor</option><option>Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ border: \`1px solid \${h("--border")}\` }}>Cancel</button>
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
                    style={{ border: \`1px solid \${h("--border")}\` }}>Cancel</button>
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
`,
  "ref-pricing-table": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
              style={{ background: !annual ? h("--card") : "transparent", color: !annual ? h("--fg") : h("--muted-fg"), boxShadow: !annual ? \`0 1px 3px \${ha("--fg", 0.08)}\` : "none" }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)} className="rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{ background: annual ? h("--card") : "transparent", color: annual ? h("--fg") : h("--muted-fg"), boxShadow: annual ? \`0 1px 3px \${ha("--fg", 0.08)}\` : "none" }}>
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
                  background: plan.featured ? \`linear-gradient(135deg, \${h("--primary")}, \${ha("--primary", 0.5)})\` : "transparent",
                }}>
                <div className="rounded-2xl h-full" style={{
                  padding: 28,
                  background: h("--card"),
                  border: plan.featured ? "none" : \`1px solid \${ha("--border", 0.5)}\`,
                }}>
                  {plan.featured && (
                    <div className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-4"
                      style={{ background: ha("--primary", 0.1), color: h("--primary") }}>Most Popular</div>
                  )}
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: h("--muted-fg"), marginBottom: 16 }}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                      \${price}
                    </span>
                    {price > 0 && <span style={{ fontSize: 14, color: h("--muted-fg") }}>/month</span>}
                  </div>
                  <button className="w-full rounded-lg py-3 text-sm font-semibold transition-all mb-6"
                    style={{
                      background: plan.featured ? h("--primary") : "transparent",
                      color: plan.featured ? h("--primary-fg") : h("--fg"),
                      border: plan.featured ? "none" : \`1.5px solid \${ha("--border", 0.5)}\`,
                      minHeight: 44,
                    }}>
                    {plan.cta}
                  </button>
                  <div style={{ borderTop: \`1px solid \${ha("--border", 0.3)}\`, paddingTop: 16 }}>
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
`,
  "ref-product-detail": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("slate");
  const [qty, setQty] = useState(1);

  const images = [
    "https://picsum.photos/seed/jacket1/800/1000",
    "https://picsum.photos/seed/jacket2/800/1000",
    "https://picsum.photos/seed/jacket3/800/1000",
    "https://picsum.photos/seed/jacket4/800/1000",
  ];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { id: "slate", label: "Slate", hex: "hsl(215 15% 35%)" },
    { id: "olive", label: "Olive", hex: "hsl(90 20% 38%)" },
    { id: "clay", label: "Clay", hex: "hsl(18 40% 52%)" },
  ];
  const reviews = [
    { user: "Aisha M.", rating: 5, text: "Perfect weight for spring. Fits true to size and the slate color is exactly as shown.", date: "2 days ago" },
    { user: "Tom R.", rating: 4, text: "Great jacket. Slightly long in the arms for me but the quality is excellent.", date: "1 week ago" },
  ];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: ha("--bg", 0.92), backdropFilter: "blur(12px)", borderBottom: \`1px solid \${ha("--border", 0.3)}\` }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight">Everline</span>
          <div className="flex items-center gap-5 text-sm">
            {["Shop", "Collections", "About"].map(item => (
              <a key={item} className="cursor-pointer" style={{ color: h("--muted-fg") }}>{item}</a>
            ))}
            <button className="relative" style={{ color: h("--fg") }}>
              Bag
              <span className="absolute -top-1.5 -right-3 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: h("--primary"), color: h("--primary-fg") }}>2</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: h("--muted-fg") }}>
          <span className="cursor-pointer" style={{ color: h("--primary") }}>Shop</span>
          <span>›</span>
          <span className="cursor-pointer" style={{ color: h("--primary") }}>Outerwear</span>
          <span>›</span>
          <span>Horizon Chore Jacket</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image gallery */}
          <div className="lg:w-3/5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3">
              <img src={images[selectedImage]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className="w-20 h-20 rounded-lg overflow-hidden transition-all"
                  style={{ border: \`2px solid \${selectedImage === i ? h("--primary") : "transparent"}\`, opacity: selectedImage === i ? 1 : 0.6 }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:w-2/5">
            <div className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3"
              style={{ background: "hsl(152 55% 40% / 0.1)", color: "hsl(152 55% 40%)" }}>New Arrival</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Horizon Chore Jacket</h1>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>$185</span>
              <span style={{ fontSize: 14, textDecoration: "line-through", color: h("--muted-fg") }}>$220</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: ha("--destructive", 0.1), color: h("--destructive") }}>-16%</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: ha("--fg", 0.7), marginBottom: 24 }}>
              A modern take on the classic chore jacket. Garment-dyed organic cotton canvas with a relaxed fit, three patch pockets, and antique brass hardware. Built to age beautifully.
            </p>

            {/* Color */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color — <span style={{ fontWeight: 400, color: h("--muted-fg") }}>{colors.find(c => c.id === selectedColor)?.label}</span></p>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c.id} onClick={() => setSelectedColor(c.id)}
                    className="w-9 h-9 rounded-full transition-all"
                    style={{ background: c.hex, border: \`2.5px solid \${selectedColor === c.id ? h("--primary") : "transparent"}\`, outline: selectedColor === c.id ? \`2px solid \${ha("--primary", 0.3)}\` : "none", outlineOffset: 2 }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 24 }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: 13, fontWeight: 600 }}>Size</p>
                <button style={{ fontSize: 12, color: h("--primary"), fontWeight: 500 }}>Size guide</button>
              </div>
              <div className="flex gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className="w-11 h-11 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selectedSize === s ? h("--primary") : "transparent",
                      color: selectedSize === s ? h("--primary-fg") : h("--fg"),
                      border: \`1.5px solid \${selectedSize === s ? h("--primary") : ha("--border", 0.5)}\`,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center rounded-lg" style={{ border: \`1px solid \${ha("--border", 0.5)}\` }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 text-sm" style={{ color: h("--muted-fg") }}>−</button>
                <span className="w-8 text-center text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-11 text-sm" style={{ color: h("--muted-fg") }}>+</button>
              </div>
              <button className="flex-1 rounded-lg text-sm font-semibold transition-all"
                style={{ background: h("--primary"), color: h("--primary-fg"), minHeight: 44 }}>
                Add to Bag — \${(185 * qty).toLocaleString()}
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3" style={{ borderTop: \`1px solid \${ha("--border", 0.3)}\`, paddingTop: 20 }}>
              {["100% organic cotton canvas", "Garment-dyed for lived-in feel", "Relaxed fit — size down for a closer cut", "Machine wash cold, tumble dry low"].map(d => (
                <div key={d} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: h("--primary") }} />
                  <span style={{ fontSize: 13, color: ha("--fg", 0.7) }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Reviews summary */}
            <div style={{ borderTop: \`1px solid \${ha("--border", 0.3)}\`, marginTop: 24, paddingTop: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Reviews</h3>
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "hsl(45 90% 50%)", fontSize: 13 }}>★★★★★</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>4.8</span>
                  <span style={{ fontSize: 12, color: h("--muted-fg") }}>(127)</span>
                </div>
              </div>
              {reviews.map((r, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{r.user}</span>
                    <span style={{ fontSize: 11, color: h("--muted-fg") }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: ha("--fg", 0.75) }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  "ref-sequential-flow": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
                    style={{ background: ha("--muted", 0.25), border: \`1px solid \${ha("--border", 0.5)}\`, ringColor: ha("--primary", 0.3) }}
                    autoFocus />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">What type of app?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ id: "saas", label: "SaaS", emoji: "⚡" }, { id: "marketplace", label: "Marketplace", emoji: "🏪" }, { id: "consumer", label: "Consumer", emoji: "📱" }].map(t => (
                      <button key={t.id} onClick={() => setData({ ...data, type: t.id })}
                        className="rounded-xl px-4 py-4 text-center transition-all"
                        style={{ background: data.type === t.id ? ha("--primary", 0.08) : ha("--muted", 0.2), border: \`1.5px solid \${data.type === t.id ? ha("--primary", 0.4) : "transparent"}\` }}>
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
                    style={{ background: data.team === t.id ? ha("--primary", 0.06) : "transparent", border: \`1.5px solid \${data.team === t.id ? ha("--primary", 0.4) : ha("--border", 0.3)}\` }}>
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
                    style={{ background: data.features.includes(f.id) ? ha("--primary", 0.06) : ha("--muted", 0.15), border: \`1.5px solid \${data.features.includes(f.id) ? ha("--primary", 0.4) : "transparent"}\` }}>
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
                style={{ background: \`linear-gradient(135deg, \${ha("--primary", 0.2)}, \${ha("--primary", 0.05)})\` }}>🚀</div>
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
                style={{ visibility: step > 0 ? "visible" : "hidden", border: \`1px solid \${h("--border")}\` }}>
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
`,
  "ref-split-pane": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

export default function RefSplitPane() {
  const [selectedId, setSelectedId] = useState(1);
  const emails = [
    { id: 1, from: "Sarah Chen", subject: "Updated design mockups", preview: "Hey! I just pushed the updated designs to Figma. The hero section is completely reworked.", time: "10:42 AM", unread: true, body: "Hey! I just pushed the updated designs to Figma. The hero section is completely reworked — much bolder type hierarchy now.\\n\\nKey changes:\\n• Headline bumped to text-6xl with tighter tracking\\n• Secondary CTA removed (one clear action converts better)\\n• Social proof bar moved above the fold\\n\\nLet me know what you think. I can jump on a quick call if you want to walk through it." },
    { id: 2, from: "Marcus Rivera", subject: "Q2 strategy deck review", preview: "Can you take a look at the latest version? I've incorporated the feedback from last week's meeting.", time: "9:15 AM", unread: true, body: "Can you take a look at the latest version? I've incorporated the feedback from last week's meeting.\\n\\nMain updates:\\n• Slide 4: Revised TAM calculation with new market data\\n• Slide 8: Added competitive positioning matrix\\n• Slide 12: Updated financial projections\\n\\nWould love your input before the board meeting on Thursday." },
    { id: 3, from: "Diana Okafor", subject: "Staging deployment complete", preview: "The latest build is live on staging. All tests passing. Ready for your review.", time: "Yesterday", unread: false, body: "The latest build is live on staging. All tests passing. Ready for your review.\\n\\nURL: staging.acme.dev\\n\\nNotable changes in this release:\\n• New onboarding flow (3-step wizard)\\n• Fixed the sidebar collapse animation\\n• Performance improvement: 40% faster initial load\\n\\nLet me know if you spot anything before we push to production." },
    { id: 4, from: "James Park", subject: "Team offsite logistics", preview: "I've booked the venue for March 15-16. Here are the details and agenda.", time: "Yesterday", unread: false, body: "I've booked the venue for March 15-16. Here are the details:\\n\\nVenue: The Workshop, 234 Valencia St\\nDay 1: Strategy sessions + team dinner\\nDay 2: Hackathon + retrospective\\n\\nPlease fill out the dietary preferences form by Friday. Also, let me know if anyone needs travel arrangements." },
    { id: 5, from: "Priya Sharma", subject: "Invoice #4821 approved", preview: "The Q1 consulting invoice has been approved. Payment will process within 5 business days.", time: "Mar 1", unread: false, body: "The Q1 consulting invoice has been approved and is in the payment queue.\\n\\nAmount: $12,450.00\\nPayment method: ACH transfer\\nExpected processing: Within 5 business days\\n\\nPlease confirm receipt when the funds arrive. Thanks for the great work this quarter!" },
  ];
  const selected = emails.find(e => e.id === selectedId);

  return (
    <div className="flex h-screen" style={{ background: h("--bg"), color: h("--fg") }}>
      <div className="w-80 flex-shrink-0 border-r flex flex-col" style={{ borderColor: h("--border") }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: ha("--border", 0.5) }}>
          <h1 className="text-sm font-bold">Inbox</h1>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{emails.filter(e => e.unread).length} new</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map(e => (
            <div key={e.id} onClick={() => setSelectedId(e.id)} className="px-4 py-3 cursor-pointer transition-colors border-l-2"
              style={{ background: selectedId === e.id ? ha("--primary", 0.05) : "transparent", borderLeftColor: selectedId === e.id ? h("--primary") : "transparent", borderBottom: \`1px solid \${ha("--border", 0.2)}\` }}>
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="text-sm truncate" style={{ fontWeight: e.unread ? 600 : 400 }}>{e.from}</span>
                <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: h("--muted-fg") }}>{e.time}</span>
              </div>
              <p className="text-[13px] truncate mb-0.5" style={{ fontWeight: e.unread ? 500 : 400 }}>{e.subject}</p>
              <p className="text-xs truncate" style={{ color: h("--muted-fg") }}>{e.preview}</p>
            </div>
          ))}
        </div>
      </div>
      <main className="flex-1 flex flex-col min-w-0">
        {selected && <>
          <header className="px-6 py-5 border-b flex-shrink-0" style={{ borderColor: ha("--border", 0.4) }}>
            <h2 className="text-lg font-bold tracking-tight mb-1">{selected.subject}</h2>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: ha("--primary", 0.12), color: h("--primary") }}>{selected.from.split(" ").map(n => n[0]).join("")}</div>
              <div>
                <span className="text-sm font-medium">{selected.from}</span>
                <span className="text-xs ml-2" style={{ color: h("--muted-fg") }}>{selected.time}</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-2xl text-sm leading-relaxed whitespace-pre-line" style={{ color: ha("--fg", 0.85) }}>{selected.body}</div>
          </div>
          <div className="px-6 py-3 border-t flex-shrink-0" style={{ borderColor: ha("--border", 0.4) }}>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: h("--primary"), color: h("--primary-fg") }}>Reply</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>Forward</button>
            </div>
          </div>
        </>}
      </main>
    </div>
  );
}
`,
  "ref-tab-sections": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: \`1px solid \${h("--border")}\` }}>Share</button>
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
                <div key={m.label} className="rounded-xl p-4" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
                  <p className="text-xs mb-1" style={{ color: h("--muted-fg") }}>{m.label}</p>
                  <p className="text-xl font-bold" style={{ color: m.color || h("--fg"), fontVariantNumeric: "tabular-nums" }}>{m.value}</p>
                  {m.pct && <div className="w-full h-1.5 rounded-full mt-2" style={{ background: ha("--muted", 0.3) }}><div className="h-full rounded-full" style={{ width: \`\${m.pct}%\`, background: h("--primary") }} /></div>}
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-3">Recent Tasks</h2>
              <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
                {[{ task: "Finalize landing page copy", assignee: "SC", status: "done" }, { task: "Set up analytics tracking", assignee: "JP", status: "in-progress" }, { task: "Create demo video", assignee: "DO", status: "in-progress" }, { task: "Configure email sequences", assignee: "MR", status: "overdue" }].map((t, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: i < 3 ? \`1px solid \${ha("--border", 0.3)}\` : "none" }}>
                    <div className="w-4 h-4 rounded flex items-center justify-center text-[9px]"
                      style={{ background: t.status === "done" ? h("--primary") : "transparent", border: t.status === "done" ? "none" : \`1.5px solid \${h("--border")}\`, color: h("--primary-fg") }}>
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
                style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
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
`,
  "ref-workspace-sidebar": `const h = (v) => \`hsl(var(\${v}))\`;
const ha = (v, a) => \`hsl(var(\${v}) / \${a})\`;

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
                <div key={m.label} className="rounded-xl p-4" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
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
                <div key={i} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < activity.length - 1 ? \`1px solid \${ha("--border", 0.3)}\` : "none" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>{a.user.split(" ").map(n => n[0]).join("")}</div>
                  <p className="text-sm flex-1 truncate"><span className="font-medium">{a.user}</span> <span style={{ color: h("--muted-fg") }}>{a.action}</span></p>
                  <span className="text-[11px] flex-shrink-0" style={{ color: h("--muted-fg") }}>{a.time}</span>
                </div>
              ))}
            </div>
          </>}
          {nav === "Projects" && <div className="space-y-3">
            {projects.map(p => (
              <div key={p.name} className="rounded-xl p-4 flex items-center gap-4" style={{ background: h("--card"), border: \`1px solid \${ha("--border", 0.5)}\` }}>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-1">{p.name}</h3>
                  <p className="text-xs" style={{ color: h("--muted-fg") }}>{p.complete}/{p.tasks} tasks complete</p>
                </div>
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: ha("--muted", 0.3) }}>
                  <div className="h-full rounded-full" style={{ width: \`\${(p.complete / p.tasks) * 100}%\`, background: h("--primary") }} />
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
`,
};
