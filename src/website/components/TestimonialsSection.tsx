import { useRef, useState } from "react";
import { Play, Quote, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const TESTIMONIALS = [
  {
    quote:
      "Anarix helped us rethink how we approach growth on Walmart-from a conversion-first mindset to a true full-funnel strategy. By unlocking visibility at the top of the funnel and executing with precision throughout the shopper journey, they turned an underperforming SKU into a meaningful omnichannel growth driver. The impact on both new customer acquisition and total sales has been exceptional.",
    author: "Firat Ozkan",
    role: "Co-Founder, CMO & CSO",
    company: "Mount-It!",
    chips: ["+62% New-to-Brand", "3.4x ROAS", "Walmart"],
  },
  {
    quote:
      "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
    author: "James Ellington",
    role: "Sr. Director of Sales, Retail Division",
    company: "Drive Medical",
    chips: ["+38% Sales", "-22% TACoS", "Amazon"],
  },
];

const VIDEO_TESTIMONIAL = {
  src: "/testimonials/video.mp4",
  poster: "/testimonials/poster.jpg",
  quote:
    "Since partnering with Anarix, we have seen tremendous improvements - strong sales growth and dramatically improved spend efficiencies.",
  author: "James Ellington",
  role: "Sr. Director of Sales, Drive Medical",
};

const LOGO_WALL = ["Mount-It!", "Drive Medical", "Aurelius", "Northwind", "Halcyon", "Verata"];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <section
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
    >
      {/* Layered backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-background to-accent/20" />
      <div
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top left, hsl(var(--primary) / 0.12), transparent 55%), radial-gradient(ellipse at bottom right, hsl(var(--periwinkle) / 0.18), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" /> Important voices
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-3 leading-[1.05] tracking-tight">
            Not many testimonials.{" "}
            <span className="text-gradient-primary italic">The ones that matter.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We grow quietly with operators who measure us in revenue, not screenshots. Here's what a few of them have said.
          </p>
        </div>

        {/* Logo wall strip */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-14 pb-8 border-b border-border/60">
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
            Trusted by operators at
          </span>
          {LOGO_WALL.map((b) => (
            <span
              key={b}
              className="text-sm font-semibold text-foreground/55 hover:text-foreground/90 transition-colors tracking-tight"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quote 1 - large pull-quote */}
          <article
            className={`lg:col-span-7 relative p-10 rounded-3xl bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-500 overflow-hidden ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: isVisible ? "60ms" : "0ms" }}
          >
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)" }}
            />
            <Quote className="w-12 h-12 text-primary/30 mb-5" strokeWidth={1.5} />
            <p className="font-display text-2xl sm:text-[28px] text-foreground leading-[1.35] tracking-tight mb-8">
              "{TESTIMONIALS[0].quote}"
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {TESTIMONIALS[0].chips.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-pill bg-primary/8 border border-primary/20 text-[11px] font-semibold text-primary tracking-tight">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-periwinkle flex items-center justify-center text-primary-foreground font-bold">
                {TESTIMONIALS[0].author[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{TESTIMONIALS[0].author}</div>
                <div className="text-xs text-muted-foreground">
                  {TESTIMONIALS[0].role} · {TESTIMONIALS[0].company}
                </div>
              </div>
            </div>
          </article>

          {/* Quote 2 - dark accent card */}
          <article
            className={`lg:col-span-5 relative p-8 rounded-3xl border border-border shadow-soft overflow-hidden transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: isVisible ? "140ms" : "0ms",
              background: "linear-gradient(140deg, hsl(var(--card)), hsl(var(--accent) / 0.8))",
            }}
          >
            <Quote className="w-10 h-10 text-primary/40 mb-4" strokeWidth={1.5} />
            <p className="text-foreground text-base sm:text-[17px] leading-relaxed mb-6">
              "{TESTIMONIALS[1].quote}"
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {TESTIMONIALS[1].chips.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-pill bg-background/60 border border-border text-[11px] font-semibold text-foreground/80 tracking-tight">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-periwinkle to-primary flex items-center justify-center text-primary-foreground font-bold">
                {TESTIMONIALS[1].author[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{TESTIMONIALS[1].author}</div>
                <div className="text-xs text-muted-foreground">
                  {TESTIMONIALS[1].role} · {TESTIMONIALS[1].company}
                </div>
              </div>
            </div>
          </article>

          {/* Video testimonial - full width, dark */}
          <article
            className={`lg:col-span-12 rounded-3xl border border-border shadow-medium overflow-hidden transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: isVisible ? "220ms" : "0ms",
              background: "linear-gradient(120deg, hsl(var(--foreground)) 0%, hsl(var(--periwinkle-dark, var(--primary))) 100%)",
            }}
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto md:min-h-[320px] bg-foreground/20">
                <video
                  ref={videoRef}
                  src={VIDEO_TESTIMONIAL.src}
                  poster={VIDEO_TESTIMONIAL.poster}
                  controls={playing}
                  className="absolute inset-0 w-full h-full object-cover"
                  preload="metadata"
                />
                {!playing && (
                  <button
                    onClick={play}
                    className="absolute inset-0 flex items-center justify-center bg-foreground/30 hover:bg-foreground/20 transition-colors group"
                    aria-label="Play testimonial"
                  >
                    <span className="relative w-20 h-20 rounded-full bg-background/95 flex items-center justify-center shadow-strong group-hover:scale-105 transition-transform">
                      <span
                        className="absolute inset-0 rounded-full opacity-60 blur-md"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--periwinkle)))" }}
                      />
                      <Play className="relative w-8 h-8 text-primary translate-x-0.5" fill="currentColor" />
                    </span>
                  </button>
                )}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-pill bg-background/85 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  Customer Story · 02:14
                </div>
              </div>
              <div className="p-10 flex flex-col justify-center text-background">
                <Quote className="w-10 h-10 mb-5 opacity-60" strokeWidth={1.5} />
                <p className="font-display text-xl sm:text-2xl leading-snug tracking-tight mb-8">
                  "{VIDEO_TESTIMONIAL.quote}"
                </p>
                <div className="border-t border-background/20 pt-5">
                  <div className="text-sm font-semibold">{VIDEO_TESTIMONIAL.author}</div>
                  <div className="text-xs opacity-70">{VIDEO_TESTIMONIAL.role}</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
