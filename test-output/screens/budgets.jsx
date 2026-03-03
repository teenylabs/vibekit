import { useState } from "react";

const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function Budgets() {
  const [nav, setNav] = useState("Budgets");
  const [period, setPeriod] = useState("January 2024");
  
  const budgets = [
    { category: "Groceries", allocated: 600, spent: 287.45, transactions: 12, color: "hsl(152 55% 40%)" },
    { category: "Gas", allocated: 200, spent: 145.30, transactions: 8, color: "hsl(45 90% 50%)" },
    { category: "Entertainment", allocated: 150, spent: 87.50, transactions: 6, color: h("--primary") },
    { category: "Dining Out", allocated: 300, spent: 203.20, transactions: 15, color: "hsl(280 65% 55%)" },
    { category: "Shopping", allocated: 400, spent: 456.78, transactions: 9, color: "hsl(15 75% 55%)" },
    { category: "Utilities", allocated: 250, spent: 142.33, transactions: 3, color: "hsl(200 85% 45%)" },
    { category: "Transportation", allocated: 180, spent: 95.60, transactions: 4, color: "hsl(120 45% 50%)" },
    { category: "Healthcare", allocated: 200, spent: 45.00, transactions: 2, color: "hsl(340 75% 55%)" }
  ];

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;

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
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="px-6 py-5 border-b backdrop-blur-md sticky top-0 z-10" style={{ background: ha("--bg", 0.9), borderColor: ha("--border", 0.4) }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Budgets</h1>
              <p className="text-sm mt-0.5" style={{ color: h("--muted-fg") }}>Track your spending across categories</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={period} onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm border outline-none"
                style={{ background: h("--card"), borderColor: ha("--border", 0.5), color: h("--fg") }}>
                <option>January 2024</option>
                <option>December 2023</option>
                <option>November 2023</option>
              </select>
              <button className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: h("--primary"), color: h("--primary-fg") }}>
                Edit Budgets
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 py-6 space-y-6">
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
              <p className="text-xs font-medium mb-2" style={{ color: h("--muted-fg") }}>Total Budget</p>
              <p className="text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>${totalAllocated.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: h("--muted-fg") }}>for {period}</p>
            </div>
            
            <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
              <p className="text-xs font-medium mb-2" style={{ color: h("--muted-fg") }}>Total Spent</p>
              <p className="text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>${totalSpent.toFixed(2)}</p>
              <p className="text-xs mt-1" style={{ color: (totalSpent / totalAllocated) > 0.9 ? h("--destructive") : "hsl(152 55% 40%)" }}>
                {((totalSpent / totalAllocated) * 100).toFixed(1)}% of budget
              </p>
            </div>

            <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
              <p className="text-xs font-medium mb-2" style={{ color: h("--muted-fg") }}>Remaining</p>
              <p className="text-2xl font-bold tracking-tight" style={{ 
                fontVariantNumeric: "tabular-nums", 
                color: remainingBudget >= 0 ? "hsl(152 55% 40%)" : h("--destructive") 
              }}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </p>
              <p className="text-xs mt-1" style={{ color: h("--muted-fg") }}>
                {remainingBudget >= 0 ? "under budget" : "over budget"}
              </p>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="rounded-xl border" style={{ borderColor: ha("--border", 0.5) }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: ha("--border", 0.4) }}>
              <h2 className="text-sm font-semibold">Category Breakdown</h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: ha("--border", 0.3) }}>
              {budgets.map((budget, i) => {
                const percentage = (budget.spent / budget.allocated) * 100;
                const isOverBudget = percentage > 100;
                const isNearLimit = percentage > 80 && percentage <= 100;
                
                return (
                  <div key={budget.category} className="p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300" 
                    style={{ background: h("--card") }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">{budget.category}</h3>
                      <span className="text-xs px-2 py-1 rounded-full" 
                        style={{ 
                          background: isOverBudget ? ha("--destructive", 0.1) : isNearLimit ? "hsl(45 90% 50% / 0.1)" : ha("--primary", 0.1),
                          color: isOverBudget ? h("--destructive") : isNearLimit ? "hsl(45 90% 50%)" : h("--primary")
                        }}>
                        {budget.transactions} transactions
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-lg font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                          ${budget.spent.toFixed(2)}
                        </span>
                        <span className="text-sm" style={{ color: h("--muted-fg") }}>
                          / ${budget.allocated}
                        </span>
                      </div>
                      
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: ha("--muted", 0.3) }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ 
                          width: `${Math.min(percentage, 100)}%`, 
                          background: isOverBudget ? h("--destructive") : isNearLimit ? "hsl(45 90% 50%)" : budget.color 
                        }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: h("--muted-fg") }}>
                        {percentage.toFixed(1)}% used
                      </span>
                      <span style={{ 
                        color: isOverBudget ? h("--destructive") : isNearLimit ? "hsl(45 90% 50%)" : "hsl(152 55% 40%)" 
                      }}>
                        {isOverBudget 
                          ? `$${(budget.spent - budget.allocated).toFixed(2)} over`
                          : `$${(budget.allocated - budget.spent).toFixed(2)} left`
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Tips */}
          <div className="rounded-xl p-5" style={{ background: ha("--primary", 0.05), border: `1px solid ${ha("--primary", 0.2)}` }}>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                style={{ background: h("--primary"), color: h("--primary-fg") }}>
                💡
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: h("--primary") }}>Budget Insights</h3>
                <p className="text-sm leading-relaxed" style={{ color: ha("--fg", 0.8) }}>
                  You're spending 15% more on Shopping this month. Consider setting alerts when you reach 75% of your budget 
                  to help stay on track.
                </p>
                <button className="text-xs font-medium mt-2" style={{ color: h("--primary") }}>
                  Set up budget alerts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}