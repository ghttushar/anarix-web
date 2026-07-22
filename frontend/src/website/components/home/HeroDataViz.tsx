import { useEffect, useRef, useState, useCallback } from "react";

const PARTICLE_COUNT = 120;
const CONNECTION_DIST = 150;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
  hue: number; sat: number; light: number;
  radius: number; alpha: number;
  pulseOffset: number;
}

const HeroDataViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const [init, setInit] = useState(false);

  const initParticles = useCallback((w: number, h: number) => {
    const p: Particle[] = [];
    const cols = 14;
    const rows = 8;
    const gapX = w / (cols + 1);
    const gapY = h / (rows + 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = gapX * (c + 1) + (Math.random() - 0.5) * 18;
        const baseY = gapY * (r + 1) + (Math.random() - 0.5) * 18;
        const isAccent = Math.random() < 0.3;
        p.push({
          x: baseX, y: baseY,
          vx: 0, vy: 0,
          baseX, baseY,
          hue: isAccent ? 230 + Math.random() * 30 : 240 + Math.random() * 20,
          sat: isAccent ? 70 + Math.random() * 20 : 50 + Math.random() * 20,
          light: isAccent ? 65 + Math.random() * 15 : 60 + Math.random() * 15,
          radius: isAccent ? 2 + Math.random() * 1.5 : 1 + Math.random() * 1.5,
          alpha: 0.5 + Math.random() * 0.5,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }
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
      const h = window.innerHeight * 0.75;
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

    let time = 0;
    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const pts = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw subtle pulsing glow ring at center
      const cx = w * 0.5;
      const cy = h * 0.45;
      const pulse = Math.sin(time * 1.5) * 0.3 + 0.7;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      grad.addColorStop(0, `hsla(240, 60%, 70%, ${0.06 * pulse})`);
      grad.addColorStop(0.5, `hsla(240, 60%, 70%, ${0.02 * pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();

      // Subtle rotating ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.3);
      ctx.strokeStyle = `hsla(240, 60%, 70%, ${0.04 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 120, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Update particles
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.baseX - p.x;
        const dy = p.baseY - p.y;
        p.vx += dx * 0.006;
        p.vy += dy * 0.006;
        p.vx *= 0.93;
        p.vy *= 0.93;

        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 200 && mDist > 0) {
          const force = (200 - mDist) / 200 * 0.8;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.25;
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 60%, 65%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles with glow
      for (const p of pts) {
        const pulseAlpha = p.alpha * (0.7 + Math.sin(time * 2 + p.pulseOffset) * 0.3);

        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        glow.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${pulseAlpha * 0.3})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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
      style={{ maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 30%, transparent 80%)" }}
    />
  );
};

export default HeroDataViz;
