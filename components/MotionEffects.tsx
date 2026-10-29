"use client";

import { useEffect } from "react";

// One pointer listener powers the spotlight, parallax depth, magnetic buttons and 3D tilt.
export default function MotionEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let frame = 0;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      // parallax depth
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          root.style.setProperty("--px", px.toFixed(3));
          root.style.setProperty("--py", py.toFixed(3));
        });
      }

      const target = e.target as Element | null;

      const spot = target?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const mag = target?.closest<HTMLElement>("[data-magnetic]");
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        mag.style.setProperty("--tx", `${(dx * 14).toFixed(1)}px`);
        mag.style.setProperty("--ty", `${(dy * 9).toFixed(1)}px`);
      }

      const tilt = target?.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      }
    };

    const onOut = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const leaving = e.relatedTarget as Node | null;

      const mag = target?.closest<HTMLElement>("[data-magnetic]");
      if (mag && !mag.contains(leaving)) {
        mag.style.setProperty("--tx", "0px");
        mag.style.setProperty("--ty", "0px");
      }

      const tilt = target?.closest<HTMLElement>("[data-tilt]");
      if (tilt && !tilt.contains(leaving)) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
