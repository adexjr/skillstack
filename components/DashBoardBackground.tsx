"use client";

import { useEffect, useRef } from "react";

export function DashboardBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame: number | null = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    function handleMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function animate() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (el) {
        el.style.setProperty("--spot-x", `${currentX}px`);
        el.style.setProperty("--spot-y", `${currentY}px`);
      }

      frame = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove);

    if (!prefersReducedMotion) {
      frame = requestAnimationFrame(animate);
    } else if (el) {
      el.style.setProperty("--spot-x", `${currentX}px`);
      el.style.setProperty("--spot-y", `${currentY}px`);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="spotlight-bg pointer-events-none fixed inset-0 z-0"
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
        } as React.CSSProperties
      }
    >
      <style jsx>{`
        .spotlight-bg {
          background-image: radial-gradient(
            rgba(127, 255, 176, 0.35) 1px,
            transparent 1px
          );
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(
            420px circle at var(--spot-x) var(--spot-y),
            black 0%,
            transparent 75%
          );
          mask-image: radial-gradient(
            420px circle at var(--spot-x) var(--spot-y),
            black 0%,
            transparent 75%
          );
          transition: opacity 0.3s ease;
        }

        .spotlight-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            600px circle at var(--spot-x) var(--spot-y),
            rgba(127, 255, 176, 0.08),
            transparent 70%
          );
        }
      `}</style>
    </div>
  );
}