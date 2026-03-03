import { useState } from "react";

const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function Overview() {
  const [nav, setNav] = useState("Overview");
  const [period, setPeriod] = useState("30d");
  
  const accounts = [
    { name: "Chase Checking", type: "checking", balance: 2847.32, change: "+$234.50" },
    { name: "Savings", type: "savings", balance: 12450, change: "+$125.00" },
    { name: "Chase Freedom", type: "credit", balance: -1203.45, change: "-$87.23" }
  ];

  const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const metrics = [
    { label: "Net Worth", value: `$${netWorth.toLocaleString()}`, change: "+2.8%", up: true },
    { label: "Monthly Income", value: "$6,400", change: "+5.2%", up: true },
    { label: "Monthly Expenses", value: "$4,127", change: "-3.1%", up: false },
    { label: "Savings Rate", value: "35.5%", change: "+1.2%", up: true }
  ];

  const recentTransactions = [
    { date: "2024-01-15", merchant: "Whole Foods", amount: -87.23, category: "Groceries" },
    { date: "2024-01-15", merchant: "Acme Corp", amount: 3200, category: "Income" },
    { date: "2024-01-14", merchant: "Shell", amount: -45, category: "Gas" },
    { date: "2024-01-14", merchant: "Netflix", amount: -12.5, category: "Entertainment" },
    { date: "2024-01-13", merchant: "Target", amount: -156.78, category: "Shopping" }
  ];

  const budgets = [
    { category: "Groceries", spent: 287.45, allocated: 600, color: "hsl(152 55% 40%)" },
    { category: "Gas", spent: 145.3, allocated: 200, color: "hsl(45 90% 50%)" },
    { category: "Entertainment", spent: 87.5, allocated: 150, color: h("--primary") },
    { category: "Dining Out", spent: 203.2, allocated: 300, color: "hsl(280 65% 55%)" }
  ];

  return (
    <div className="flex h-screen" style={{ background: h("--bg"), color: h("--fg") }}>
      <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ background: h("--card"), borderColor: h("--border") }}>
        <div className="px-4 py-4 flex items-center gap-3 border-b" style={{ borderColor: ha("--border", 0.4) }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: h("--primary"), color: h("--primary-fg") }}>M</div>
          <div>
            <div className="font-bold text-sm">MoneyTracker</div>
            <div className="text-xs" style={{ color: h("--muted-fg") }}>Personal Finance</div>
          </div>
        </div>
        
        <nav className="px-3 py-4 space-y-1 flex-1">
          {[
            { label: "Overview", icon: "📊", screen: "overview" },
            { label: "Transactions", icon: "🧾", screen: "transactions" },
            { label: "Budgets", icon: "🎯", screen: "budgets" }
          ].map(item => (
            <button key={item.label} onClick={() => setNav(item.label)} data-navigate={item.screen}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ 
                background: nav === item.label ? ha("--primary", 0.08) : "transparent", 
                color: nav === item.label ? h("--fg") : h("--muted-fg"), 
                fontWeight: nav === item.label ? 600 : 400 
              }}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t" style={{ borderColor: ha("--border", 0.4) }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: ha("--primary", 0.12), color: h("--primary") }}>SP</div>
            <div className="text-sm">
              <div className="font-medium">Sarah Parker</div>
              <div style={{ color: h("--muted-fg") }}>Premium Plan</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="px-6 py-5 border-b backdrop-blur-md sticky top-0 z-10" style={{ background: ha("--bg", 0.9), borderColor: ha("--border", 0.4) }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Overview</h1>
              <p className="text-sm mt-0.5" style={{ color: h("--muted-fg") }}>Your financial snapshot · Updated 5 min ago</p>
            </div>
            <div className="flex items-center gap-2">
              {["7d", "30d", "90d"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ 
                    background: period === p ? h("--primary") : ha("--muted", 0.4), 
                    color: period === p ? h("--primary-fg") : h("--muted-fg") 
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="px-6 py-6 space-y-8">
          {/* Metrics Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {metrics.map(m => (
              <div key={m.label} className="rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300" 
                style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                <p className="text-xs font-medium mb-2" style={{ color: h("--muted-fg") }}>{m.label}</p>
                <p className="text-2xl font-bold tracking-tight mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>{m.value}</p>
                <p className="text-xs font-medium" style={{ color: m.up ? "hsl(152 55% 40%)" : h("--destructive") }}>
                  {m.change} vs last {period}
                </p>
              </div>
            ))}
          </div>

          {/* Accounts */}
          <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: ha("--border", 0.4) }}>
              <h2 className="text-sm font-semibold">Accounts</h2>
              <button className="text-xs font-medium" style={{ color: h("--primary") }}>Add Account</button>
            </div>
            {accounts.map((acc, i) => (
              <div key={acc.name} className="px-5 py-4 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                style={{ 
                  background: i % 2 === 0 ? "transparent" : ha("--muted", 0.02),
                  borderBottom: i < accounts.length - 1 ? `1px solid ${ha("--border", 0.3)}` : "none" 
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold" 
                    style={{ background: ha("--primary", 0.1), color: h("--primary") }}>
                    {acc.name.split(" ")[0][0]}{acc.name.split(" ")[1]?.[0] || ""}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{acc.name}</div>
                    <div className="text-xs capitalize" style={{ color: h("--muted-fg") }}>{acc.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ 
                    fontVariantNumeric: "tabular-nums", 
                    color: acc.balance >= 0 ? "hsl(152 55% 40%)" : h("--destructive") 
                  }}>
                    ${Math.abs(acc.balance).toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: h("--muted-fg") }}>{acc.change}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Budget Status */}
            <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: ha("--border", 0.4) }}>
                <h2 className="text-sm font-semibold">Budget Status</h2>
                <button className="text-xs font-medium" data-navigate="budgets" style={{ color: h("--primary") }}>View all</button>
              </div>
              <div className="p-5 space-y-4">
                {budgets.map(budget => {
                  const percentage = (budget.spent / budget.allocated) * 100;
                  const isOverBudget = percentage > 100;
                  return (
                    <div key={budget.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{budget.category}</span>
                        <span className="text-xs font-medium" style={{ color: isOverBudget ? h("--destructive") : h("--muted-fg") }}>
                          ${budget.spent.toFixed(0)} / ${budget.allocated}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: ha("--muted", 0.3) }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ 
                          width: `${Math.min(percentage, 100)}%`, 
                          background: isOverBudget ? h("--destructive") : budget.color 
                        }} />
                      </div>
                      {isOverBudget && (
                        <p className="text-xs mt-1" style={{ color: h("--destructive") }}>
                          ${(budget.spent - budget.allocated).toFixed(0)} over budget
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: ha("--border", 0.4) }}>
                <h2 className="text-sm font-semibold">Recent Transactions</h2>
                <button className="text-xs font-medium" data-navigate="transactions" style={{ color: h("--primary") }}>View all</button>
              </div>
              {recentTransactions.map((txn, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                  style={{ borderBottom: i < recentTransactions.length - 1 ? `1px solid ${ha("--border", 0.3)}` : "none" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: txn.amount > 0 ? "hsl(152 55% 40%)" : h("--muted-fg") }} />
                    <div>
                      <div className="text-sm font-medium">{txn.merchant}</div>
                      <div className="text-xs flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" 
                          style={{ background: ha("--primary", 0.1), color: h("--primary") }}>
                          {txn.category}
                        </span>
                        <span style={{ color: h("--muted-fg") }}>• {txn.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold" style={{ 
                    fontVariantNumeric: "tabular-nums", 
                    color: txn.amount > 0 ? "hsl(152 55% 40%)" : h("--fg") 
                  }}>
                    {txn.amount > 0 ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}