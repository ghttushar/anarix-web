import { useRef, useEffect, useCallback, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
const TARGET_LINE1 = "From scattered spreadsheets to one source of truth";
const TARGET_LINE2 = "Anarix unifies every marketplace into a single live P&L.";

// Two concentric rings
const INNER_RING = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * Math.PI * 2,
  img: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 10}.jpg`,
}));

const OUTER_RING = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2,
  img: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i + 30}.jpg`,
}));

const CycloneScrollSection = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerAvatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outerAvatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(-1);
  const scrambleTriggeredRef = useRef(false);
  const scrambleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [scrambleProgress, setScrambleProgress] = useState(0);

  // Auto-trigger scramble at 25% scroll
  const triggerScramble = useCallback(() => {
    if (scrambleTriggeredRef.current) return;
    scrambleTriggeredRef.current = true;

    let p = 0;
    scrambleIntervalRef.current = setInterval(() => {
      p += 0.02;
      if (p >= 1) {
        p = 1;
        if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
      }
      setScrambleProgress(p);
    }, 40);
  }, []);

  // Update text when scrambleProgress changes
  useEffect(() => {
    const p = scrambleProgress;
    if (line1Ref.current) {
      const text = buildScramble(TARGET_LINE1, p);
      if (p >= 0.95) {
        const idx = TARGET_LINE1.lastIndexOf("source of truth");
        line1Ref.current.innerHTML =
          TARGET_LINE1.slice(0, idx) +
          `<span class="text-gradient-primary font-extrabold italic">${TARGET_LINE1.slice(idx)}</span>`;
      } else {
        line1Ref.current.textContent = text;
      }
    }
    if (line2Ref.current) {
      line2Ref.current.textContent = buildScramble(TARGET_LINE2, Math.max(0, p * 1.3 - 0.3));
    }
  }, [scrambleProgress]);

  const updateFrame = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const rect = outer.getBoundingClientRect();
    const scrollRange = outer.offsetHeight - window.innerHeight;
    const rawProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));

    if (Math.abs(rawProgress - lastProgressRef.current) < 0.001) {
      rafRef.current = requestAnimationFrame(updateFrame);
      return;
    }
    lastProgressRef.current = rawProgress;

    // Trigger scramble at 25%
    if (rawProgress >= 0.25) triggerScramble();

    const vw = Math.min(window.innerWidth * 0.4, 400);
    const innerMaxR = vw;
    const innerMinR = 180;
    const outerMaxR = vw * 1.35;
    const outerMinR = 240;

    const innerRadius = innerMaxR - (innerMaxR - innerMinR) * rawProgress;
    const outerRadius = outerMaxR - (outerMaxR - outerMinR) * rawProgress;

    const rotationInner = rawProgress * Math.PI * 1.5;
    const rotationOuter = -rawProgress * Math.PI * 1.2;

    for (let i = 0; i < INNER_RING.length; i++) {
      const el = innerAvatarRefs.current[i];
      if (!el) continue;
      const angle = INNER_RING[i].angle + rotationInner;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = `${0.5 + 0.5 * rawProgress}`;
    }

    for (let i = 0; i < OUTER_RING.length; i++) {
      const el = outerAvatarRefs.current[i];
      if (!el) continue;
      const angle = OUTER_RING[i].angle + rotationOuter;
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = `${0.4 + 0.6 * rawProgress}`;
    }

    rafRef.current = requestAnimationFrame(updateFrame);
  }, [triggerScramble]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateFrame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
    };
  }, [updateFrame]);

  return (
    <section ref={outerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Inner ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {INNER_RING.map((a, i) => (
            <div
              key={`inner-${i}`}
              ref={(el) => { innerAvatarRefs.current[i] = el; }}
              className="absolute w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md border-2 border-background"
              style={{ opacity: 0.5, willChange: "transform, opacity" }}
            >
              <img src={a.img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Outer ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {OUTER_RING.map((a, i) => (
            <div
              key={`outer-${i}`}
              ref={(el) => { outerAvatarRefs.current[i] = el; }}
              className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md border-2 border-background"
              style={{ opacity: 0.4, willChange: "transform, opacity" }}
            >
              <img src={a.img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Center text */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <span
            ref={line1Ref}
            className="block font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight"
          >
            {TARGET_LINE1.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")}
          </span>
          <span
            ref={line2Ref}
            className="block mt-4 text-lg sm:text-xl text-muted-foreground"
          >
            {TARGET_LINE2.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")}
          </span>
        </div>
      </div>
    </section>
  );
};

function buildScramble(target: string, progress: number): string {
  const result: string[] = [];
  for (let i = 0; i < target.length; i++) {
    if (target[i] === " ") { result.push(" "); continue; }
    const cp = (progress * target.length - i * 0.6) / (target.length * 0.4);
    if (cp >= 1) result.push(target[i]);
    else if (cp > 0) result.push(Math.random() > 0.5 ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)]);
    else result.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
  }
  return result.join("");
}

export default CycloneScrollSection;
