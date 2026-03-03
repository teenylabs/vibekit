const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

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
      text: "PSA: We're migrating the API from v2 to v3 this weekend. Key changes:\n\n• Rate limits increased from 100 to 500 req/min\n• New batch endpoints for bulk operations\n• WebSocket support for real-time updates\n\nFull migration guide: docs.acme.dev/v3-migration",
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
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${h("--border")}` }}>Filter</button>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: h("--primary"), color: h("--primary-fg") }}>New Post</button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {items.map(item => (
          <div key={item.id} className="rounded-xl p-5" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.4)}` }}>
            <div className="flex items-start gap-3 mb-3">
              {item.type === "milestone" ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: `linear-gradient(135deg, ${ha("--primary", 0.2)}, ${ha("--primary", 0.05)})` }}>🎉</div>
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

            <div className="flex items-center gap-4 pt-2" style={{ borderTop: `1px solid ${ha("--border", 0.3)}` }}>
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
              <div className="mt-4 pl-4 space-y-3" style={{ borderLeft: `2px solid ${ha("--border", 0.4)}` }}>
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
                    style={{ background: ha("--muted", 0.25), border: `1px solid ${ha("--border", 0.4)}` }} />
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
