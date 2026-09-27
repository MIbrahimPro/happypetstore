"use client";

import { useEffect, useRef } from "react";

/**
 * Paw-print cursor trail, now with full touch support.
 *
 * - Mouse: stamps a paw every ~70px of travel on a walking gait.
 * - Touch: press-and-drag (scrolling, swiping) leaves the same trail under
 *   the finger; a quick tap bursts a small scatter of paws at the tap point.
 * - Any click on a button/link/card pops a paw out of the press point.
 *
 * Layer is fixed + pointer-events-none, so nothing blocks taps. All work
 * happens on passive listeners; each stamp self-removes via timeout.
 */
export default function PawTrail() {
  const layer = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0, acc: 0, step: 0 });

  useEffect(() => {
    const el = layer.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    function stamp(x: number, y: number, dx: number, dy: number, big = false) {
      const paw = document.createElement("span");
      paw.className = "paw";
      const side = last.current.step % 2 === 0 ? 1 : -1;
      last.current.step += 1;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI || 0;
      paw.style.left = `${x + side * 7}px`;
      paw.style.top = `${y + side * 5}px`;
      paw.style.setProperty("--paw-rot", `${ang + side * 24}deg`);
      paw.innerHTML = big ? PAW_BIG : PAW;
      el!.appendChild(paw);
      setTimeout(() => paw.remove(), 1200);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return; // touch is handled by touch listeners
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      const dist = Math.hypot(dx, dy);
      last.current.acc += dist;
      if (last.current.acc < 72) return;
      last.current.acc = 0;
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      stamp(e.clientX, e.clientY, dx, dy, e.pointerType !== "mouse");
    }

    /* touch: press and drag scatters paws under the finger as the page scrolls */
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      last.current.x = t.clientX;
      last.current.y = t.clientY;
      last.current.acc = 60; // start close to the stamp threshold
    }
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - last.current.x;
      const dy = t.clientY - last.current.y;
      const dist = Math.hypot(dx, dy);
      last.current.acc += dist;
      if (last.current.acc < 64) return;
      last.current.acc = 0;
      last.current.x = t.clientX;
      last.current.y = t.clientY;
      stamp(t.clientX, t.clientY, dx, dy, true);
    }
    /* a still press-and-lift (tap) leaves a small paw burst */
    function onTouchEnd(e: TouchEvent) {
      const t = e.changedTouches[0];
      if (!t) return;
      const moved = Math.hypot(t.clientX - last.current.x, t.clientY - last.current.y);
      if (moved > 24) return; // that was a swipe, not a tap
      burst(t.clientX, t.clientY);
    }

    /* paw burst helper: 4 paws fanning up from a point */
    function burst(x: number, y: number) {
      const dirs: [number, number][] = [
        [-16, -30],
        [14, -34],
        [-4, -40],
        [26, -22],
      ];
      dirs.forEach(([dx, dy], i) => {
        const paw = document.createElement("span");
        paw.className = "paw";
        paw.style.left = `${x + dx * 0.4}px`;
        paw.style.top = `${y + dy * 0.4}px`;
        paw.style.setProperty("--paw-rot", `${-10 + i * 22}deg`);
        paw.style.animation = `pawfade 0.9s ease-out ${i * 45}ms forwards`;
        paw.innerHTML = PAW;
        el!.appendChild(paw);
        setTimeout(() => paw.remove(), 1300);
      });
    }

    /* click on any control: one paw pops out of the press point (mouse only;
       touch gets the release burst instead so taps don't double-effect) */
    function onPointerDown(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hit = target.closest("a, button, .softcard, [role='button']");
      if (!hit) return;
      const paw = document.createElement("span");
      paw.className = "paw-pop";
      paw.style.left = `${e.clientX}px`;
      paw.style.top = `${e.clientY}px`;
      paw.style.setProperty("--paw-rot", `${-20 + Math.random() * 40}deg`);
      paw.style.setProperty("--paw-dx", `${-10 + Math.random() * 20}px`);
      paw.style.setProperty("--paw-dy", `${-26 - Math.random() * 14}px`);
      paw.innerHTML = PAW;
      el!.appendChild(paw);
      setTimeout(() => paw.remove(), 650);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
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

const PAW_BIG = `<svg viewBox="0 0 24 24" width="26" height="26" fill="#8A8378" opacity="0.55">
  <ellipse cx="12" cy="15.5" rx="5" ry="4.2"/>
  <ellipse cx="5.5" cy="10" rx="2.1" ry="2.8" transform="rotate(-18 5.5 10)"/>
  <ellipse cx="9.7" cy="6.6" rx="2.1" ry="2.9" transform="rotate(-6 9.7 6.6)"/>
  <ellipse cx="14.3" cy="6.6" rx="2.1" ry="2.9" transform="rotate(6 14.3 6.6)"/>
  <ellipse cx="18.5" cy="10" rx="2.1" ry="2.8" transform="rotate(18 18.5 10)"/>
</svg>`;
