const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefSplitPane() {
  const [selectedId, setSelectedId] = useState(1);
  const emails = [
    { id: 1, from: "Sarah Chen", subject: "Updated design mockups", preview: "Hey! I just pushed the updated designs to Figma. The hero section is completely reworked.", time: "10:42 AM", unread: true, body: "Hey! I just pushed the updated designs to Figma. The hero section is completely reworked — much bolder type hierarchy now.\n\nKey changes:\n• Headline bumped to text-6xl with tighter tracking\n• Secondary CTA removed (one clear action converts better)\n• Social proof bar moved above the fold\n\nLet me know what you think. I can jump on a quick call if you want to walk through it." },
    { id: 2, from: "Marcus Rivera", subject: "Q2 strategy deck review", preview: "Can you take a look at the latest version? I've incorporated the feedback from last week's meeting.", time: "9:15 AM", unread: true, body: "Can you take a look at the latest version? I've incorporated the feedback from last week's meeting.\n\nMain updates:\n• Slide 4: Revised TAM calculation with new market data\n• Slide 8: Added competitive positioning matrix\n• Slide 12: Updated financial projections\n\nWould love your input before the board meeting on Thursday." },
    { id: 3, from: "Diana Okafor", subject: "Staging deployment complete", preview: "The latest build is live on staging. All tests passing. Ready for your review.", time: "Yesterday", unread: false, body: "The latest build is live on staging. All tests passing. Ready for your review.\n\nURL: staging.acme.dev\n\nNotable changes in this release:\n• New onboarding flow (3-step wizard)\n• Fixed the sidebar collapse animation\n• Performance improvement: 40% faster initial load\n\nLet me know if you spot anything before we push to production." },
    { id: 4, from: "James Park", subject: "Team offsite logistics", preview: "I've booked the venue for March 15-16. Here are the details and agenda.", time: "Yesterday", unread: false, body: "I've booked the venue for March 15-16. Here are the details:\n\nVenue: The Workshop, 234 Valencia St\nDay 1: Strategy sessions + team dinner\nDay 2: Hackathon + retrospective\n\nPlease fill out the dietary preferences form by Friday. Also, let me know if anyone needs travel arrangements." },
    { id: 5, from: "Priya Sharma", subject: "Invoice #4821 approved", preview: "The Q1 consulting invoice has been approved. Payment will process within 5 business days.", time: "Mar 1", unread: false, body: "The Q1 consulting invoice has been approved and is in the payment queue.\n\nAmount: $12,450.00\nPayment method: ACH transfer\nExpected processing: Within 5 business days\n\nPlease confirm receipt when the funds arrive. Thanks for the great work this quarter!" },
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
              style={{ background: selectedId === e.id ? ha("--primary", 0.05) : "transparent", borderLeftColor: selectedId === e.id ? h("--primary") : "transparent", borderBottom: `1px solid ${ha("--border", 0.2)}` }}>
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
              <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ border: `1px solid ${h("--border")}` }}>Forward</button>
            </div>
          </div>
        </>}
      </main>
    </div>
  );
}
