import { useState } from "react";

const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function AddTransaction() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    category: "Groceries",
    account: "Chase Checking",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const categories = ["Groceries", "Gas", "Entertainment", "Dining Out", "Shopping", "Utilities", "Transportation", "Healthcare", "Income"];
  const accounts = ["Chase Checking", "Chase Freedom", "Savings"];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="rounded-xl shadow-xl" 
        style={{ 
          background: h("--card"), 
          border: `1px solid ${ha("--border", 0.5)}`,
          maxWidth: "min(420px, calc(100vw - 32px))",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden"
        }}>
        
        <header className="px-6 py-4 border-b" style={{ borderColor: ha("--border", 0.4) }}>
          <h2 className="text-lg font-bold tracking-tight">Add Transaction</h2>
          <p className="text-xs mt-1" style={{ color: h("--muted-fg") }}>Manually add a cash transaction or correction</p>
        </header>

        <div className="px-6 py-6 space-y-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          <div>
            <label className="text-sm font-medium block mb-2">Merchant / Description *</label>
            <input 
              value={formData.merchant}
              onChange={(e) => handleChange("merchant", e.target.value)}
              placeholder="e.g. Whole Foods, Coffee Shop"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ 
                background: ha("--muted", 0.25), 
                border: `1px solid ${ha("--border", 0.5)}`, 
                ringColor: ha("--primary", 0.3) 
              }} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-2">Amount *</label>
              <input 
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  background: ha("--muted", 0.25), 
                  border: `1px solid ${ha("--border", 0.5)}`, 
                  ringColor: ha("--primary", 0.3) 
                }} 
              />
              <p className="text-xs mt-1" style={{ color: h("--muted-fg") }}>Use negative for expenses</p>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Date</label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  background: ha("--muted", 0.25), 
                  border: `1px solid ${ha("--border", 0.5)}`, 
                  ringColor: ha("--primary", 0.3) 
                }} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  background: ha("--muted", 0.25), 
                  border: `1px solid ${ha("--border", 0.5)}`, 
                  ringColor: ha("--primary", 0.3) 
                }}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Account</label>
              <select 
                value={formData.account}
                onChange={(e) => handleChange("account", e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  background: ha("--muted", 0.25), 
                  border: `1px solid ${ha("--border", 0.5)}`, 
                  ringColor: ha("--primary", 0.3) 
                }}>
                {accounts.map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Notes (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Additional details about this transaction..."
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-all focus:ring-2"
              style={{ 
                background: ha("--muted", 0.25), 
                border: `1px solid ${ha("--border", 0.5)}`, 
                ringColor: ha("--primary", 0.3) 
              }} 
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: ha("--border", 0.4) }}>
          <button 
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ border: `1px solid ${ha("--border", 0.5)}` }}>
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ 
              background: saved ? "hsl(152 55% 40%)" : h("--primary"), 
              color: h("--primary-fg") 
            }}>
            {saved ? "✓ Saved" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}