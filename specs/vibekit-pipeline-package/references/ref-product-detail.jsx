const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("slate");
  const [qty, setQty] = useState(1);

  const images = [
    "https://picsum.photos/seed/jacket1/800/1000",
    "https://picsum.photos/seed/jacket2/800/1000",
    "https://picsum.photos/seed/jacket3/800/1000",
    "https://picsum.photos/seed/jacket4/800/1000",
  ];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { id: "slate", label: "Slate", hex: "hsl(215 15% 35%)" },
    { id: "olive", label: "Olive", hex: "hsl(90 20% 38%)" },
    { id: "clay", label: "Clay", hex: "hsl(18 40% 52%)" },
  ];
  const reviews = [
    { user: "Aisha M.", rating: 5, text: "Perfect weight for spring. Fits true to size and the slate color is exactly as shown.", date: "2 days ago" },
    { user: "Tom R.", rating: 4, text: "Great jacket. Slightly long in the arms for me but the quality is excellent.", date: "1 week ago" },
  ];

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: ha("--bg", 0.92), backdropFilter: "blur(12px)", borderBottom: `1px solid ${ha("--border", 0.3)}` }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight">Everline</span>
          <div className="flex items-center gap-5 text-sm">
            {["Shop", "Collections", "About"].map(item => (
              <a key={item} className="cursor-pointer" style={{ color: h("--muted-fg") }}>{item}</a>
            ))}
            <button className="relative" style={{ color: h("--fg") }}>
              Bag
              <span className="absolute -top-1.5 -right-3 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: h("--primary"), color: h("--primary-fg") }}>2</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: h("--muted-fg") }}>
          <span className="cursor-pointer" style={{ color: h("--primary") }}>Shop</span>
          <span>›</span>
          <span className="cursor-pointer" style={{ color: h("--primary") }}>Outerwear</span>
          <span>›</span>
          <span>Horizon Chore Jacket</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image gallery */}
          <div className="lg:w-3/5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3">
              <img src={images[selectedImage]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className="w-20 h-20 rounded-lg overflow-hidden transition-all"
                  style={{ border: `2px solid ${selectedImage === i ? h("--primary") : "transparent"}`, opacity: selectedImage === i ? 1 : 0.6 }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:w-2/5">
            <div className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3"
              style={{ background: "hsl(152 55% 40% / 0.1)", color: "hsl(152 55% 40%)" }}>New Arrival</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Horizon Chore Jacket</h1>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>$185</span>
              <span style={{ fontSize: 14, textDecoration: "line-through", color: h("--muted-fg") }}>$220</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: ha("--destructive", 0.1), color: h("--destructive") }}>-16%</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: ha("--fg", 0.7), marginBottom: 24 }}>
              A modern take on the classic chore jacket. Garment-dyed organic cotton canvas with a relaxed fit, three patch pockets, and antique brass hardware. Built to age beautifully.
            </p>

            {/* Color */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color — <span style={{ fontWeight: 400, color: h("--muted-fg") }}>{colors.find(c => c.id === selectedColor)?.label}</span></p>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c.id} onClick={() => setSelectedColor(c.id)}
                    className="w-9 h-9 rounded-full transition-all"
                    style={{ background: c.hex, border: `2.5px solid ${selectedColor === c.id ? h("--primary") : "transparent"}`, outline: selectedColor === c.id ? `2px solid ${ha("--primary", 0.3)}` : "none", outlineOffset: 2 }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 24 }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: 13, fontWeight: 600 }}>Size</p>
                <button style={{ fontSize: 12, color: h("--primary"), fontWeight: 500 }}>Size guide</button>
              </div>
              <div className="flex gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className="w-11 h-11 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selectedSize === s ? h("--primary") : "transparent",
                      color: selectedSize === s ? h("--primary-fg") : h("--fg"),
                      border: `1.5px solid ${selectedSize === s ? h("--primary") : ha("--border", 0.5)}`,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center rounded-lg" style={{ border: `1px solid ${ha("--border", 0.5)}` }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 text-sm" style={{ color: h("--muted-fg") }}>−</button>
                <span className="w-8 text-center text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-11 text-sm" style={{ color: h("--muted-fg") }}>+</button>
              </div>
              <button className="flex-1 rounded-lg text-sm font-semibold transition-all"
                style={{ background: h("--primary"), color: h("--primary-fg"), minHeight: 44 }}>
                Add to Bag — ${(185 * qty).toLocaleString()}
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3" style={{ borderTop: `1px solid ${ha("--border", 0.3)}`, paddingTop: 20 }}>
              {["100% organic cotton canvas", "Garment-dyed for lived-in feel", "Relaxed fit — size down for a closer cut", "Machine wash cold, tumble dry low"].map(d => (
                <div key={d} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: h("--primary") }} />
                  <span style={{ fontSize: 13, color: ha("--fg", 0.7) }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Reviews summary */}
            <div style={{ borderTop: `1px solid ${ha("--border", 0.3)}`, marginTop: 24, paddingTop: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Reviews</h3>
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "hsl(45 90% 50%)", fontSize: 13 }}>★★★★★</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>4.8</span>
                  <span style={{ fontSize: 12, color: h("--muted-fg") }}>(127)</span>
                </div>
              </div>
              {reviews.map((r, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{r.user}</span>
                    <span style={{ fontSize: 11, color: h("--muted-fg") }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: ha("--fg", 0.75) }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
