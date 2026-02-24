import { useState, useEffect, useRef } from "react";
import { APIS, ROBOHASH_SETS, CAT_BREEDS } from "./constants";

// ─── shared style tokens ──────────────────────────────────────
const C = {
  bg:      "#0a0a12",
  surface: "rgba(255,255,255,0.04)",
  border:  "rgba(255,255,255,0.08)",
  accent:  "#ff9f43",
  red:     "#ff6b6b",
  teal:    "#4ecdc4",
  purple:  "#a29bfe",
  text:    "#e0e0e0",
  muted:   "#666",
  input: {
    background: "#12121e",
    border: "1px solid rgba(255,159,67,0.3)",
    color: "#e0e0e0",
    borderRadius: 8,
    padding: "10px 14px",
    fontFamily: "inherit",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
  },
  label: {
    display: "block", color: "#ff9f43",
    fontSize: 11, marginBottom: 8, letterSpacing: "0.12em", fontWeight: 700,
  },
};

// ─── tiny helpers ─────────────────────────────────────────────
const Label = ({ children }) => <div style={C.label}>{children}</div>;
const Row   = ({ children, gap = 20 }) => (
  <div style={{ display: "flex", gap, flexWrap: "wrap", alignItems: "flex-end" }}>{children}</div>
);
const Panel = ({ children, style = {} }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 16, marginBottom: 12, ...style,
  }}>{children}</div>
);
const Btn = ({ active, color = C.accent, onClick, children, style = {} }) => (
  <button onClick={onClick} style={{
    padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
    fontSize: 11, fontFamily: "inherit", transition: "all 0.15s",
    background: active ? color : "rgba(255,255,255,0.06)",
    color: active ? "#000" : "#888", fontWeight: active ? 700 : 400, ...style,
  }}>{children}</button>
);
const Tag = ({ label, state, onInclude, onExclude }) => (
  <div style={{
    borderRadius: 8, minWidth: 88,
    border: state === "include" ? `2px solid ${C.accent}`
          : state === "exclude" ? `2px solid ${C.red}`
          : `2px solid ${C.border}`,
    background: state === "include" ? "rgba(255,159,67,0.12)"
              : state === "exclude" ? "rgba(255,107,107,0.12)"
              : "rgba(255,255,255,0.02)",
    padding: "4px 2px",
  }}>
    <div style={{
      textAlign: "center", fontSize: 12, padding: "2px 8px 4px",
      color: state === "include" ? C.accent : state === "exclude" ? C.red : "#aaa",
      fontWeight: state ? 700 : 400,
    }}>{label}</div>
    <div style={{ display: "flex", gap: 2, padding: "0 4px" }}>
      <button onClick={onInclude} title="Include" style={{
        flex: 1, padding: "3px 0", borderRadius: 5, border: "none", cursor: "pointer",
        fontSize: 10, fontFamily: "inherit",
        background: state === "include" ? C.accent : "rgba(255,159,67,0.1)",
        color: state === "include" ? "#000" : C.accent,
      }}>✓</button>
      <button onClick={onExclude} title="Exclude" style={{
        flex: 1, padding: "3px 0", borderRadius: 5, border: "none", cursor: "pointer",
        fontSize: 10, fontFamily: "inherit",
        background: state === "exclude" ? C.red : "rgba(255,107,107,0.1)",
        color: state === "exclude" ? "#000" : C.red,
      }}>✕</button>
    </div>
  </div>
);

