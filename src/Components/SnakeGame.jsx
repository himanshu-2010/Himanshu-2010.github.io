import { useState, useEffect, useRef, useCallback } from "react";

const CELL = 20, COLS = 20, ROWS = 15;

const INITIAL_STATE = () => ({
  snake:   [{ x: 10, y: 7 }],
  dir:     { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food:    { x: 15, y: 7 },
  score:   0,
  alive:   true,
});

export default function SnakeGame() {
  const canvasRef               = useRef(null);
  const stateRef                = useRef(INITIAL_STATE());
  const [score, setScore]       = useState(0);
  const [best, setBest]         = useState(() => {
    // Load best score from localStorage on initialization
    const saved = localStorage.getItem("snakeGameBestScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted]   = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Save best score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("snakeGameBestScore", best.toString());
  }, [best]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Helper function to change direction
  const changeDirection = useCallback((newDir) => {
    if (started && !gameOver) {
      const st = stateRef.current;
      if (!(newDir.x === -st.dir.x && newDir.y === -st.dir.y)) {
        st.nextDir = newDir;
      }
    }
  }, [started, gameOver]);

  // Called from button clicks only — never from an effect body
  const initGame = useCallback(() => {
    stateRef.current = INITIAL_STATE();
    setScore(0);
    setGameOver(false);
  }, []);

  // Key listener — only active when game is running
  useEffect(() => {
    if (!started || gameOver) return; // Stop listening when game ends

    const MAP = {
      ArrowUp:    { x: 0,  y: -1 },
      ArrowDown:  { x: 0,  y:  1 },
      ArrowLeft:  { x: -1, y:  0 },
      ArrowRight: { x: 1,  y:  0 },
      w: { x: 0,  y: -1 },
      s: { x: 0,  y:  1 },
      a: { x: -1, y:  0 },
      d: { x: 1,  y:  0 },
    };
    const onKey = (e) => {
      const st = stateRef.current;
      if (!st.alive) return;
      const d = MAP[e.key];
      if (d && !(d.x === -st.dir.x && d.y === -st.dir.y)) {
        st.nextDir = d;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, gameOver]);

  // Game loop — all setState calls are inside the setInterval callback, not the effect body
  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const interval = setInterval(() => {
      const st = stateRef.current;
      if (!st.alive) return;

      st.dir = st.nextDir;
      const head = { x: st.snake[0].x + st.dir.x, y: st.snake[0].y + st.dir.y };

      if (
        head.x < 0 || head.x >= COLS ||
        head.y < 0 || head.y >= ROWS ||
        st.snake.some((seg) => seg.x === head.x && seg.y === head.y)
      ) {
        st.alive = false;
        setGameOver(true);
        return;
      }

      st.snake.unshift(head);

      if (head.x === st.food.x && head.y === st.food.y) {
        st.score++;
        setScore(st.score);
        setBest((b) => Math.max(b, st.score));
        let fx, fy;
        do {
          fx = Math.floor(Math.random() * COLS);
          fy = Math.floor(Math.random() * ROWS);
        } while (st.snake.some((seg) => seg.x === fx && seg.y === fy));
        st.food = { x: fx, y: fy };
      } else {
        st.snake.pop();
      }

      // Draw
      ctx.fillStyle = "#080810";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

      ctx.fillStyle = "rgba(255,255,255,0.03)";
      for (let x = 0; x < COLS; x++)
        for (let y = 0; y < ROWS; y++)
          ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

      ctx.shadowColor = "#ff6b6b";
      ctx.shadowBlur  = 14;
      ctx.fillStyle   = "#ff6b6b";
      ctx.beginPath();
      ctx.arc(st.food.x * CELL + CELL / 2, st.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      st.snake.forEach((seg, i) => {
        const ratio = 1 - i / st.snake.length;
        ctx.shadowColor = i === 0 ? "#64DC96" : "transparent";
        ctx.shadowBlur  = i === 0 ? 10 : 0;
        ctx.fillStyle   = `rgba(${Math.round(40 + 60 * ratio)},${Math.round(180 + 40 * ratio)},${Math.round(100 + 50 * ratio)},${0.55 + 0.45 * ratio})`;
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, i === 0 ? 5 : 3);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }, 120);

    return () => clearInterval(interval);
  }, [started]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 16 }}>
        {[
          { label: "SCORE", value: score, color: "#64DC96" },
          { label: "BEST",  value: best,  color: "#ff9f43" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Space Mono', monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          style={{ borderRadius: 12, border: "1px solid rgba(100,220,150,0.15)", display: "block" }}
        />

        {(!started || gameOver) && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(8,8,16,0.88)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", borderRadius: 12,
          }}>
            {gameOver && (
              <div style={{ color: "#ff6b6b", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                Game Over!
              </div>
            )}
            <div style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
              Use Arrow Keys or WASD to play
            </div>
            <button
              onClick={() => { initGame(); setStarted(true); }}
              style={{
                padding: "11px 30px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg,#64DC96,#00b894)",
                color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
            >
              {gameOver ? "Play Again 🐍" : "Start Game 🐍"}
            </button>
          </div>
        )}
      </div>

      <div style={{ color: "#333", fontSize: 12, marginTop: 10 }}>
        Arrow Keys / WASD · avoid walls and yourself
      </div>

      {/* Mobile/Tablet Controls */}
      {isMobile && started && !gameOver && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 60px)",
          gap: 8,
          justifyContent: "center",
          marginTop: 30,
        }}>
          {/* Up Arrow */}
          <div />
          <button
            onClick={() => changeDirection({ x: 0, y: -1 })}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: "2px solid rgba(100,220,150,0.4)",
              background: "rgba(100,220,150,0.1)",
              color: "#64DC96",
              fontSize: 24,
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.25)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.8)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.1)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.4)";
            }}
          >
            ↑
          </button>
          <div />

          {/* Left Arrow */}
          <button
            onClick={() => changeDirection({ x: -1, y: 0 })}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: "2px solid rgba(100,220,150,0.4)",
              background: "rgba(100,220,150,0.1)",
              color: "#64DC96",
              fontSize: 24,
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.25)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.8)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.1)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.4)";
            }}
          >
            ←
          </button>

          {/* Down Arrow */}
          <button
            onClick={() => changeDirection({ x: 0, y: 1 })}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: "2px solid rgba(100,220,150,0.4)",
              background: "rgba(100,220,150,0.1)",
              color: "#64DC96",
              fontSize: 24,
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.25)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.8)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.1)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.4)";
            }}
          >
            ↓
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => changeDirection({ x: 1, y: 0 })}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              border: "2px solid rgba(100,220,150,0.4)",
              background: "rgba(100,220,150,0.1)",
              color: "#64DC96",
              fontSize: 24,
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.25)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.8)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = "rgba(100,220,150,0.1)";
              e.currentTarget.style.borderColor = "rgba(100,220,150,0.4)";
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
