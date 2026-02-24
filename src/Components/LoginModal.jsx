import { useState } from "react";
import { USERS } from "./constants";

export default function LoginModal({ onSuccess, onClose }) {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    const user = USERS.find(
      (u) => u.username === uname && u.password === pass
    );
    if (user) {
      onSuccess();
    } else {
      setError("Invalid credentials");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, backdropFilter: "blur(8px)",
    }}>
      <div style={{
        background: "#0f0f1a",
        border: "1px solid rgba(100,220,150,0.3)",
        borderRadius: 20, padding: 40,
        width: "min(400px, 90vw)",
        boxShadow: "0 0 60px rgba(100,220,150,0.1)",
        animation: shake ? "shake 0.4s ease" : "fadeIn 0.3s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
          <h2 style={{ margin: 0, color: "#64DC96", fontFamily: "'Space Mono', monospace" }}>
            Restricted Access
          </h2>
          <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>
            This area requires authentication
          </p>
        </div>

        <input
          placeholder="Username"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10,
            marginBottom: 12,
            border: "1px solid rgba(100,220,150,0.3)",
            background: "rgba(100,220,150,0.05)",
            color: "#e0e0e0", fontSize: 14,
            fontFamily: "'Space Mono', monospace",
            outline: "none", boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10,
            marginBottom: 20,
            border: "1px solid rgba(100,220,150,0.3)",
            background: "rgba(100,220,150,0.05)",
            color: "#e0e0e0", fontSize: 14,
            fontFamily: "'Space Mono', monospace",
            outline: "none", boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{
            color: "#ff6b6b", fontSize: 13,
            textAlign: "center", marginBottom: 16,
          }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "#666",
            cursor: "pointer", fontFamily: "inherit", fontSize: 14,
          }}>
            Cancel
          </button>
          <button onClick={handleLogin} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg,#64DC96,#00b894)",
            color: "#000", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", fontSize: 14,
          }}>
            Enter
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-8px); }
          75%      { transform: translateX(8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
