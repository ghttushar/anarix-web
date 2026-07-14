import { useEffect, useRef, useCallback } from "react";

const phrases = [
  "Less noise",
  "More growth",
  "Scale faster",
  "Total control",
  "Pure clarity",
  "Real results",
  "Zero waste",
];

const TOTAL_SCROLL_DISTANCE = 2600;
const RECT_SCALES = [0.98, 0.88, 0.78, 0.68, 0.58, 0.48, 0.38, 0.28, 0.18, 0.10, 0.05, 0.02];

const TypographyTransition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rectsRef = useRef<(HTMLDivElement | null)[]>([]);

  const progressRef = useRef(0);
  const accumulatedDelta = useRef(0);
  const isLockedRef = useRef(false);
  const currentPhraseRef = useRef(0);
  const rafRef = useRef<number>(0);
  const hasCompletedRef = useRef(false);

  const applyStyles = useCallback((progress: number) => {
    const phraseCount = phrases.length;
    const phraseIndex = Math.min(Math.floor(progress * phraseCount), phraseCount - 1);
    const phraseSubProgress = (progress * phraseCount) - phraseIndex;

    // Tunnel zoom
    const tunnelScale = 1 + progress * 7;
    if (tunnelRef.current) {
      tunnelRef.current.style.transform = `scale(${tunnelScale})`;
    }

    // Text: starts tiny from deep, scales up and blurs as it "hits" the face
    if (textRef.current) {
      // Update text content when phrase changes
      if (phraseIndex !== currentPhraseRef.current) {
        currentPhraseRef.current = phraseIndex;
        const phrase = phrases[phraseIndex];
        const words = phrase.split(" ");
        textRef.current.innerHTML = words
          .map((word, i) =>
            i === words.length - 1
              ? `<span><span class="text-gradient-primary">${word}</span> </span>`
              : `<span>${word} </span>`
          )
          .join("");
      }

      // Scale: 0.3 (far away) -> 1.0 (readable) -> 4.0 (past face)
      const textScale = 0.3 + phraseSubProgress * 3.7;
      // Blur: 0 at readable point (~0.2-0.6), ramps up at ends
      const readableCenter = 0.35;
      const distFromCenter = Math.abs(phraseSubProgress - readableCenter);
      const textBlur = distFromCenter > 0.2 ? (distFromCenter - 0.2) * 40 : 0;
      // Opacity: fade in from 0, peak at center, fade out
      const textOpacity =
        phraseSubProgress < 0.15
          ? phraseSubProgress / 0.15
          : phraseSubProgress > 0.75
            ? 1 - (phraseSubProgress - 0.75) / 0.25
            : 1;

      textRef.current.style.transform = `scale(${textScale})`;
      textRef.current.style.filter = `blur(${textBlur}px)`;
      textRef.current.style.opacity = `${Math.max(0, textOpacity)}`;
    }

    // Lines opacity
    if (linesRef.current) {
      const lines = linesRef.current.querySelectorAll("line");
      lines.forEach((line, i) => {
        const baseOpacity = 0.08 + progress * 0.25;
        line.setAttribute("opacity", `${i % 4 === 0 ? baseOpacity * 1.5 : baseOpacity}`);
      });
    }

    // Rectangle opacities
    rectsRef.current.forEach((rect, i) => {
      if (!rect) return;
      const isOutermost = i === 0;
      const opacity = isOutermost ? 0.6 + progress * 0.2 : 0.03 + i * 0.04 + progress * 0.08;
      const borderW = isOutermost ? "4px" : i === 1 ? "2.5px" : i < 4 ? "1.5px" : "1px";
      rect.style.border = `${borderW} solid hsl(var(--primary) / ${opacity})`;
    });

    // Corner dots
    dotsRef.current.forEach((dot) => {
      if (dot) dot.style.opacity = `${0.3 + progress * 0.5}`;
    });
  }, []);

  const unlock = useCallback(() => {
    isLockedRef.current = false;
    document.body.style.overflow = "";
    document.body.style.overscrollBehavior = "";
  }, []);

  const lock = useCallback(() => {
    isLockedRef.current = true;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Initialize text
    if (textRef.current) {
      const phrase = phrases[0];
      const words = phrase.split(" ");
      textRef.current.innerHTML = words
        .map((word, i) =>
          i === words.length - 1
            ? `<span><span class="text-gradient-primary">${word}</span> </span>`
            : `<span>${word} </span>`
        )
        .join("");
    }
    applyStyles(0);

    const onWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Check if section is in view (sticky area visible)
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const inView = sectionTop <= 0 && sectionBottom >= windowH;

      if (inView && !hasCompletedRef.current) {
        e.preventDefault();
        e.stopPropagation();

        if (!isLockedRef.current) {
          lock();
        }

        accumulatedDelta.current += e.deltaY;
        accumulatedDelta.current = Math.max(0, Math.min(TOTAL_SCROLL_DISTANCE, accumulatedDelta.current));
        const targetProgress = accumulatedDelta.current / TOTAL_SCROLL_DISTANCE;

        // Smooth lerp toward target
        const animate = () => {
          const current = progressRef.current;
          const diff = targetProgress - current;
          if (Math.abs(diff) < 0.0005) {
            progressRef.current = targetProgress;
            applyStyles(targetProgress);

            if (targetProgress >= 1) {
              hasCompletedRef.current = true;
              unlock();
            }
            return;
          }
          progressRef.current = current + diff * 0.09;
          applyStyles(progressRef.current);
          rafRef.current = requestAnimationFrame(animate);
        };

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animate);
      } else if (inView && hasCompletedRef.current && e.deltaY < 0) {
        // Scrolling back up into the section
        e.preventDefault();
        e.stopPropagation();
        hasCompletedRef.current = false;
        lock();

        accumulatedDelta.current = TOTAL_SCROLL_DISTANCE;
        accumulatedDelta.current += e.deltaY;
        accumulatedDelta.current = Math.max(0, accumulatedDelta.current);
        const targetProgress = accumulatedDelta.current / TOTAL_SCROLL_DISTANCE;

        const animate = () => {
          const current = progressRef.current;
          const diff = targetProgress - current;
          if (Math.abs(diff) < 0.0005) {
            progressRef.current = targetProgress;
            applyStyles(targetProgress);
            if (targetProgress <= 0) {
              unlock();
            }
            return;
          }
          progressRef.current = current + diff * 0.09;
          applyStyles(progressRef.current);
          rafRef.current = requestAnimationFrame(animate);
        };

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animate);
      } else if (!inView) {
        // Reset when scrolled away
        if (sectionTop > 0) {
          hasCompletedRef.current = false;
          accumulatedDelta.current = 0;
          progressRef.current = 0;
          applyStyles(0);
        }
        unlock();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      (section as any)._touchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const inView = rect.top <= 0 && rect.bottom >= windowH;

      if (inView && !hasCompletedRef.current) {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const prevTouchY = (section as any)._touchY || touchY;
        const deltaY = prevTouchY - touchY;
        (section as any)._touchY = touchY;

        if (!isLockedRef.current) lock();

        accumulatedDelta.current += deltaY;
        accumulatedDelta.current = Math.max(0, Math.min(TOTAL_SCROLL_DISTANCE, accumulatedDelta.current));
        const targetProgress = accumulatedDelta.current / TOTAL_SCROLL_DISTANCE;

        const animate = () => {
          const current = progressRef.current;
          const diff = targetProgress - current;
          if (Math.abs(diff) < 0.0005) {
            progressRef.current = targetProgress;
            applyStyles(targetProgress);
            if (targetProgress >= 1) {
              hasCompletedRef.current = true;
              unlock();
            }
            return;
          }
          progressRef.current = current + diff * 0.09;
          applyStyles(progressRef.current);
          rafRef.current = requestAnimationFrame(animate);
        };

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(rafRef.current);
      unlock();
    };
  }, [applyStyles, lock, unlock]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background"
      style={{ height: "200vh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 48 radiating lines from center */}
        <svg
          ref={linesRef}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          style={{ overflow: "visible" }}
        >
          {Array.from({ length: 48 }).map((_, i) => {
            const angle = (i * 7.5 * Math.PI) / 180;
            const x2 = 50 + Math.cos(angle) * 120;
            const y2 = 50 + Math.sin(angle) * 120;
            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="hsl(var(--primary))"
                strokeWidth={i % 4 === 0 ? "1.5" : "0.7"}
                opacity="0.08"
              />
            );
          })}
        </svg>

        {/* Nested perspective rectangles */}
        <div
          ref={tunnelRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ willChange: "transform" }}
        >
          {RECT_SCALES.map((scale, i) => (
            <div
              key={i}
              ref={(el) => { rectsRef.current[i] = el; }}
              className="absolute rounded-xl"
              style={{
                width: `${scale * 100}%`,
                aspectRatio: "16 / 9",
                border: `${i === 0 ? "4px" : "1px"} solid hsl(var(--primary) / ${i === 0 ? 0.6 : 0.05})`,
                willChange: "border",
              }}
            />
          ))}
        </div>

        {/* Center text */}
        <div
          ref={textRef}
          className="relative z-10 text-center px-6 pointer-events-none text-4xl sm:text-6xl lg:text-[8rem] font-bold leading-none text-foreground whitespace-nowrap"
          style={{
            willChange: "transform, filter, opacity",
            transform: "scale(0.3)",
            opacity: "0",
          }}
        />

        {/* Corner accent dots */}
        {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map(
          (pos, i) => (
            <div
              key={i}
              ref={(el) => { dotsRef.current[i] = el; }}
              className={`absolute ${pos} w-2 h-2 rounded-full bg-primary/30`}
              style={{ opacity: "0.3" }}
            />
          )
        )}
      </div>
    </section>
  );
};

export default TypographyTransition;
