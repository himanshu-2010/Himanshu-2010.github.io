import { useState, useEffect, useRef } from "react";

export default function TypingText({ texts, speed = 80 }) {
  const [displayed, setDisplayed] = useState("");
  const idxRef      = useRef(0);
  const charIdxRef  = useRef(0);
  const deletingRef = useRef(false);
  const timerRef    = useRef(null);

  useEffect(() => {
    const tick = () => {
      const current = texts[idxRef.current];

      if (!deletingRef.current) {
        if (charIdxRef.current < current.length) {
          charIdxRef.current += 1;
          setDisplayed(current.slice(0, charIdxRef.current));
          timerRef.current = setTimeout(tick, speed);
        } else {
          // Done typing — pause then start deleting
          timerRef.current = setTimeout(() => {
            deletingRef.current = true;
            tick();
          }, 1600);
        }
      } else {
        if (charIdxRef.current > 0) {
          charIdxRef.current -= 1;
          setDisplayed(current.slice(0, charIdxRef.current));
          timerRef.current = setTimeout(tick, speed / 2);
        } else {
          // Done deleting — move to next word
          deletingRef.current = false;
          idxRef.current = (idxRef.current + 1) % texts.length;
          timerRef.current = setTimeout(tick, speed);
        }
      }
    };

    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [texts, speed]);

  return (
    <span>
      {displayed}
      <span style={{ animation: "blink 1s step-end infinite", color: "#64DC96" }}>|</span>
    </span>
  );
}
