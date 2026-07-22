import { useEffect, useRef, useState, useCallback } from "react";

const PARTICLE_COUNT = 60;
const CONNECTION_DIST = 120;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
}

const HeroDataViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const [init, setInit] = useState(false);

  const initParticles = useCallback((w: number, h: number) => {
    const p: Particle[] = [];
    const cols = 10;
    const rows = 6;
    const gapX = w / (cols + 1);
    const gapY = h / (rows + 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = gapX * (c + 1) + (Math.random() - 0.5) * 12;
        const baseY = gapY * (r + 1) + (Math.random() - 0.5) * 12;
        p.push({
          x: baseX, y: baseY,
          vx: 0, vy: 0,
          baseX, baseY,
        });
      }
    }
    // pick first 60
    particlesRef.current = p.slice(0, PARTICLE_COUNT);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight * 0.7;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      if (!init) {
        initParticles(w, h);
        setInit(true);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const pts = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.baseX - p.x;
        const dy = p.baseY - p.y;
        p.vx += dx * 0.008;
        p.vy += dy * 0.008;
        p.vx *= 0.92;
        p.vy *= 0.92;

        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 160 && mDist > 0) {
          const force = (160 - mDist) / 160 * 0.6;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.2;
            ctx.strokeStyle = `hsl(240 60% 70% / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.fillStyle = `hsl(240 60% 70% / 0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [init, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)" }}
    />
  );
};

export default HeroDataViz;
