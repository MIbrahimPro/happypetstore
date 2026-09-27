"use client";

import { useEffect, useRef } from "react";

type SwiggleProps = {
  className?: string;
  color?: string;
  strokeWidth?: number;
};

/**
 * A living hand-drawn squiggle. The middle control point drifts toward the
 * pointer, so the line leans and wiggles like a wagging tail. Idle state is
 * a slow gentle sway. Pointer events are window-level so any swiggle on the
 * page reacts as the mouse travels.
 */
export default function Swiggle({
  className = "",
  color = "var(--amber)",
  strokeWidth = 7,
}: SwiggleProps) {
  const midRef = useRef<SVGPathElement>(null);
  const target = useRef({ x: 0.5, y: 0.18 });
  const pos = useRef({ x: 0.5, y: 0.18 });
  const raf = useRef<number>(0);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const el = midRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // normalized pointer position relative to the swiggle's own box,
      // clamped so it leans without leaving the frame
      target.current = {
        x: Math.min(1.15, Math.max(-0.15, (e.clientX - r.left) / r.width)),
        y: Math.min(1.2, Math.max(-0.4, (e.clientY - r.top) / Math.max(1, r.height))),
      };
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    function tick() {
      pos.current.x += (target.current.x - pos.current.x) * 0.06;
      pos.current.y += (target.current.y - pos.current.y) * 0.06;
      const t = Date.now() / 1000;
      const idleY = 0.18 + Math.sin(t * 1.4) * 0.06;
      const cx = pos.current.x * 100;
      const cy = (pos.current.y * 40 + idleY * 60).toFixed(1);
      const el = midRef.current;
      if (el) {
        el.setAttribute(
          "d",
          `M2 10 C 30 ${cy} ${cx.toFixed(1)} ${(40 - Number(cy)).toFixed(1)} 98 8`
        );
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        ref={midRef}
        d="M2 10 C 30 8 70 30 98 8"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
