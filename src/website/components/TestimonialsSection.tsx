import { useRef, useState } from "react";
import { Play, Quote, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import firatImg from "@/assets/testimonials/firat.png";
import jamesImg from "@/assets/testimonials/james.jpg";
import nausilImg from "@/assets/testimonials/nausil.png";

const TESTIMONIALS = [
  {
    quote:
      "Anarix helped us rethink how we approach growth on Walmart-from a conversion-first mindset to a true full-funnel strategy. By unlocking visibility at the top of the funnel and executing with precision throughout the shopper journey, they turned an underperforming SKU into a meaningful omnichannel growth driver. The impact on both new customer acquisition and total sales has been exceptional.",
    author: "Firat Ozkan",
    role: "Co-Founder, CMO & CSO",
    company: "Mount-It!",
    image: firatImg,
  },
];

const BOTTOM_TESTIMONIAL = {
  quote:
    "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
  author: "James Ellington",
  role: "Sr. Director of Sales, Retail Division",
  company: "Drive Medical",
  image: jamesImg,
};

const VIDEO_TESTIMONIAL = {
  src: "/testimonials/video.mp4",
  quote:
    "Working with Anarix has been a game changer. In just my second month, I've already seen a 20–22% increase in sales. They're rebuilding my website, helping grow my Amazon presence, and now expanding into Walmart and TikTok Shop. Excited for what's next!",
  author: "Nausil Zaheer (Nas)",
  role: "Owner, Karma Organics",
  image: nausilImg,
};

const LOGO_WALL = ["Mount-It!", "Drive Medical", "Aurelius", "Northwind", "Halcyon", "Verata"];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play();
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
            <div className="flex items-center gap-3 border-t border-border pt-5">
              <Avatar className="h-10 w-10">
                <AvatarImage src={TESTIMONIALS[0].image} alt={TESTIMONIALS[0].author} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-periwinkle text-primary-foreground font-bold">
                  {TESTIMONIALS[0].author[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground">{TESTIMONIALS[0].author}</div>
                <div className="text-xs text-muted-foreground">
                  {TESTIMONIALS[0].role} · {TESTIMONIALS[0].company}
                </div>
              </div>
            </div>
          </article>

          {/* Video testimonial card - top right (vertical) */}
          <article
            className={`lg:col-span-5 relative rounded-3xl border border-border shadow-medium overflow-hidden transition-all duration-500 flex flex-col ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: isVisible ? "140ms" : "0ms",
              background: "linear-gradient(140deg, hsl(var(--foreground)) 0%, hsl(var(--periwinkle-dark, var(--primary))) 100%)",
            }}
          >
            <div className="relative aspect-[9/16] bg-foreground/20">
              <video
                ref={videoRef}
                src={VIDEO_TESTIMONIAL.src}
                controls={playing}
                playsInline
                onEnded={() => setPlaying(false)}
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
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-pill bg-background/85 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                Customer Story
              </div>
            </div>
            <div className="p-6 flex flex-col gap-5 text-background">
              <p className="text-base sm:text-lg leading-[1.5] italic opacity-95">
                "{VIDEO_TESTIMONIAL.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-background/15">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={VIDEO_TESTIMONIAL.image} alt={VIDEO_TESTIMONIAL.author} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-periwinkle to-primary text-primary-foreground font-bold">
                    {VIDEO_TESTIMONIAL.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{VIDEO_TESTIMONIAL.author}</div>
                  <div className="text-xs opacity-70">{VIDEO_TESTIMONIAL.role}</div>
                </div>
              </div>
            </div>
          </article>

          {/* Bottom full-width text-only quote */}
          <article
            className={`lg:col-span-12 relative p-10 sm:p-14 rounded-3xl bg-card border border-border shadow-soft overflow-hidden transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: isVisible ? "220ms" : "0ms" }}
          >
            <div
              className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--periwinkle) / 0.4), transparent 70%)" }}
            />
            <Quote className="w-10 h-10 text-primary/30 mb-5" strokeWidth={1.5} />
            <p className="font-display text-xl sm:text-2xl text-foreground leading-[1.45] tracking-tight mb-8 max-w-4xl">
              "{BOTTOM_TESTIMONIAL.quote}"
            </p>
            <div className="flex items-center gap-3 border-t border-border pt-5">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={BOTTOM_TESTIMONIAL.image} alt={BOTTOM_TESTIMONIAL.author} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-periwinkle to-primary text-primary-foreground font-bold">
                  {BOTTOM_TESTIMONIAL.author[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground">{BOTTOM_TESTIMONIAL.author}</div>
                <div className="text-xs text-muted-foreground">
                  {BOTTOM_TESTIMONIAL.role} · {BOTTOM_TESTIMONIAL.company}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
