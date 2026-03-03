const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

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
            <div className="rounded-2xl text-center" style={{ padding: "60px 24px", background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
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
            <div className="rounded-2xl text-center" style={{ padding: "48px 24px", background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
              <div className="text-3xl mb-4">🔍</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>No results for "quantum flux"</h3>
              <p style={{ fontSize: 13, color: h("--muted-fg"), maxWidth: 280, margin: "0 auto 16px" }}>
                Try a different search term or remove some filters.
              </p>
              <button className="text-sm font-medium" style={{ color: h("--primary") }}>Clear filters</button>
            </div>

            {/* Empty state: no notifications */}
            <div className="rounded-xl flex items-center gap-4" style={{ padding: 20, background: ha("--muted", 0.15), border: `1px solid ${ha("--border", 0.3)}` }}>
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
                  <div key={i} className="rounded-xl overflow-hidden" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
                    <div style={{ aspectRatio: "3/2", background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite", animationDelay: `${i * 200}ms` }} />
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
            <div className="rounded-xl" style={{ background: h("--card"), border: `1px solid ${ha("--border", 0.5)}` }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3" style={{ padding: "14px 16px", borderBottom: i < 4 ? `1px solid ${ha("--border", 0.2)}` : "none" }}>
                  <div className="w-10 h-10 rounded-full" style={{ background: ha("--muted", 0.3), animation: "vk-shimmer 1.5s ease-in-out infinite", animationDelay: `${i * 150}ms` }} />
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
            <div className="rounded-2xl text-center" style={{ padding: "60px 24px", background: h("--card"), border: `1px solid ${ha("--destructive", 0.2)}` }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl"
                style={{ background: ha("--destructive", 0.08) }}>⚠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: h("--destructive") }}>Something went wrong</h3>
              <p style={{ fontSize: 14, color: h("--muted-fg"), maxWidth: 360, margin: "0 auto 20px" }}>
                We couldn't load your data. This is usually temporary — try refreshing the page.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="rounded-lg px-5 py-2.5 text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Retry</button>
                <button className="rounded-lg px-5 py-2.5 text-sm font-medium" style={{ border: `1px solid ${h("--border")}` }}>Contact Support</button>
              </div>
            </div>

            {/* Inline error */}
            <div className="rounded-xl flex items-start gap-3" style={{ padding: 16, background: ha("--destructive", 0.05), border: `1px solid ${ha("--destructive", 0.2)}` }}>
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
            <div className="rounded-2xl text-center" style={{ padding: "60px 24px", background: h("--card"), border: `1px solid hsl(152 55% 40% / 0.2)` }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                style={{ background: "hsl(152 55% 40% / 0.08)" }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Project created!</h3>
              <p style={{ fontSize: 14, color: h("--muted-fg"), maxWidth: 320, margin: "0 auto 20px" }}>
                Your project "Q2 Launch" is ready. Invite your team to start collaborating.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="rounded-lg px-5 py-2.5 text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Invite Team</button>
                <button className="rounded-lg px-5 py-2.5 text-sm font-medium" style={{ border: `1px solid ${h("--border")}` }}>Go to Project</button>
              </div>
            </div>

            {/* Inline success toast */}
            <div className="rounded-xl flex items-center gap-3" style={{ padding: 16, background: "hsl(152 55% 40% / 0.05)", border: `1px solid hsl(152 55% 40% / 0.2)` }}>
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

      <style>{`
        @keyframes vk-shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
