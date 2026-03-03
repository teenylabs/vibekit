const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

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
                  boxShadow: period === p ? `0 1px 3px ${ha("--fg", 0.08)}` : "none",
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map(m => (
            <div key={m.label} className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
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
          <div className="lg:col-span-2 rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold">Revenue Trend</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: ha("--primary", 0.1), color: h("--primary") }}>+12.5%</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={ha("--border", 0.3)} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: ha("--muted-fg", 1) }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: ha("--muted-fg", 1) }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                <Tooltip
                  contentStyle={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke={chartPrimary} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic sources pie */}
          <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
            <h2 className="text-sm font-semibold mb-4">Traffic Sources</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {channelData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}`, borderRadius: 8, fontSize: 12 }}
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
        <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Revenue by Plan</h2>
            <button className="text-xs font-medium" style={{ color: h("--primary") }}>View details</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={ha("--border", 0.3)} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: ha("--muted-fg", 1) }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: h("--fg") }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}`, borderRadius: 8, fontSize: 12 }}
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="amount" fill={chartPrimary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