// ═════════════════════════════════════════════════════════════════
//  WAIFU.IM — tag section row (defined OUTSIDE to avoid React warning)
// ═════════════════════════════════════════════════════════════════
function WaifuTagSection({ tags, label, color, getState, onToggle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map(t => (
          <Tag key={t.slug}
            label={`${t.label} (${t.imageCount.toLocaleString()})`}
            state={getState(t.slug)}
            onInclude={() => onToggle(t.slug, "include")}
            onExclude={() => onToggle(t.slug, "exclude")}
          />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  WAIFU.IM — include/exclude tag picker + isNsfw toggle
// ═════════════════════════════════════════════════════════════════
function WaifuImPanel({ tagMeta, opts, onChange }) {
  const getState = (slug) =>
    opts.includedTags.includes(slug) ? "include"
    : opts.excludedTags.includes(slug) ? "exclude"
    : null;

  const handleToggle = (slug, action) => {
    const wasAction = getState(slug) === action;
    onChange({
      includedTags: wasAction && action === "include" ? opts.includedTags.filter(t => t !== slug)
                  : action === "include" ? [...opts.includedTags.filter(t => t !== slug), slug]
                  : opts.includedTags.filter(t => t !== slug),
      excludedTags: wasAction && action === "exclude" ? opts.excludedTags.filter(t => t !== slug)
                  : action === "exclude" ? [...opts.excludedTags.filter(t => t !== slug), slug]
                  : opts.excludedTags.filter(t => t !== slug),
    });
  };

  return (
    <Panel>
      <Row style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", flex: 1 }}>
          WAIFU.IM TAG PICKER
        </span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.muted }}>Content:</span>
          {[["False","SFW",C.teal],["True","NSFW",C.red],["All","All",C.purple]].map(([val,lbl,col]) => (
            <Btn key={val} active={opts.isNsfw === val} color={col} onClick={() => onChange({ isNsfw: val })}>{lbl}</Btn>
          ))}
          <Btn onClick={() => onChange({ includedTags: [], excludedTags: [] })}>Clear all</Btn>
        </div>
      </Row>
      <WaifuTagSection tags={tagMeta.sfw}  label="✅ SFW TAGS"  color={C.teal} getState={getState} onToggle={handleToggle} />
      <WaifuTagSection tags={tagMeta.nsfw} label="🔞 NSFW TAGS" color={C.red}  getState={getState} onToggle={handleToggle} />
      {(opts.includedTags.length > 0 || opts.excludedTags.length > 0) && (
        <div style={{ fontSize: 11, marginTop: 4, color: C.muted }}>
          {opts.includedTags.length > 0 && <span style={{ color: C.accent }}>✓ {opts.includedTags.join(", ")} </span>}
          {opts.excludedTags.length > 0 && <span style={{ color: C.red   }}>✕ {opts.excludedTags.join(", ")}</span>}
        </div>
      )}
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════
//  NEKOSIA — category select + additionalTags + blacklistedTags + rating
// ═════════════════════════════════════════════════════════════════
function NekosiaPanel({ api, opts, onChange }) {
  return (
    <Panel>
      <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        NEKOSIA — FILTERS
      </div>
      <Row>
        <div style={{ minWidth: 180 }}>
          <Label>CATEGORY</Label>
          <select value={opts.category} onChange={e => onChange({ category: e.target.value })}
            style={{ ...C.input, cursor: "pointer" }}>
            {api.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label>RATING</Label>
          <div style={{ display: "flex", gap: 6 }}>
            {[["safe","Safe ✅",C.teal],["suggestive","Suggestive 🟡","#ffd32a"]].map(([val,lbl,col]) => (
              <Btn key={val} active={opts.rating === val} color={col} onClick={() => onChange({ rating: val })}
                style={{ padding: "6px 14px", fontSize: 12 }}>{lbl}</Btn>
            ))}
          </div>
        </div>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Label>ADDITIONAL TAGS (comma-separated)</Label>
          <input
            value={(opts.additionalTags || []).join(", ")}
            onChange={e => onChange({ additionalTags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="e.g. ribbon, long-hair, blue-eyes"
            style={C.input}
          />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Label>BLACKLISTED TAGS (comma-separated)</Label>
          <input
            value={(opts.blacklistedTags || []).join(", ")}
            onChange={e => onChange({ blacklistedTags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="e.g. short-hair, sad"
            style={{ ...C.input, borderColor: "rgba(255,107,107,0.3)" }}
          />
        </div>
      </Row>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
        Category: <span style={{ color: C.accent }}>{opts.category}</span>
        {opts.additionalTags?.length > 0  && <> · <span style={{ color: C.teal }}>+{opts.additionalTags.join(", ")}</span></>}
        {opts.blacklistedTags?.length > 0 && <> · <span style={{ color: C.red  }}>−{opts.blacklistedTags.join(", ")}</span></>}
        <span style={{ marginLeft: 12, color: "#444" }}>Max 48 per fetch</span>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════
//  THE CAT API — breed picker + GIF toggle
// ═════════════════════════════════════════════════════════════════
function TheCatPanel({ opts, onChange }) {
  return (
    <Panel>
      <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        THE CAT API — FILTERS
      </div>
      <Row>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Label>BREED</Label>
          <select value={opts.breed || "Any"} onChange={e => onChange({ breed: e.target.value })}
            style={{ ...C.input, cursor: "pointer" }}>
            {Object.keys(CAT_BREEDS).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <Label>FORMAT</Label>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn active={!opts.gif} color={C.teal} onClick={() => onChange({ gif: false })}
              style={{ padding: "6px 14px", fontSize: 12 }}>📷 Photo</Btn>
            <Btn active={!!opts.gif} color={C.accent} onClick={() => onChange({ gif: true })}
              style={{ padding: "6px 14px", fontSize: 12 }}>🎞️ GIF</Btn>
          </div>
        </div>
      </Row>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
        Breed: <span style={{ color: C.accent }}>{opts.breed || "Any"}</span>
        · Format: <span style={{ color: C.accent }}>{opts.gif ? "GIF" : "Photo"}</span>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════
//  ROBOHASH — set picker + custom seed input
// ═════════════════════════════════════════════════════════════════
function RoboHashPanel({ opts, onChange }) {
  return (
    <Panel>
      <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        ROBOHASH — STYLE & SEED
      </div>
      <Row>
        <div>
          <Label>AVATAR STYLE</Label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.keys(ROBOHASH_SETS).map(s => (
              <Btn key={s} active={opts.setName === s} color={C.accent} onClick={() => onChange({ setName: s })}
                style={{ padding: "6px 14px", fontSize: 12 }}>
                {s === "Robots" ? "🤖" : s === "Monsters" ? "👾" : s === "Robot Heads" ? "🦾" : s === "Cats" ? "🐱" : "🧑"} {s}
              </Btn>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <Label>SEED TEXT (optional — blank = random each time)</Label>
          <input
            value={opts.seed || ""}
            onChange={e => onChange({ seed: e.target.value })}
            placeholder="e.g. himanshu, user123, myapp"
            style={C.input}
          />
        </div>
      </Row>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
        Style: <span style={{ color: C.accent }}>{opts.setName}</span>
        · Seed: <span style={{ color: C.accent }}>{opts.seed || "(random)"}</span>
        <span style={{ marginLeft: 12, color: "#444" }}>Same seed always = same image</span>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════
//  LOREM PICSUM — mode picker (grayscale / blur / webp)
// ═════════════════════════════════════════════════════════════════
function PicsumPanel({ opts, onChange }) {
  const MODES = [
    ["random",         "🎲 Random"],
    ["grayscale",      "⚫ Grayscale"],
    ["blur-light",     "🌫️ Blur (light)"],
    ["blur-heavy",     "🌫️ Blur (heavy)"],
    ["grayscale+blur", "⚫🌫️ Grayscale+Blur"],
    ["webp",           "📦 WebP"],
  ];
  return (
    <Panel>
      <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        LOREM PICSUM — IMAGE MODE
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MODES.map(([val, lbl]) => (
          <Btn key={val} active={opts.category === val} color={C.accent}
            onClick={() => onChange({ category: val })}
            style={{ padding: "8px 16px", fontSize: 12 }}>{lbl}</Btn>
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
        Mode: <span style={{ color: C.accent }}>{opts.category}</span>
        <span style={{ marginLeft: 12, color: "#444" }}>HD 700×480 · uses /v2/list for true random</span>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MET MUSEUM — department picker
// ═════════════════════════════════════════════════════════════════
function MetPanel({ api, opts, onChange }) {
  const DEPT_ICONS = {
    any:"🏛️", paintings:"🖼️", photographs:"📸", sculpture:"🗿", ceramics:"🏺",
    "arms-and-armor":"⚔️", "japanese-art":"🎎", "greek-roman":"🏛️",
    egyptian:"𓂀", medieval:"🛡️", american:"🦅", islamic:"☪️",
    african:"🌍", drawings:"✏️",
  };
  return (
    <Panel>
      <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        THE MET MUSEUM — DEPARTMENT
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {api.categories.map(cat => (
          <Btn key={cat} active={opts.category === cat} color={C.accent}
            onClick={() => onChange({ category: cat })}
            style={{ padding: "8px 14px", fontSize: 12 }}>
            {DEPT_ICONS[cat] || "🏛️"} {cat}
          </Btn>
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
        Department: <span style={{ color: C.accent }}>{opts.category}</span>
        <span style={{ marginLeft: 12, color: "#444" }}>500k+ public domain works · parallel fetch</span>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN GALLERY
// ═════════════════════════════════════════════════════════════════
export default function SecretGallery({ onExit }) {
  const [selectedApi, setSelectedApi] = useState(APIS[0]);
  const [selectedCategory, setSelectedCategory] = useState(APIS[0].categories[0]);
  const [count,   setCount]   = useState(6);
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [lightbox,setLightbox]= useState(null);

  // ── per-API advanced option states ───────────────────────────
  const [waifuImOpts, setWaifuImOpts] = useState({ includedTags: ["waifu"], excludedTags: [], isNsfw: "False" });
  const [nekosiaOpts, setNekosiaOpts] = useState({ category: "catgirl", additionalTags: [], blacklistedTags: [], rating: "safe" });
  const [catApiOpts,  setCatApiOpts]  = useState({ breed: "Any", gif: false });
  const [roboOpts,    setRoboOpts]    = useState({ setName: "Robots", seed: "" });
  const [picsumOpts,  setPicsumOpts]  = useState({ category: "random" });
  const [metOpts,     setMetOpts]     = useState({ category: "any" });

  const lastExitTimeRef = useRef(null);

  useEffect(() => {
    const onKey = e => { if (e.key === "F1") { e.preventDefault(); lastExitTimeRef.current = Date.now(); onExit(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  useEffect(() => { window.__secretLastExit = lastExitTimeRef; }, []);

  // ── resolve what to pass to fetchFn ──────────────────────────
  const resolveArg = () => {
    const id = selectedApi.id;
    if (id === "waifu-im")     return waifuImOpts;
    if (id === "nekosia")      return nekosiaOpts;
    if (id === "thecatapi")    return catApiOpts;
    if (id === "robohash")     return roboOpts;
    if (id === "picsum")       return picsumOpts;
    if (id === "met-museum")   return metOpts;
    return selectedCategory;
  };

  const fetchImages = async () => {
    setLoading(true); setError(""); setImages([]);
    try {
      const urls = await selectedApi.fetchFn(resolveArg(), Math.min(count, 20));
      setImages(urls.filter(Boolean));
    } catch (e) {
      setError(e.message || "Failed to fetch. Try another API or category.");
    }
    setLoading(false);
  };

  const handleApiChange = (api) => {
    setSelectedApi(api);
    setSelectedCategory(api.categories[0]);
    // Reset advanced opts to defaults for relevant APIs
    if (api.id === "nekosia")    setNekosiaOpts(p => ({ ...p, category: api.categories[0] }));
    setImages([]); setError("");
  };

  // ── which advanced panel to show ─────────────────────────────
  const renderAdvancedPanel = () => {
    const id = selectedApi.id;
    if (id === "waifu-im")    return <WaifuImPanel tagMeta={selectedApi.waifuImTags} opts={waifuImOpts} onChange={p => setWaifuImOpts(prev => ({ ...prev, ...p }))} />;
    if (id === "nekosia")     return <NekosiaPanel api={selectedApi} opts={nekosiaOpts} onChange={p => setNekosiaOpts(prev => ({ ...prev, ...p }))} />;
    if (id === "thecatapi")   return <TheCatPanel opts={catApiOpts} onChange={p => setCatApiOpts(prev => ({ ...prev, ...p }))} />;
    if (id === "robohash")    return <RoboHashPanel opts={roboOpts} onChange={p => setRoboOpts(prev => ({ ...prev, ...p }))} />;
    if (id === "picsum")      return <PicsumPanel opts={picsumOpts} onChange={p => setPicsumOpts(prev => ({ ...prev, ...p }))} />;
    if (id === "met-museum")  return <MetPanel api={selectedApi} opts={metOpts} onChange={p => setMetOpts(prev => ({ ...prev, ...p }))} />;
    return null;
  };

  const hasAdvancedPanel = ["waifu-im","nekosia","thecatapi","robohash","picsum","met-museum"].includes(selectedApi.id);
  const showCategorySelect = !hasAdvancedPanel;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Space Mono', monospace", color: C.text }}>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: "18px 24px",
        background: "rgba(10,10,18,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto" }}>
          <div onClick={() => { lastExitTimeRef.current = Date.now(); onExit(); }}
            style={{ fontWeight: 700, fontSize: 18, color: C.accent, letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ffd32a"; e.currentTarget.style.textShadow = "0 0 10px rgba(255,157,67,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.accent;  e.currentTarget.style.textShadow = "none"; }}>
            🔓 Exit Gallery
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>Press F1 to exit · or click logo</div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 40px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
          <h1 style={{
            fontSize: "clamp(24px,4vw,48px)", fontWeight: 700, margin: 0,
            background: "linear-gradient(135deg,#ff6b6b,#ff9f43,#ffd32a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Secret Media Gallery</h1>
          <p style={{ color: C.muted, marginTop: 8, fontSize: 13 }}>
            {APIS.length} APIs · Press F1 to exit instantly
          </p>
        </div>

        {/* API tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
          {APIS.map(api => (
            <button key={api.id} onClick={() => handleApiChange(api)} style={{
              padding: "9px 16px", borderRadius: 10, cursor: "pointer",
              fontFamily: "inherit", fontSize: 12, transition: "all 0.2s",
              border: selectedApi.id === api.id ? `2px solid ${C.accent}` : `2px solid ${C.border}`,
              background: selectedApi.id === api.id ? "rgba(255,159,67,0.15)" : C.surface,
              color: selectedApi.id === api.id ? C.accent : C.muted,
            }}>
              {api.icon} {api.name}
            </button>
          ))}
        </div>

        {/* Advanced panel (API-specific) */}
        {renderAdvancedPanel()}

        {/* Main controls bar */}
        <Panel>
          <Row>
            {/* Category select — only when no advanced panel */}
            {showCategorySelect && (
              <div style={{ flex: 1, minWidth: 200 }}>
                <Label>CATEGORY</Label>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                  style={{ ...C.input, cursor: "pointer" }}>
                  {selectedApi.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {/* Count */}
            <div style={{ minWidth: 140 }}>
              <Label>COUNT (1–20)</Label>
              <input type="number" min={1} max={20} value={count}
                onChange={e => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
                style={C.input}
              />
            </div>

            {/* Fetch button */}
            <button onClick={fetchImages} disabled={loading} style={{
              padding: "11px 36px", borderRadius: 8, border: "none",
              background: loading ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff9f43)",
              color: loading ? C.muted : "#fff", fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}>
              {loading ? "Loading…" : "Fetch Images"}
            </button>
          </Row>
        </Panel>

        {/* API description */}
        <p style={{ textAlign: "center", color: "#444", marginBottom: 24, fontSize: 12 }}>
          {selectedApi.icon} {selectedApi.description}
        </p>

        {/* Error */}
        {error && <p style={{ textAlign: "center", color: C.red, marginBottom: 24 }}>{error}</p>}

        {/* Spinner */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{
              width: 48, height: 48, margin: "0 auto 16px",
              border: "3px solid rgba(255,159,67,0.2)",
              borderTop: `3px solid ${C.accent}`, borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: C.muted }}>Fetching images…</p>
          </div>
        )}

        {/* Image grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {images.map((url, i) => (
            <div key={i} onClick={() => setLightbox(url)} style={{
              borderRadius: 12, overflow: "hidden", cursor: "pointer",
              border: `1px solid ${C.border}`,
              aspectRatio: "4/3", position: "relative",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,159,67,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "none"; }}
            >
              <img src={url} alt={`img-${i}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
                display: "flex", alignItems: "flex-end", padding: 12,
              }}>
                <span style={{ color: "#fff", fontSize: 11, opacity: 0.6 }}>🔍 Click to expand</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {images.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#2a2a3a" }}>
            <div style={{ fontSize: 64 }}>{selectedApi.icon}</div>
            <p style={{ marginTop: 12, color: "#333" }}>
              {hasAdvancedPanel
                ? "Configure options above, then click Fetch Images"
                : "Select a category and click Fetch Images"}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out", padding: 24,
        }}>
          <img src={lightbox} alt="lightbox"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12, objectFit: "contain" }} />
          <button onClick={() => setLightbox(null)} style={{
            position: "fixed", top: 24, right: 24,
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "#fff", width: 40, height: 40, borderRadius: "50%",
            fontSize: 18, cursor: "pointer",
          }}>✕</button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}