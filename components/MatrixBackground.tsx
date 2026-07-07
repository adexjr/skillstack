"use client";

import { useEffect, useRef } from "react";

const CHARACTERS =
  "01{}[]()<>/;=+-*&|!?constletvarfunctionreturnifelsewhileforconsolelog";

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 15;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(1);

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }

    window.addEventListener("resize", handleResize);

    function draw() {
      if (!ctx) return;

      ctx.fillStyle = "rgba(11, 13, 18, 0.06)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        ctx.fillStyle =
          brightness > 0.92
            ? "rgba(212, 255, 230, 0.9)"
            : "rgba(127, 255, 176, 0.35)";

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]"
    />
  );
}
