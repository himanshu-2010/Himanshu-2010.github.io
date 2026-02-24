import { useState, useRef, useEffect } from "react";
import { SECRET_KEYWORD } from "./constants";

const SECTIONS = [
  { id: "hero",     label: "Home / Hero",  keywords: ["home","hero","hello","hi","himanshu","welcome"] },
  { id: "about",    label: "About Me",     keywords: ["about","bio","background","interest","hobby","basketball","nvidia","9th grade","student"] },
  { id: "projects", label: "Projects",     keywords: ["project","work","robot","arduino","farm","automation","iot","line follower","battle bot","portfolio"] },
  { id: "contact",  label: "Contact",      keywords: ["contact","email","reach","social","github","linkedin","twitter","message"] },
  { id: "games",    label: "Games",        keywords: ["game","snake","play","fun","arcade"] },
];

export default function SearchBar({ onSecretTrigger }) {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const inputRef              = useRef(null);

  // Ensure input is focused when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) { setResults([]); return; }
    const lower = val.toLowerCase();
    setResults(
      SECTIONS.filter((s) =>
        s.label.toLowerCase().includes(lower) ||
        s.keywords.some((k) => k.includes(lower) || lower.includes(k))
      )
    );
  };

  const navigateTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (query.trim() === SECRET_KEYWORD) {
        setQuery(""); setResults([]); setOpen(false);
        onSecretTrigger();
        return;
      }
      if (results.length > 0) navigateTo(results[0].id);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const isSecret = query.trim() === SECRET_KEYWORD;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 12px)", right: 0,
          width: 340, background: "#0f0f1a",
          border: "1px solid rgba(100,220,150,0.3)", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)", overflow: "hidden",
        }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search portfolio…"
            style={{
              width: "100%", padding: "14px 18px",
              border: "none", borderBottom: "1px solid rgba(100,220,150,0.15)",
              background: "transparent", color: "#e0e0e0",
              fontSize: 14, fontFamily: "'Space Mono', monospace",
              outline: "none", boxSizing: "border-box",
            }}
          />

          {/* Secret keyword hint */}
          {isSecret && (
            <div style={{ padding: "12px 18px", color: "#ff9f43", fontSize: 13 }}>
              🔑 Press Enter…
            </div>
          )}

          {/* Results */}
          {!isSecret && results.map((r) => (
            <div
              key={r.id}
              onClick={() => navigateTo(r.id)}
              style={{
                padding: "12px 18px", cursor: "pointer", fontSize: 14,
                color: "#aaa", borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", gap: 10,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(100,220,150,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ color: "#64DC96" }}>→</span> {r.label}
            </div>
          ))}

          {/* No results */}
          {!isSecret && query && results.length === 0 && (
            <div style={{ padding: "12px 18px", color: "#555", fontSize: 13 }}>
              No results found
            </div>
          )}

          <div style={{
            padding: "8px 18px", color: "#444", fontSize: 11,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            Enter to navigate · ESC to close
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 52, height: 52, borderRadius: "50%",
          border: "2px solid rgba(100,220,150,0.5)",
          background: open ? "rgba(100,220,150,0.15)" : "rgba(10,10,20,0.9)",
          color: "#64DC96", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(100,220,150,0.2)",
          transition: "all 0.2s", backdropFilter: "blur(8px)",
        }}
      >
        {open ? "✕" : "🔍"}
      </button>
    </div>
  );
}
