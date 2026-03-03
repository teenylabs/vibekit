const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefExpandInPlace() {
  const [expandedId, setExpandedId] = useState(1);
  const faqs = [
    { id: 1, q: "How does the AI learn my preferences?", a: "The AI analyzes your interaction patterns over time — which suggestions you accept, which you modify, and which you dismiss. It builds a preference model that improves with every session. After about 10-15 interactions, you'll notice significantly more relevant suggestions.\n\nYou can also explicitly tell the AI your preferences in the Settings > AI Preferences panel." },
    { id: 2, q: "Can I export my data?", a: "Yes! Go to Settings > Data & Privacy > Export Data. You can export everything as JSON or CSV. We also support direct integrations with Google Drive and Dropbox for automatic backups.\n\nExports include all your projects, tasks, notes, and AI conversation history." },
    { id: 3, q: "What happens when I cancel my subscription?", a: "Your data stays safe for 90 days after cancellation. During this period, you can reactivate anytime and pick up where you left off. After 90 days, we permanently delete all data.\n\nYou can export everything before canceling — we make it easy, no dark patterns." },
    { id: 4, q: "Is my data used to train AI models?", a: "No, never. Your data is used exclusively to provide the service to you. We don't use customer data for model training, and we don't sell or share data with third parties.\n\nOur privacy policy is written in plain English — no legalese. Read it at privacy.acme.dev." },
    { id: 5, q: "Do you offer team plans?", a: "Yes! Team plans start at $12/user/month and include shared workspaces, role-based permissions, team analytics, and priority support. Enterprise plans with SSO and custom contracts are also available.\n\nContact sales@acme.dev for teams of 20+." },
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
                  style={{ background: expandedId === faq.id ? ha("--muted", 0.15) : "transparent", border: `1px solid ${expandedId === faq.id ? ha("--border", 0.5) : ha("--border", 0.3)}` }}>
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
                <div key={issue.id} style={{ borderBottom: i < issues.length - 1 ? `1px solid ${ha("--border", 0.3)}` : "none" }}>
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
                              style={{ background: st.done ? h("--primary") : "transparent", border: st.done ? "none" : `1.5px solid ${h("--border")}`, color: h("--primary-fg") }}>
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
