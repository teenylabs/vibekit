const h = (v) => `hsl(var(${v}))`;
const ha = (v, a) => `hsl(var(${v}) / ${a})`;

export default function RefBrowseDrill() {
  const [selected, setSelected] = useState(null);
  const items = [
    { id: 1, title: "Crispy Sesame Tofu Bowl", sub: "30 min · Vegetarian", img: "https://picsum.photos/seed/tofu/600/400", stat: "4,201 made this", detail: "A perfectly balanced bowl with crispy baked tofu, pickled vegetables, and a sesame-ginger dressing that brings everything together." },
    { id: 2, title: "One-Pan Lemon Herb Salmon", sub: "25 min · Gluten-free", img: "https://picsum.photos/seed/salmon/600/400", stat: "3,847 made this", detail: "Tender salmon fillets roasted alongside asparagus and cherry tomatoes with a bright lemon-herb butter sauce." },
    { id: 3, title: "Spicy Black Bean Tacos", sub: "15 min · Vegan", img: "https://picsum.photos/seed/tacos/600/400", stat: "6,122 made this", detail: "Smoky spiced black beans piled into charred corn tortillas with quick-pickled onions, avocado crema, and fresh cilantro." },
    { id: 4, title: "Thai Basil Chicken Stir-Fry", sub: "20 min · Dairy-free", img: "https://picsum.photos/seed/stirfry/600/400", stat: "5,503 made this", detail: "Ground chicken wok-fired with Thai basil, chili, garlic, and a savory-sweet sauce. Served over jasmine rice." },
    { id: 5, title: "Mushroom Risotto", sub: "40 min · Vegetarian", img: "https://picsum.photos/seed/risotto/600/400", stat: "2,919 made this", detail: "Creamy arborio rice slowly stirred with mixed wild mushrooms, parmesan, and a splash of white wine." },
    { id: 6, title: "Grilled Peach & Burrata Salad", sub: "10 min · Seasonal", img: "https://picsum.photos/seed/peach/600/400", stat: "1,703 made this", detail: "Caramelized grilled peaches paired with creamy burrata, arugula, toasted pistachios, and a honey-balsamic drizzle." },
  ];
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Quick", "Vegetarian", "Seasonal"];

  if (selected) {
    const item = items.find(i => i.id === selected);
    return (
      <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
        <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ background: ha("--bg", 0.9), borderBottom: `1px solid ${ha("--border", 0.4)}` }}>
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight">ForkYeah</span>
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Submit Recipe</button>
          </div>
        </nav>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <button onClick={() => setSelected(null)} className="text-sm font-medium mb-6 flex items-center gap-1" style={{ color: h("--muted-fg") }}>← Back to recipes</button>
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
            <img src={item.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2 text-xs mb-2" style={{ color: h("--muted-fg") }}><span>{item.sub}</span></div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">{item.title}</h1>
          <p className="text-sm mb-4" style={{ color: ha("--primary", 0.8) }}>{item.stat}</p>
          <div className="text-[15px] leading-relaxed space-y-4" style={{ color: ha("--fg", 0.85) }}>
            <p>{item.detail}</p>
            <h2 className="text-lg font-semibold pt-2" style={{ color: h("--fg") }}>Ingredients</h2>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: h("--primary") }} />2 blocks firm tofu, pressed and cubed</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: h("--primary") }} />3 tbsp sesame oil</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: h("--primary") }} />1 cup jasmine rice</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: h("--bg"), color: h("--fg"), minHeight: "100vh" }}>
      <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ background: ha("--bg", 0.9), borderBottom: `1px solid ${ha("--border", 0.4)}` }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">ForkYeah</span>
          <div className="flex items-center gap-5 text-sm">
            <a className="font-medium">Recipes</a>
            <a style={{ color: h("--muted-fg") }}>Collections</a>
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: h("--primary"), color: h("--primary-fg") }}>Submit Recipe</button>
          </div>
        </div>
      </nav>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-3">Dinner, decided.</h1>
        <p className="text-base" style={{ color: h("--muted-fg") }}>Recipes tested by 50,000 home cooks. No fluff.</p>
      </section>
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex gap-2 mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ background: filter === f ? h("--primary") : ha("--muted", 0.4), color: filter === f ? h("--primary-fg") : h("--fg") }}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map(item => (
            <div key={item.id} onClick={() => setSelected(item.id)} className="group cursor-pointer">
              <div className="aspect-[3/2] rounded-2xl overflow-hidden mb-3">
                <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-xs" style={{ color: h("--muted-fg") }}>{item.sub}</p>
              <p className="text-xs mt-1" style={{ color: ha("--primary", 0.8) }}>{item.stat}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
