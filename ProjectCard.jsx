import { useState } from "react";

export default function ProjectCard({ emoji, title, desc, tags, featured }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(100,220,150,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(100,220,150,0.3)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: 28,
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 40px rgba(100,220,150,0.1)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {featured && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: "linear-gradient(135deg,#64DC96,#00b894)",
          color: "#000", fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 20, letterSpacing: "0.1em",
        }}>
          FEATURED
        </div>
      )}
      <div style={{ fontSize: 40, marginBottom: 16 }}>{emoji}</div>
      <h3 style={{ color: "#e0e0e0", margin: "0 0 10px", fontSize: 18 }}>{title}</h3>
      <p style={{ color: "#777", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>{desc}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tags.map((t) => (
          <span key={t} style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11,
            background: "rgba(100,220,150,0.08)", color: "#64DC96",
            border: "1px solid rgba(100,220,150,0.2)", letterSpacing: "0.05em",
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
