import { useEffect, useMemo, useState } from "react";
import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import tacoIllustration from "@/assets/illustrations/taco.svg";

/**
 * Full-card overlay shown while initial data sync is in progress
 * (trial === "syncing"). Copy is taco-themed to match the illustration.
 *
 * Motion is restrained per §9 — opacity + small translate only, no
 * gradients outside the Aan zone. Sanctioned onboarding moment (§10.5).
 */
const STATUS_MESSAGES = [
  "Fetching campaign performance…",
  "Reconciling orders and ad spend…",
  "Calibrating profitability signals…",
];

export function DataSyncingState() {
  const { trial } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  // 6 x 4 grid of subtle data dots
  const dots = useMemo(() => {
    const cols = 18;
    const rows = 8;
    const arr: { x: number; y: number; delay: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({
          x: (c + 0.5) * (100 / cols),
          y: (r + 0.5) * (100 / rows),
          // diagonal wave: column + row drives delay so it sweeps left->right, top->bottom
          delay: ((c + r) % 12) * 0.18,
        });
      }
    }
    return arr;
  }, []);

  if (!billingFlowEnabled || trial !== "syncing") return null;

  return (
    <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center text-center min-h-[420px] relative overflow-hidden">
      {/* Top shimmer */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 animate-[dataSyncShimmer_1800ms_linear_infinite]"
        style={{ backgroundSize: "200% 100%" }}
      />

      {/* Pulsing data dot grid (background) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {dots.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-foreground/15 animate-[dataDotPulse_2600ms_ease-in-out_infinite]"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: 3,
              height: 3,
              transform: "translate(-50%, -50%)",
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Scanning sweep line */}
      <div
        aria-hidden
        className="absolute inset-x-0 h-px bg-primary/40 pointer-events-none animate-[dataScanSweep_3200ms_ease-in-out_infinite]"
        style={{ top: 0 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <img src={tacoIllustration} alt="" className="h-28 w-auto mb-6" />
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
          Hold tight — we're assembling your taco.
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Crunching numbers, layering insights, and adding the good stuff. Your
          dashboard will fill in as the first sync wraps up.
        </p>

        {/* Live status ticker */}
        <div className="mt-5 h-5 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span
              key={statusIdx}
              className="animate-[fadeInOut_2400ms_ease-in-out] tabular-nums"
            >
              {STATUS_MESSAGES[statusIdx]}
            </span>
          </div>
        </div>
      </div>

      {/* Progress hairline at bottom */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] bg-border overflow-hidden"
      >
        <div className="h-full bg-primary/70 animate-[dataSyncProgress_12000ms_cubic-bezier(0.2,0.0,0.0,1.0)_forwards]" />
      </div>

      <style>{`
        @keyframes dataSyncShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes dataScanSweep {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 0.8; }
          85%  { opacity: 0.8; }
          100% { transform: translateY(420px); opacity: 0; }
        }
        @keyframes dataDotPulse {
          0%, 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.9; transform: translate(-50%, -50%) scale(1.6); background-color: hsl(var(--primary) / 0.6); }
        }
        @keyframes dataSyncProgress {
          0%   { width: 0%; }
          100% { width: 85%; }
        }
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: translateY(2px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[dataScanSweep_3200ms_ease-in-out_infinite\\],
          .animate-\\[dataDotPulse_2600ms_ease-in-out_infinite\\],
          .animate-\\[dataSyncProgress_12000ms_cubic-bezier\\(0\\.2\\,0\\.0\\,0\\.0\\,1\\.0\\)_forwards\\],
          .animate-\\[dataSyncShimmer_1800ms_linear_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
