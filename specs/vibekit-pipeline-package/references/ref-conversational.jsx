const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefConversational() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "assistant", text: "Hey! I'm your AI cooking assistant. Tell me what ingredients you have or what you're in the mood for, and I'll suggest recipes.", time: "10:30 AM" },
    { id: 2, from: "user", text: "I have chicken thighs, coconut milk, and some Thai basil. About 30 minutes to cook.", time: "10:31 AM" },
    { id: 3, from: "assistant", text: "Perfect combo! I'd go with a Thai Basil Coconut Chicken.\n\nHere's the quick version:\n\n1. Season and sear chicken thighs (5 min)\n2. Add minced garlic, ginger, and chili flakes (1 min)\n3. Pour in coconut milk, simmer until chicken is cooked through (15 min)\n4. Stir in Thai basil and fish sauce at the end (2 min)\n\nServe over jasmine rice. Total time: about 25 minutes.\n\nWant the full recipe with exact measurements?", time: "10:31 AM" },
    { id: 4, from: "user", text: "Yes please! Also, can I substitute anything for fish sauce? I don't have any.", time: "10:33 AM" },
    { id: 5, from: "assistant", text: "Absolutely! Soy sauce works as a substitute — use about half the amount since it's saltier. Or a pinch of salt with a squeeze of lime gets you close.\n\nHere's the full recipe:\n\n• 4 chicken thighs, boneless\n• 1 can (400ml) coconut milk\n• 3 cloves garlic, minced\n• 1 tbsp fresh ginger, grated\n• 1 tsp red chili flakes\n• 1 cup Thai basil leaves\n• 1 tbsp soy sauce (or 2 tsp fish sauce)\n• Salt and pepper to taste\n• Jasmine rice for serving", time: "10:34 AM" },
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
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ha("--primary", 0.3)}, ${ha("--primary", 0.1)})` }}>
          <span className="text-sm">🧑‍🍳</span>
        </div>
        <div>
          <div className="text-sm font-semibold">Chef AI</div>
          <div className="text-[10px]" style={{ color: h("--muted-fg") }}>Always ready to cook</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ border: `1px solid ${h("--border")}` }}>History</button>
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
                    <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: h("--muted-fg"), animationDelay: `${i * 200}ms` }} />
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
            style={{ background: ha("--muted", 0.3), border: `1px solid ${ha("--border", 0.5)}` }} />
          <button onClick={handleSend} className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: input.trim() ? h("--primary") : ha("--muted", 0.3), color: input.trim() ? h("--primary-fg") : h("--muted-fg") }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
