import { useState } from "react";

const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function Transactions() {
  const [nav, setNav] = useState("Transactions");
  const [selectedId, setSelectedId] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  
  const transactions = [
    { id: 1, date: "2024-01-15", merchant: "Whole Foods Market", amount: -87.23, category: "Groceries", account: "Chase Checking", description: "Weekly grocery shopping - organic produce, dairy products", status: "cleared" },
    { id: 2, date: "2024-01-15", merchant: "Acme Corp", amount: 3200, category: "Income", account: "Chase Checking", description: "Bi-weekly salary deposit", status: "cleared" },
    { id: 3, date: "2024-01-14", merchant: "Shell Gas Station", amount: -45.67, category: "Gas", account: "Chase Freedom", description: "Fill up - Premium gasoline", status: "pending" },
    { id: 4, date: "2024-01-14", merchant: "Netflix", amount: -15.99, category: "Entertainment", account: "Chase Checking", description: "Monthly streaming subscription", status: "cleared" },
    { id: 5, date: "2024-01-13", merchant: "Target", amount: -156.78, category: "Shopping", account: "Chase Freedom", description: "Household items, clothing", status: "cleared" },
    { id: 6, date: "2024-01-13", merchant: "Starbucks", amount: -8.45, category: "Dining Out", account: "Chase Checking", description: "Morning coffee and pastry", status: "cleared" },
    { id: 7, date: "2024-01-12", merchant: "Amazon", amount: -67.99, category: "Shopping", account: "Chase Freedom", description: "Books, home office supplies", status: "cleared" },
    { id: 8, date: "2024-01-12", merchant: "Electric Company", amount: -142.33, category: "Utilities", account: "Chase Checking", description: "Monthly electricity bill", status: "cleared" }
  ];

  const categories = ["All", "Income", "Groceries", "Gas", "Entertainment", "Shopping", "Dining Out", "Utilities"];
  const accounts = ["All", "Chase Checking", "Chase Freedom", "Savings"];

  const filteredTransactions = transactions.filter(t => 
    (categoryFilter === "All" || t.category === categoryFilter) &&
    (accountFilter === "All" || t.account === accountFilter)
  );

  const selected = transactions.find(t => t.id === selectedId);

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

      <div className="flex-1 flex min-w-0">
        <div className="w-96 flex-shrink-0 border-r flex flex-col" style={{ borderColor: h("--border") }}>
          <div className="px-4 py-4 border-b" style={{ borderColor: ha("--border", 0.4) }}>
            <h1 className="text-lg font-bold tracking-tight mb-3">Transactions</h1>
            
            {/* Filters */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: h("--muted-fg") }}>Category</label>
                <div className="flex flex-wrap gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setCategoryFilter(cat)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                      style={{ 
                        background: categoryFilter === cat ? h("--primary") : ha("--muted", 0.4), 
                        color: categoryFilter === cat ? h("--primary-fg") : h("--muted-fg") 
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: h("--muted-fg") }}>Account</label>
                <div className="flex flex-wrap gap-1">
                  {accounts.map(acc => (
                    <button key={acc} onClick={() => setAccountFilter(acc)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                      style={{ 
                        background: accountFilter === acc ? h("--primary") : ha("--muted", 0.4), 
                        color: accountFilter === acc ? h("--primary-fg") : h("--muted-fg") 
                      }}>
                      {acc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredTransactions.map(t => (
              <div key={t.id} onClick={() => setSelectedId(t.id)}
                className="px-4 py-3 cursor-pointer transition-colors border-l-2 hover:bg-opacity-50"
                style={{ 
                  background: selectedId === t.id ? ha("--primary", 0.05) : "transparent",
                  borderLeftColor: selectedId === t.id ? h("--primary") : "transparent",
                  borderBottom: `1px solid ${ha("--border", 0.2)}`
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{t.merchant}</span>
                  <span className="text-sm font-bold flex-shrink-0 ml-2" style={{ 
                    fontVariantNumeric: "tabular-nums",
                    color: t.amount > 0 ? "hsl(152 55% 40%)" : h("--fg") 
                  }}>
                    {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" 
                    style={{ background: ha("--primary", 0.1), color: h("--primary") }}>
                    {t.category}
                  </span>
                  <span className="text-xs" style={{ color: h("--muted-fg") }}>•</span>
                  <span className="text-xs" style={{ color: h("--muted-fg") }}>{t.date}</span>
                </div>
                <p className="text-xs truncate" style={{ color: h("--muted-fg") }}>{t.account}</p>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t" style={{ borderColor: ha("--border", 0.4) }}>
            <button className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all" 
              data-overlay="add-transaction"
              style={{ background: h("--primary"), color: h("--primary-fg") }}>
              Add Transaction
            </button>
          </div>
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          {selected && (
            <>
              <header className="px-6 py-5 border-b flex-shrink-0" style={{ borderColor: ha("--border", 0.4) }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight mb-1">{selected.merchant}</h2>
                    <div className="flex items-center gap-3 text-sm" style={{ color: h("--muted-fg") }}>
                      <span>{selected.date}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" 
                        style={{ 
                          background: selected.status === "cleared" ? "hsl(152 55% 40% / 0.1)" : "hsl(45 90% 50% / 0.1)",
                          color: selected.status === "cleared" ? "hsl(152 55% 40%)" : "hsl(45 90% 50%)"
                        }}>
                        {selected.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tracking-tight" style={{ 
                      fontVariantNumeric: "tabular-nums",
                      color: selected.amount > 0 ? "hsl(152 55% 40%)" : h("--fg") 
                    }}>
                      {selected.amount > 0 ? "+" : ""}${Math.abs(selected.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-2xl space-y-6">
                  <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                    <h3 className="text-sm font-semibold mb-4">Transaction Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: h("--muted-fg") }}>Category</span>
                        <span className="text-sm font-medium">{selected.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: h("--muted-fg") }}>Account</span>
                        <span className="text-sm font-medium">{selected.account}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: h("--muted-fg") }}>Status</span>
                        <span className="text-sm font-medium capitalize">{selected.status}</span>
                      </div>
                      <div className="pt-2 border-t" style={{ borderColor: ha("--border", 0.3) }}>
                        <span className="text-sm block mb-2" style={{ color: h("--muted-fg") }}>Description</span>
                        <p className="text-sm leading-relaxed">{selected.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                    <h3 className="text-sm font-semibold mb-4">Actions</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: h("--primary"), color: h("--primary-fg") }}>
                        Edit Transaction
                      </button>
                      <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ border: `1px solid ${h("--border")}` }}>
                        Recategorize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}