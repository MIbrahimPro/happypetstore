"use client";

import { useEffect, useRef } from "react";

/**
 * Paw-print cursor trail. Stamps a small paw every ~70px of travel, on a
 * diagonal cycle like a real walking gait, fading out over ~1s. Renders a
 * tiny inline SVG per print; layer is pointer-events-none.
 */
export default function PawTrail() {
  const layer = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0, acc: 0, step: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const el = layer.current;
      if (!el) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      const dist = Math.hypot(dx, dy);
      last.current.acc += dist;
      if (last.current.acc < 72) return;
      last.current.acc = 0;
      last.current.x = e.clientX;
      last.current.y = e.clientY;

      const paw = document.createElement("span");
      paw.className = "paw";
      // alternate prints left/right of the path like a walk
      const side = last.current.step % 2 === 0 ? 1 : -1;
      last.current.step += 1;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      const rot = ang + side * 24;
      paw.style.left = `${e.clientX + side * 7}px`;
      paw.style.top = `${e.clientY + side * 5}px`;
      paw.style.setProperty("--paw-rot", `${rot}deg`);
      paw.innerHTML = PAW;
      el.appendChild(paw);
      setTimeout(() => paw.remove(), 1200);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div id="paw-trail" ref={layer} aria-hidden="true" />;
}

const PAW = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#8A8378" opacity="0.5">
  <ellipse cx="12" cy="15.5" rx="5" ry="4.2"/>
  <ellipse cx="5.5" cy="10" rx="2.1" ry="2.8" transform="rotate(-18 5.5 10)"/>
  <ellipse cx="9.7" cy="6.6" rx="2.1" ry="2.9" transform="rotate(-6 9.7 6.6)"/>
  <ellipse cx="14.3" cy="6.6" rx="2.1" ry="2.9" transform="rotate(6 14.3 6.6)"/>
  <ellipse cx="18.5" cy="10" rx="2.1" ry="2.8" transform="rotate(18 18.5 10)"/>
</svg>`;
